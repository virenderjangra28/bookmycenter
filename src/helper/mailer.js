import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import { User } from "@/lib/model/user";

async function createMailTransport() {
  const user = process.env.MAILTRAP_USER?.trim();
  const pass = process.env.MAILTRAP_PASS?.trim();

  if (user && pass) {
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: { user, pass },
    });
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "MAILTRAP_USER and MAILTRAP_PASS must be set in .env"
    );
  }

  const testAccount = await nodemailer.createTestAccount();
  console.warn(
    "[sendEmail] MAILTRAP credentials missing — using Ethereal test inbox for development"
  );

  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export const sendEmail = async ({ email, emailType, userId }) => {
  try {
    console.log("[sendEmail] called", { email, emailType, userId });

    const token = await bcryptjs.hash(userId.toString(), 10);
    const expiry = new Date(Date.now() + 3600000);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verificationToken: token,
        verificationTokenExpiry: expiry,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: expiry,
      });
    }

    const transport = await createMailTransport();

    const domain = process.env.DOMAIN || "http://localhost:3000";
    const verifyPath =
      emailType === "VERIFY" ? "verify/verify-email" : "verify/reset-password";

    const mailOption = {
      from: process.env.MAIL_FROM || "noreply@bookmycenter.com",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : "Reset your password",
      html: `Click <a href="${domain}/${verifyPath}?token=${encodeURIComponent(token)}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }.`,
    };

    const mailResponse = await transport.sendMail(mailOption);
    const previewUrl = nodemailer.getTestMessageUrl(mailResponse);

    console.log("[sendEmail] sent", mailResponse.messageId);
    if (previewUrl) {
      console.log("[sendEmail] preview URL", previewUrl);
    }

    return mailResponse;
  } catch (error) {
    console.error("[sendEmail] failed22", error.message);
    throw new Error(error.message);
  }
};
