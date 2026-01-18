"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransporter = createTransporter;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function createTransporter() {
    const testAccount = await nodemailer_1.default.createTestAccount();
    const transporter = nodemailer_1.default.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
    return transporter;
}
