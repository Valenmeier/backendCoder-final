import express from "express";
import mongoose from "mongoose";
import { passportCall } from "../../middlewares/authMiddlewares.js";
import { verificarAdmin } from "../../scripts/verificarAdmin.js";
const router = express.Router();

router.get(`/`, passportCall("jwt"), async (req, res) => {
    let adminSession = verificarAdmin(req);
    let { activateSession, admin } = adminSession;
    res.render(`chat`, {
      admin,
      activateSession,
      style: "chat.css",
    });
  });

export default router