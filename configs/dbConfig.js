 const mongoose = require("mongoose");

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

module.exports = dbConfig;
 