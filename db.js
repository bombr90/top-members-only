// db.js

const db = require("mongoose");
require("dotenv").config();

// Mongoose Setup
db.set("strictQuery",false);
const mongoDB = process.env.DB_URI;

main().catch((err) => console.log(err));
async function main() {
  console.log('Attempting to connect to MongoDB...')
  await db.connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log(`Connected to MongoDB.`)
}

module.exports = db;