"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailQueue_1 = require("../queues/emailQueue");
const client_1 = require("../db/client");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    const emails = await client_1.prisma.email.findMany({
        orderBy: { createdAt: "desc" },
    });
    res.json(emails);
});
router.post("/schedule", async (req, res) => {
    try {
        const { to, subject, body, sendAt } = req.body;
        if (!to || !subject || !body || !sendAt) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const email = await client_1.prisma.email.create({
            data: {
                to,
                subject,
                body,
                sendAt: new Date(sendAt),
                status: "scheduled",
            },
        });
        const delay = new Date(sendAt).getTime() - Date.now();
        await emailQueue_1.emailQueue.add("send-email", {
            emailId: email.id,
        }, {
            delay: Math.max(delay, 0),
        });
        return res.json({ status: "ok", emails: 1 });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
