 const { isValidateEmail, isValidatePassword, generateOTP, sendEmail } = require("../helpers/utils");
const authSchema = require("../models/authSchema");

const registration = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // duplicate email check
    const existingUser = await authSchema.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .send({ success: false, message: "email already exist" });

    // name check
    if (!fullName?.trim()) return res.status(400).send({ message: "FullName is required." });

    // email check
    if (!email) return res.status(400).send("email is required");
    if (!isValidateEmail(email)) return res.status(400).send({ message: "Email is invalid." });

    // password check
    if (!password) return res.status(400).send("password is required");
    if (!isValidatePassword(password))
      return res.status(400).send("password not valid");

    // OTP generate and send
    const otp = generateOTP();
    await sendEmail(email, otp);

    // save user
    const user = await authSchema({ fullName, email, password, otp });
    user.save();

    res.status(200).send({
      success: true,
      message: "Register successfull Please verify your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server Error" });
  }
};

module.exports = { registration };