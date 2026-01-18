import { emailQueue } from "./queues/emailQueue";

async function test() {
  await emailQueue.add(
    "send-email",
    {
      to: "hello@example.com",
      subject: "ReachInbox Test",
      body: "This email is sent via BullMQ + Ethereal",
    },
    { delay: 3000 }
  );

  console.log("📌 Email scheduled");
}

test();
