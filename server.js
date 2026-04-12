const express = require("express");
const app = express();
const router = require("./route");
const dbConfig = require("./configs/dbConfig");
const cookieParser = require("cookie-parser");
const dns = require("dns");
require("dotenv").config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(cookieParser());
app.use(express.json());

dbConfig().then(() => {
  app.use(router);
  app.listen(8000, () => console.log("server is running"));
});