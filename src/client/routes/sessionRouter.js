import express from "express";
const router = express.Router();
import { verificarAdmin } from "../../scripts/verificarAdmin.js";
import passport from "passport";
import { extractCookie } from "../../middlewares/authMiddlewares.js";
import dotenv from "dotenv";
dotenv.config();

//Todo --> Login

router.get(`/login`, (req, res) => {
  res.render(`sessions/login`, {
    style: "sessions.css",
  });
});

router.post("/login", async (req, res) => {
  await fetch(`${process.env.DOMAIN_NAME}/api/sessions/login`, {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status == 200) {
        req.session.user = response.response;
        res
          .cookie(process.env.COOKIE_NAME_JWT, response.response.token)
          .redirect("/products");
      } else {
        res.status(response.status).send({
          error: response.response,
        });
      }
    });
});

//Todo --> Register

router.get(`/register`, (req, res) => {
  res.render(`sessions/register`, {
    style: "register.css",
  });
});

router.post("/createUser", async (req, res) => {
  await fetch(`${process.env.DOMAIN_NAME}/api/sessions/createUser`, {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status == 200) {
        res.redirect("/session/login");
      } else {
        res.status(response.status).render("sessions/register", {
          error: `${response.response}`,
          style: "register.css",
        });
      }
    });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {}
);

router.get(
  "/googlecallback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(req.user.redirectUrl);
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["email"] }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(req.user.redirectUrl);
  }
);

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("error", { mensaje: `${err}` });
    } else {
      res.clearCookie(process.env.COOKIE_NAME_JWT);
      res.redirect("/session/login");
    }
  });
});

router.get("/current", async (req, res) => {
  let token = await extractCookie(req);
  await fetch(`${process.env.DOMAIN_NAME}/api/sessions/current`, {
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status == 200) {
        return res.status(response.status).render("sessions/current", {
          activateSession: true,
          admin: response.response.rol == "admin" ? true : false,
          data: response.response,
        });
      } else {
        return res.status(response.status).render("error", {
          mensaje: `${response.response}`,
          style: "register.css",
        });
      }
    });
});

export default router;
