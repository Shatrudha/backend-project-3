import express from "express";
import cors from "cors";
import emailRoutes from "./routes/emailRoutes";

import { emailQueue } from "./queues/emailQueue";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/emails", emailRoutes);

/* ------------------ Bull Board Setup ------------------ */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(emailQueue as any)],
  serverAdapter,
});


app.use("/admin/queues", serverAdapter.getRouter());
/* ----------------------------------------------------- */

app.get("/", (_req, res) => {
  res.json({ status: "API running" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Bull Board → http://localhost:${PORT}/admin/queues`);
});
