# Content Management System 

A full-stack blogging platform , built with React and Node.js. This CMS features a rich text editor, user authentication, blog management, comments system, edit profile and a beautiful theme.

![Project Banner](./website%20-%20frontend/src/imgs/blog%20banner.png)

## ✨ Features

### 📝 Content Creation & Management
- **Rich Text Editor**: Powered by EditorJS with support for:
  - Headers, paragraphs, and lists
  - Code blocks with syntax highlighting
  - Inline code and markers
  - Images and embeds
  - Links and quotes
- **Draft System**: Save blogs as drafts and publish when ready
- **Blog Management Dashboard**: View, edit, and delete your published blogs and drafts
- **Tag System**: Organize blogs with tags for better discoverability

### 👤 User Features
- **Authentication**: 
  - Email/Password signup and signin
  - Google Auth integration
  - JWT-based secure authentication
- **User Profiles**: 
  - Customizable profile with bio, username, and social links
  - Profile image upload via Cloudinary
  - View other users' profiles and their blogs
- **Password Management**: Secure password change functionality

### 💬 Social Interactions
- **Comment System**: 
  - Add comments and replies to blogs
  - Nested comment threads
- **Like System**: Like blogs and track engagement

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Smooth Animations**: Framer Motion powered transitions
- **Toast Notifications**: Real-time feedback with React Hot Toast
- **Pagination**: Load more functionality for blogs and comments

### 🔍 Discovery
- **Search**: Search blogs by title, tags, or author
- **Trending Blogs**: Discover popular content
- **Latest Blogs**: Browse recent publications
- **User Search**: Find other writers

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Routing**: React Router DOM 6.14.2
- **Styling**: Tailwind CSS 3.3.3
- **Rich Text Editor**: EditorJS 2.27.2 with plugins
  - Code, Embed, Header, Image, Inline Code, Link, List, Marker, Quote
- **HTTP Client**: Axios 1.4.0
- **Authentication**: Firebase 10.1.0 (Google OAuth)
- **Animations**: Framer Motion 10.13.0
- **Notifications**: React Hot Toast 2.4.1
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js with Express 4.18.2
- **Database**: MongoDB with Mongoose 7.3.2
- **Authentication**: 
  - Firebase Admin 11.10.1 (Google OAuth)
  - JWT (jsonwebtoken 9.0.1)
  - bcrypt 5.1.0 (Password hashing)
- **File Storage**: AWS SDK 2.1432.0 (Cloudinary integration)
- **Utilities**: 
  - nanoid 4.0.2 (Unique ID generation)
  - dotenv 16.3.1 (Environment variables)
  - cors 2.8.5 (Cross-origin requests)

### Development Tools
- **Server**: Nodemon 3.0.1
- **Linting**: ESLint
- **Bundling**: PostCSS, Autoprefixer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Firebase Project** (for Google OAuth)
- **Cloudinary Account** (for image uploads)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Content_Management_System
```

### 2. Backend Setup

#### Navigate to Server Directory
```bash
cd server
```

#### Install Dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=4000
DB_LOCATION=your_mongodb_connection_string
SECRET_ACCESS_KEY=your_jwt_secret_key
```

#### Firebase Admin Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Navigate to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file as `cms-website-a771e-firebase-adminsdk-fbsvc-d254091fb9.json` in the `server` directory
   - **Note**: Update the filename in `server.js` (line 21) if you use a different name

#### Start the Server
```bash
npm start
```
The server will run on `http://localhost:4000`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../website - frontend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Variables
Create a `.env` file in the `website - frontend` directory:
```env
VITE_SERVER_DOMAIN=http://localhost:4000
```

#### Firebase Configuration
Update `src/common/firebase.jsx` with your Firebase project credentials:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

#### Cloudinary Configuration
Update `src/common/aws.jsx` with your Cloudinary credentials:
```javascript
// Add your Cloudinary upload preset and cloud name
```

#### Start the Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` (default Vite port)

## 📁 Project Structure

### Backend (`server/`)
```
server/
├── Schema/
│   ├── User.js           # User model
│   ├── Blog.js           # Blog model
│   ├── Comment.js        # Comment model
│   └── Notification.js   # Notification model
├── server.js             # Express server & API routes
├── package.json          # Backend dependencies
└── .env                  # Environment variables
```

### Frontend (`website - frontend/`)
```
website - frontend/
├── src/
│   ├── pages/            # Page components
│   │   ├── home.page.jsx
│   │   ├── blog.page.jsx
│   │   ├── editor.pages.jsx
│   │   ├── profile.page.jsx
│   │   ├── dashboard.page.jsx
│   │   └── ...
│   ├── components/       # Reusable components
│   │   ├── navbar.component.jsx
│   │   ├── blog-post.component.jsx
│   │   ├── comment-card.component.jsx
│   │   └── ...
│   ├── common/           # Utility functions
│   │   ├── session.jsx   # Auth context
│   │   ├── theme.jsx     # Theme context
│   │   ├── firebase.jsx  # Firebase config
│   │   └── aws.jsx       # Cloudinary config
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /signin` - User login
- `POST /google-auth` - Google OAuth authentication
- `POST /change-password` - Change user password (Protected)

### User
- `POST /get-profile` - Get user profile
- `POST /update-profile` - Update user profile (Protected)
- `POST /update-profile-img` - Update profile image (Protected)
- `POST /search-users` - Search users

### Blogs
- `POST /create-blog` - Create/update blog (Protected)
- `POST /get-blog` - Get single blog
- `POST /latest-blogs` - Get latest blogs with pagination
- `POST /all-latest-blogs-count` - Get total blog count
- `GET /trending-blogs` - Get trending blogs
- `POST /search-blogs` - Search blogs
- `POST /search-blogs-count` - Get search results count
- `POST /user-written-blogs` - Get user's blogs (Protected)
- `POST /user-written-blogs-count` - Get user's blog count (Protected)
- `POST /delete-blog` - Delete blog (Protected)

### Interactions
- `POST /like-blog` - Like/unlike blog (Protected)
- `POST /isliked-by-user` - Check if user liked blog (Protected)
- `POST /add-comment` - Add comment (Protected)
- `POST /get-blog-comments` - Get blog comments
- `POST /get-replies` - Get comment replies
- `POST /delete-comment` - Delete comment (Protected)

## 🎯 Usage

### Creating a Blog
1. Sign in or create an account
2. Click on "Write" in the navigation bar
3. Use the rich text editor to create your content
4. Add a banner image, title, description, and tags
5. Save as draft or publish immediately

### Managing Blogs
1. Navigate to Dashboard > Blogs
2. View your published blogs and drafts
3. Edit or delete blogs as needed
4. Load more blogs with pagination

### Interacting with Content
1. Like blogs by clicking the heart icon
2. Add comments and replies

### Customizing Profile
1. Go to Dashboard > Edit Profile
2. Update your bio, username, and social links
3. Upload a profile picture
4. Change your password in Dashboard > Change Password

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Middleware for authenticated endpoints
- **Input Validation**: Server-side validation for all inputs
- **URL Validation**: Social links validation

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (below 768px)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Inspired by Modern Web
- EditorJS for the rich text editor
- Firebase for authentication
- Cloudinary for image hosting
- The React and Node.js communities

## 📧 Contact

For any queries or support, please open an issue in the repository.

---

**Note**: Remember to add your `.env` files to `.gitignore` and never commit sensitive credentials to version control.
