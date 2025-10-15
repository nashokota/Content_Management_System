import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from "firebase-admin";

//
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key safely
const serviceAccountKey = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, './cms-website-a771e-firebase-adminsdk-fbsvc-d254091fb9.json'),
    'utf8'
  )
);
//


// list of schemas
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';


const server = express();
let PORT = process.env.PORT || 3000;


admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
})

const verifyJWT = (req,res,next) =>{

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null){
        return res.status(401).json({error:"No access token"});
    }
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if(err){
             return res.status(403).json({error:"Invalid access token"});
            }
        req.user = user.id;
        next();
    })
}

const formatDatatoSend = (user) => {

    const access_token = jwt.sign({id:user._id}, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img:user.personal_info.profile_img,
        username:user.personal_info.username,
        fullname:user.personal_info.fullname 
    };
};

const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result)=> result)

    isUsernameNotUnique ? username += nanoid().substring(0,5): "";
    return username;
}

server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;

    //validating data from frontend
    if(fullname.length < 3) {
        return res.status(403).json({"error": "Full name must be at least 3 characters long."});
    }
    if(!email.length) {
        return res.status(403).json({"error": "Enter a valid email."});
    }
    if(!emailRegex.test(email)) {
        return res.status(403).json({"error": "Email is invalid."});
    }
    if(!passwordRegex.test(password)) {
        return res.status(403).json({"error": "Password must be between 6 to 20 characters long and contain at least one numeric digit, one uppercase and one lowercase letter."});
    }
    
    //hashing password
    bcrypt.hash(password, 10, async (err, hashed_password) => {
        let username = await generateUsername(email);

        let user = new User({
            personal_info: {fullname,email,password: hashed_password,username}
        })
        user.save().then((u) => {
            return res.status(200).json(formatDatatoSend(u))
        }).catch(err => {
            if(err.code === 11000) {
                return res.status(500).json({"error": "Email already exists."});
            }
                return res.status(500).json({"error": err.message});
        });
});
});

server.post("/signin", (req, res) => {
    let { email, password } = req.body;

    User.findOne({"personal_info.email": email}).then((user) => {
        if(!user) {
            return res.status(403).json({"error": "Email not found."});
        }
        if(!user.google_auth){
            bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if(err) {
                return res.status(403).json({"error": "Error occured while login please try again."});
            }
            if(!result) {
                return res.status(403).json({"error": "Password is incorrect."});
            }else{
                return res.status(200).json(formatDatatoSend(user));
            } 
        });
        }else{
            return res.status(403).json({"error": "Account was created using google. Please try logging in with Google."});
        }
    }).catch(err => {
        console.log(err.message);
        return res.status(500).json({"error": err.message});
    });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.post("/google-auth", async (req, res) => {
  const { access_token: idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required." });
  }

  try {
    // ✅ CORRECT: Use firebase-admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture } = decodedToken;
    const profile_img = picture.replace("s96-c", "s384-c");

    let user = await User.findOne({ "personal_info.email": email });

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({
          error: "This email was signed up without Google. Please log in with email and password."
        });
      }
      // Existing Google user → log in
      return res.status(200).json(formatDatatoSend(user));
    } else {
      // New Google user → create account
      const username = await generateUsername(email);
      user = new User({
        personal_info: { fullname: name, email, profile_img, username },
        google_auth: true
      });
      await user.save();
      return res.status(200).json(formatDatatoSend(user));
    }
  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({ error: "Invalid Google ID token." });
  }
});

server.post('/latest-blogs', (req, res) => {
    let { page } = req.body;
    let maxLimit = 5;
    Blog.find({draft: false})
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt": -1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page-1)*maxLimit)
    .limit(maxLimit)
    .then(blogs =>{
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({error: err.message});
    });
});

server.post("/all-latest-blogs-count", (req, res) => {
    Blog.countDocuments({draft: false})
    .then(count => {
        return res.status(200).json({totalDocs: count});
    })
    .catch(err => {
        return res.status(500).json({error: err.message});
    });
});

server.get("/trending-blogs", (req, res) => {
    Blog.find({draft: false})
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"activity.total_reads": -1, "activity.total_likes": -1, "publishedAt": -1})
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then(blogs =>{
        return res.status(200).json({blogs})
    })
    .catch(err => {
        return res.status(500).json({error: err.message});
    });
        
})

server.post("/search-blogs", (req, res) => {
    let { tag, query, page } = req.body;
    let findQuery;

    if(tag) {
        findQuery = { tags: tag, draft: false };
    }else if(query) {
        findQuery = { title: new RegExp(query, "i"), draft: false };
    }
    let maxLimit = 2;
    Blog.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt": -1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page-1)*maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({error: err.message});
    });
})

server.post("/search-blogs-count", (req, res) => {
    let { tag, query } = req.body;
    let findQuery;
    if(tag) {
        findQuery = { tags: tag, draft: false };
    }else if(query) {
        findQuery = { title: new RegExp(query, "i"), draft: false };
    }
    Blog.countDocuments(findQuery)
    .then(count => {
        return res.status(200).json({totalDocs: count});
    })
    .catch(err => {
        return res.status(500).json({error: err.message});
    });
})

server.post("/create-blog",verifyJWT, (req, res) => {
    
    let authorId = req.user;
    let { title, des, banner, tags, content, draft } = req.body;
    
    if(!title.length){
        return res.status(403).json({error: "You must provide a title"});
    }
    if(!draft){
        if(!des.length || des.length>200){
        return res.status(403).json({error: "You must provide blog description under 200 characters"});
    }
    if(!banner.length){
        return res.status(403).json({error: "You must provide a blog banner to publish it"});
    }
    if(!content.blocks.length){
        return res.status(403).json({error: "There must be some blog content to publish it"});
    }
    if(!tags.length || tags.length>10){
        return res.status(403).json({error: "You must provide blog tags to publish it"});
    }
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();
    
    let blog = new Blog({
         title, des, banner, content, tags, author:authorId, blog_id, draft: Boolean(draft) 
        });
    
    blog.save().then((blog) => {
        let incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate({_id: authorId}, {$inc: {"account_info.total_posts": incrementVal}, $push: {"blogs": blog._id}}).then((user) => {
            return res.status(200).json({id:blog.blog_id});
        }).catch(err => {
            return res.status(500).json({error: "Failed to update total posts number"});
        });
    }).catch(err => {
        return res.status(500).json({error: err.message});
    });
});

export default server;