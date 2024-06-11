import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { to, subject, text } = await req.json();

  console.log("running email API...");

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "davon92@ethereal.email",
      pass: "G2wS3tbhc85dJAYtfQ",
    },
  });

  // Define the email options
  const mailOptions = {
    from: '"Davon 👻" <davon92@ethereal.email>',
    to: to,
    subject: subject,
    text: text,
    html: "<b>Hello world</b>",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "email sent" });
  } catch (error) {
    return NextResponse.json({ message: "email error" }, { status: 500 });
  }
}
