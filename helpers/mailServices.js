 const nodemailer = require("nodemailer");
const { otpTemplate } = require("./emailTemplates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "nilporidreamgirl123@gmail.com",
    pass: "hzyc pfmv kqlv wnmc"
  },
});

const mailsending = async({ email, subject, otp }) => {
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
}

module.exports = { mailsending }