import express from "express";
const router = express.Router();
import { passportCall } from "../../middlewares/authMiddlewares.js";
import { verificarAdmin } from "../../scripts/verificarAdmin.js";
router.get(`/`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  res.render(`home`, {
    admin,
    activateSession,
    style: "inicio.css",
  });
});
router.get("/admin", passportCall("jwt"), (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;

  if ((activateSession, admin)) {
    return res.render(`admin/admin`, {
      admin,
      activateSession,
      mensaje: `Felicidades eres admin`,
      style: "admin.css",
    });
  }
  return res.render(`admin/admin`, {
    admin,
    activateSession,
    style: "admin.css",
  });
});
export default router;
