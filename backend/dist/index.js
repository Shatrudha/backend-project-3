"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const emailQueue_1 = require("./queues/emailQueue");
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const express_2 = require("@bull-board/express");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/emails", emailRoutes_1.default);
/* ------------------ Bull Board Setup ------------------ */
const serverAdapter = new express_2.ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
(0, api_1.createBullBoard)({
    queues: [new bullMQAdapter_1.BullMQAdapter(emailQueue_1.emailQueue)],
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
