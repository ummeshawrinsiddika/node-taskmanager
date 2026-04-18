 const { mailsender } = require("../helpers/mailService");
const { isvalidEmail, isValidPassword, generateOTP, generateAccessToken } = require("../helpers/utils");
const authSchema = require("../models/authSchema");
const { uploadToCloudinary } = require("../helpers/CloudinaryService");

const registration = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName?.trim()) return res.status(400).send({ message: "FullName is required." });
    if (!email) return res.status(400).send({ message: "email is required." });
    if (!isvalidEmail(email)) return res.status(400).send({ message: "email is invalid." });
    if (!password) return res.status(400).send({ message: "password is required." });
    if (!isValidPassword(password)) return res.status(400).send({ message: "password is invalid." });

    const existingEmail = await authSchema.findOne({ email });
    if (existingEmail) return res.status(400).send({ message: "This email already registered." });

    const OTP_Num = generateOTP();
    const user = new authSchema({
      fullName, email, password,
      otp: OTP_Num,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });
    await user.save();

    await mailsender({ email, subject: "OTP verification mail", otp: OTP_Num, fullName });
    res.status(200).send({ message: "Registration Successful. Please verify your email." });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await authSchema.findOneAndUpdate(
      { email, otp, otpExpiry: { $gt: Date.now() } },
      { isVerified: true, otp: null },
      { returnDocument: "after" }
    );
    if (!user) return res.status(400).send({ message: "Invalid or expired OTP" });
    res.status(200).send({ message: "Email verified Successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authSchema.findOne({ email });
    if (!user) return res.status(400).send({ message: "Invalid credentials." });
    if (!user.isVerified) return res.status(400).send({ message: "Email is not verified" });

    const matchpass = await user.comparePassword(password);
    if (!matchpass) return res.status(400).send({ message: "Invalid credentials." });

    const accessToken = generateAccessToken({ _id: user._id, email: user.email });
    res.cookie("accessToken", accessToken, { httpOnly: true });
    return res.status(200).send({ message: "Login Successful." });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error." });
  }
};

const userProfile = async (req, res) => {
  try {
    const userData = await authSchema.findOne({ _id: req.user._id }).select("avatar email fullName");
    if (!userData) return res.status(404).send({ message: "User not found" });
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send({ message: "Internal server Error!" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const avatarUrl = await uploadToCloudinary({
      mimetype: req.file.mimetype,
      imgBuffer: req.file.buffer,
    });
    const updated = await authSchema.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl.secure_url },
      { new: true }
    ).select("avatar email fullName");
    res.status(200).send(updated);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server Error!" });
  }
};

module.exports = { registration, verifyOTP, login, userProfile, updateProfile };