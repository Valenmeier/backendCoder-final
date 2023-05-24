import { Router } from "express";
import {
  passportCall,
  authorization,
} from "../../middlewares/authMiddlewares.js";
import { MessagesController } from "./messageController.js";

const router = Router();

router.get(`/`, passportCall("jwt"), async (req, res, next) => {
  try {
    const loadMessages = MessagesController.getMessages();
    return loadMessages;
  } catch (error) {
    next(error)
  }
});

router.post(
  `/`,
  passportCall("jwt"),
  authorization("user"),
  async (req, res, next) => {
    try {
      let mensaje = MessagesController.createMessages(req.body);
      return mensaje.payload;
    } catch (error) {
      next(error);
    }
  }
);

export default router;
