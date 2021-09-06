const mongoose = require("mongoose");
require("dotenv").config();
const uriDb = process.env.DB_HOST;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log("Database connection successful");
});

mongoose.connection.on("error", (e) => {
  console.log(`error connection ${e.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Connection to DB terminated");
    process.exit(1);
  });
});

module.exports = db;
