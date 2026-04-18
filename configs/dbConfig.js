const mongoose = require("mongoose");

const dbConfig = async () => {
  try {
    const url = process.env.DB_URL;
    console.log("DB_URL:", url);
    await mongoose.connect(url);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

module.exports = dbConfig;