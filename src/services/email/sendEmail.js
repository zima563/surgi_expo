const nodemailer = require("nodemailer");
const Jwt = require("jsonwebtoken");
const { emailTemplate } = require("./emailTemplate.js");

const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASS,
    },
  });

  let token = Jwt.sign({ email }, "myProjectAddress");
  const info = await transporter.sendMail({
    from: `"mohamedabdelazim" <${process.env.EMAIL_NAME}>`, // sender address
    to: email, // list of receivers// Subject line
    html: emailTemplate(token), // html body
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
