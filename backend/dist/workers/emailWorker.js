"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const nodemailer_1 = __importDefault(require("nodemailer"));
const redis_1 = require("../config/redis");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const delayMs = Number(process.env.EMAIL_DELAY_MS || 2000);
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
    },
});
new bullmq_1.Worker("email-queue", async (job) => {
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
    }
    catch (err) {
        console.error("❌ Email failed", err);
        await prisma.email.update({
            where: { id: emailId },
            data: {
                status: "failed",
            },
        });
        throw err;
    }
}, {
    connection: redis_1.redisConnection,
    concurrency: 5,
});
console.log("📬 Email worker started");
