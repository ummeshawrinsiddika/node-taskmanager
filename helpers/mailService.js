 const nodemailer = require("nodemailer");
const { otpTemplate } = require("./emailTemplates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailsender = async ({ email, subject, otp, fullName }) => {
  try {
    await transporter.sendMail({
      from: '"Task Team" <team@taskmanager.com>',
      to: email,
      subject: subject,
      html: otpTemplate(otp),
    });
  } catch (error) {
    console.log("Error while sending mail", error);
  }
};

module.exports = { mailsender };