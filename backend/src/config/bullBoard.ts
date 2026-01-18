import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { emailQueue } from "../queues/emailQueue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const queues = [new BullMQAdapter(emailQueue as any)];

createBullBoard({
  queues,
  serverAdapter,
});


export { serverAdapter };
