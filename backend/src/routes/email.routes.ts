import { Router } from "express";
import { emailQueue } from "../queues/emailQueue";
import { prisma } from "../db/client";

const router = Router();

router.post("/schedule", async (req, res) => {
  try {
    const { to, subject, body, sendAt } = req.body;

    if (!to || !subject || !body || !sendAt) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const email = await prisma.email.create({
      data: {
        to,
        subject,
        body,
        sendAt: new Date(sendAt),
        status: "scheduled",
      },
    });

    const delay = new Date(sendAt).getTime() - Date.now();

    await emailQueue.add(
      "send-email",
      {
        emailId: email.id,
      },
      {
        delay: Math.max(delay, 0),
      }
    );

    return res.json({ status: "ok", emails: 1 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
