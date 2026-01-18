"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailQueue_1 = require("./queues/emailQueue");
async function test() {
    await emailQueue_1.emailQueue.add("send-email", {
        to: "hello@example.com",
        subject: "ReachInbox Test",
        body: "This email is sent via BullMQ + Ethereal",
    }, { delay: 3000 });
    console.log("📌 Email scheduled");
}
test();
