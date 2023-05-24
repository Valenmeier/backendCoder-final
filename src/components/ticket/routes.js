import express from "express";
import { authToken } from "../../middlewares/authMiddlewares.js";
import { TicketController } from "./ticketController.js";
const router = express.Router();

let ticketController = new TicketController();

router.post("/", authToken, async (req, res, next) => {
  try {
    let data = req.body;
    let result = await ticketController.createTicket(data);

    if (result.status == 200) {
      return res.status(200).send({
        status: 200,
        response: result.response,
      });
    } else {
      return res.status(result.status).send({
        status: result.status,
        response: result.response,
      });
    }
  } catch (error) {
    next(error);
  }
});
export default router;
