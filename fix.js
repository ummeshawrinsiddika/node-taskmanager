const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.DB_URL).then(async () => {
  await mongoose.connection.collection("users").deleteMany({});
  console.log("deleted");
  process.exit();
});