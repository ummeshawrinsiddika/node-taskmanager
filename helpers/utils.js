 const jwt = require("jsonwebtoken");

function isvalidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex = /^.{6,}$/;
  return passwordRegex.test(password);
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = { isvalidEmail, isValidPassword, generateOTP, generateAccessToken };