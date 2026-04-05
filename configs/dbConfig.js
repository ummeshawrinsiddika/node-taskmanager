const mongoose = require('mongoose');

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Connected!');
  } catch (err) {
    console.log('DB connection error:', err);
  }
}

module.exports = dbConfig;