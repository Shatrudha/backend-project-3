import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import { redisConnection } from "../config/redis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const delayMs = Number(process.env.EMAIL_DELAY_MS || 2000);

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

new Worker(
  "email-queue",
  async (job) => {
    const { emailId, to, subject, body } = job.data;

    console.log(`📨 Sending email to ${to}`);

    // throttle delay
    await new Promise((res) => setTimeout(res, delayMs));

    try {
      await transporter.sendMail({
        from: '"ReachInbox" <no-reply@reachinbox.com>',
        to,
        subject,
        text: body,
      });

      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "sent",
        },
      });

      console.log(`✅ Email sent to ${to}`);
    } catch (err) {
      console.error("❌ Email failed", err);

      await prisma.email.update({
        where: { id: emailId },
        data: {
          status: "failed",
        },
      });

      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

console.log("📬 Email worker started");
