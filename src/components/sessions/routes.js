import express from "express";
import passport from "passport";

import dotenv from "dotenv";
import {
  authorization,
  authToken,
  generatePasswordToken,
  authPasswordToken,
} from "../../middlewares/authMiddlewares.js";
import { UserController } from "./userController.js";
import { transport } from "../../services/email/nodemailer.js";
import { DataUserDTO } from "./dto/userDataDto.js";
import {
  createHash,
  isValidPassword,
} from "../../middlewares/passwordMiddlewares.js";

dotenv.config();
const router = express.Router();
let userController = new UserController();

//Todo --> LOGIN
router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: 400, response: "Usuario no identificado" });
    }
    await userController.updateUser(req.user.email, {
      last_connection: new Date(),
      online: true,
    });

    return res.status(200).send({
      status: 200,
      message:
        "Inicio de sesion exitoso, recuerde no compartir el token con nadie y utilizarlo en el header con la key auth",
      response: req.user,
    });
  }
);

router.get("/faillogin", (req, res) => {
  return res.status(401).send({
    status: 401,
    response: "Usuario y/o contraseña incorrectos",
  });
});

router.post("/logout", authToken, async (req, res) => {
  await userController.updateUserWithId(req.user._id, {
    last_connection: new Date(),
    online: false,
  });
  return res.status(200).send({
    status: 200,
    response: "Cierre de sesión exitoso",
  });
});

//Todo --> REGISTER
router.post(
  "/createUser",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    return res.status(200).send({
      status: 200,
      response: "Usuario creado exitosamente",
    });
  }
);

router.get("/failregister", (req, res) => {
  return res.status(401).send({
    status: 401,
    response: "Email ya registrado, coloca otro email",
  });
});

router.get("/current", authToken, async (req, res) => {
  let updateUser = await userController.searchUserById(req.user);

  let returnUser = new DataUserDTO(updateUser);
  let user = await userController.searchUserById(returnUser.userId);
  let actualDocuments = user.documents;
  let docStatus = {
    identificacion: false,
    comprobanteDomicilio: false,
    estadoCuenta: false,
  };
  for (let doc of actualDocuments) {
    if (doc.name == "Identificación") docStatus.identificacion = true;
    if (doc.name == "Comprobante de domicilio")
      docStatus.comprobanteDomicilio = true;
    if (doc.name == "Comprobante de estado de cuenta")
      docStatus.estadoCuenta = true;
    if (doc.name == "Profile image") {
      returnUser.profileImage = doc.reference;
    } else {
      returnUser.profileImage = null;
    }
  }
  returnUser.documentsStatus = docStatus;
  res.status(200).send({
    status: 200,
    response: returnUser,
  });
});

//Todo --> Actualizar usuarios

router.post("/updatePassword", async (req, res) => {
  let { email } = req.body;
  if (email) {
    const token = generatePasswordToken(email);
    transport.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Restablecimiento de contraseña",
      html: `
              <div>
                  <h2>Para restablecer su contraseña <a href="${process.env.FRONT_DOMAIN}/changePassword/${token}" target="_blank">Clik aqui</a></h2>
              </div>
          `,
      attachments: [],
    });
    return res.status(200).send({
      message: `Se ha enviado un correo a ${email} para restablecer la contraseña`,
      status: 200,
    });
  } else {
    return res.status(400).send({
      message: "Porfavor envia el correo electronico",
      status: 400,
    });
  }
});

router.post("/changePassword/:token", authPasswordToken, async (req, res) => {
  let { contraseña } = req.body;
  if (contraseña) {
    let user = await userController.searchUser(req.user.response);
    if (!user) {
      return res
        .status(400)
        .send({ status: 400, response: `Usuario no encontrado` });
    }
    if (isValidPassword(user, contraseña)) {
      return res.status(422).send({
        status: 422,
        response: `Coloca una contraseña diferente a la actual`,
      });
    } else {
      let hashPassword = createHash(contraseña);
      let result = await userController.updateUser(user.email, {
        password: hashPassword,
      });
      return res.status(result.status).send(result);
    }
  }
  return res.status(422).send({
    response: `Coloca la nueva contraseña en el body como {"contraseña":"nueva contraseña"} y reenvia la petición`,
  });
});

router.put("/premium", authorization("admin"), async (req, res) => {
  let user = await userController.searchUserById(req.headers.updateuser);

  if (!user) {
    return res.status(400).send({
      status: 400,
      response: "Los administradores no pueden cambiar su rol",
    });
  }
  if (user.rol == "user") {
    let result = await userController.updateUser(user.email, {
      rol: "premium",
    });
    return res.status(result.status).send(result);
  } else if (user.rol == "premium") {
    let result = await userController.updateUser(user.email, { rol: "user" });
    return res.status(result.status).send(result);
  }
  return res.status(400).send({
    status: 400,
    response: "Los administradores no pueden cambiar su rol",
  });
});

export default router;
