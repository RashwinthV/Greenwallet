const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../../Models/userModel");

// Random password generator with validation (min 6 chars, letter, number, special char)
const generateRandomPassword = (length = 10) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "@$&";

  const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

  let password = [
    getRandom(letters),
    getRandom(numbers),
    getRandom(specialChars),
  ];

  const allChars = letters + numbers + specialChars;
  for (let i = password.length; i < Math.max(length, 6); i++) {
    password.push(getRandom(allChars));
  }

  return password.sort(() => Math.random() - 0.5).join("");
};

exports.sendPasswordEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email: email });
  if (!user)
    return res
      .status(404)
      .json({ message: "Please enter your registered email ID" });

  try {
    // Generate password
    const plainPassword = generateRandomPassword(10);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.updateOne({ email }, { password: hashedPassword });

    // Mail configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_APP_MAILID,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Styled HTML email
    const mailOptions = {
      from: process.env.EMAIL_APP_MAILID,
      to: email,
      subject: "🔐 Your New Password - Secure Access",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #4A90E2;">🔐 Password Reset</h2>
          <p>Hello <strong>${user.name || "User"}</strong>,</p>
          <p>We received a request to reset your account password. Your new temporary password is:</p>
          <p style="font-size: 18px; font-weight: bold; background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block; color: #333;">
            ${plainPassword}
          </p>
          <p style="margin-top: 20px;">For your security, please log in and change this password immediately.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">If you did not request this change, please contact our support team.</p>
          <p style="font-size: 12px; color: #999;">— E Store Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Password sent to email successfully",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ message: "Error sending email", error });
  }
};

exports.PasswordUpdateInfo = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email: email });
  if (!user)
    return res
      .status(404)
      .json({ message: "Please enter your registered email ID" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_APP_MAILID,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Green Wallet" <${process.env.EMAIL_APP_MAILID}>`,
      to: user.email,
      subject: "Your Password Was Recently Updated",
      text: `Hi ${user.name},

This is a confirmation that your password was successfully updated.

If you did not initiate this change, please contact our support team immediately.

Regards,
Green Wallet Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Password Updated Successfully</h2>
          <p>Hi ${user.name},</p>
          <p>This is a confirmation that your password was <strong>successfully updated</strong>.</p>
          <p>If you did not make this change, please contact our support team immediately using the Email ${process.env.EMAIL_APP_MAILID} .</p>
          <p>Regards,<br/>Green Wallet Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "Password update email sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error sending email", error });
  }
};

