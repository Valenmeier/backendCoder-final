import express from "express";
import mongoose from "mongoose";
const router = express.Router();
import { passportCall } from "../../middlewares/authMiddlewares.js";
import { verificarAdmin } from "../../scripts/verificarAdmin.js";

router.get(`/`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  res.render(`products/realtimeProducts`, {
    admin,
    activateSession,
    style: "listasDeProductos.css",
  });
});

export default router;
