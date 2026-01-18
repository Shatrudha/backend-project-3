import express from "express";
import cors from "cors";
import { prisma } from "./db/client";
import emailRoutes from "./routes/emailRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/emails", emailRoutes);


app.get("/health", async (_req, res) => {
  const count = await prisma.email.count();
  res.json({ status: "ok", emails: count });
});

export default app;
