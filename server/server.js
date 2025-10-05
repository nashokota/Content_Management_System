import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';

// list of schemas
import User from './Schema/User.js';

const server = express();
let PORT = process.env.PORT || 3000;
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
})

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
    bcrypt.hash(password, 10, (err, hashed_password) => {
        let username = email.split("@")[0];

        let user = new User({
            personal_info: {fullname,email,password: hashed_password,username}
        })
        user.save().then((u) => {
            
    });

    return res.status(200).json({"message": "Signed up successfully!"});
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default server;