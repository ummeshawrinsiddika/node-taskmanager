const express = require("express");
const router = require("./route");
const dbConfig = require("./configs/dbConfig");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(router);

dbConfig();

app.listen(8000, () => console.log("server is running"));