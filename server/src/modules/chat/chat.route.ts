import express from "express";

import { ChatController } from "./chat.controller.ts";
import { askSchema } from "./chat.validator.ts";
import { validate } from "../../middlewares/validate.middleware.ts";
import { ChatService } from "./chat.service.ts";

const router = express.Router();

const controller = new ChatController(new ChatService());

router.post("/ask/:threadId", validate(askSchema), controller.ask);

export default router;
export { controller as chatController };
