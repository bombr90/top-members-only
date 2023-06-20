# top-members-only
The Odin Project: Members Only Project

A Express/Node.js app for demonstrating use of backend technologies to creates a simple member's only message board that manages authentication of members and sets view/post/delete privileges based authentication status and member role. 

## [Live Demo]()

## Getting Started*
```
git clone https://github.com/bombr90/top-members-only.git
cd top-members-only
npm install
npm start
```

>**Note: You'll need to self-host a mongoDB database or have mongoDB atlas account with a valid DB connection string saved as an environmental variable. Create a '.env' file in the root directory in the following format:* 
>- DB_URI = "mongodb+srv://[yourUsername]:[myRealPassword]@cluster0.mongodb.net/inventory_app?w=majority"
>- SECRET = [your session secret]
>- ADMINCODE = [your admin code]
>- MEMBERCODE = [your member code]

## Built with 
- [Node](https://nodejs.dev/en/)
- [Express](https://expressjs.com/)
- [ejs](https://ejs.co/)
- [MongoDB](https://cloud.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport](https://www.passportjs.org/)
