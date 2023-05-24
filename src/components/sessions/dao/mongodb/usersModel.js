import mongoose from "mongoose";
import { userSchema } from "./usersSchema.js";
import { CartController } from "../../../carts/cartController.js";
import { transport } from "../../../../services/email/nodemailer.js";

const userCollection = "users";

const userModel = mongoose.model(userCollection, userSchema);

export class UsersModel {
  constructor() {
    this.db = userModel;
  }
  createUser = async (user) => {
    let cartController = new CartController();
    let cart = await cartController.createCart();
    user.cart = cart._id;
    user.documents = [];
    user.last_connection = new Date();
    return await this.db.create(user);
  };
  searchUser = async (email) => {
    return await this.db.findOne({ email: email });
  };
  searchUserById = async (id) => {
    return await this.db.findById(id);
  };
  searchUserByCartId = async (cartID) => {
    return await this.db.findOne({ cart: cartID });
  };
  updateUser = async (email, nuevaInformacion) => {
    let user = await userModel.find({ email: email });
    if (user.length > 0) {
      if (nuevaInformacion) {
        await this.db.updateOne({ email: email }, nuevaInformacion);
        return {
          status: 200,
          response: "Actualizado correctamente",
        };
      } else {
        return {
          status: 400,
          response: "Coloca la información a cambiar",
        };
      }
    } else {
      return {
        status: 400,
        response: "El id del usuario no existe",
      };
    }
  };
  updateUserWithId = async (id, nuevaInformacion) => {
    let user = await userModel.find({ _id: id });
    if (user.length > 0) {
      if (nuevaInformacion) {
        await this.db.updateOne({ _id: id }, nuevaInformacion);
        return {
          status: 200,
          response: "Actualizado correctamente",
        };
      } else {
        return {
          status: 400,
          response: "Coloca la información a cambiar",
        };
      }
    } else {
      return {
        status: 400,
        response: "El id del usuario no existe",
      };
    }
  };
  addDocument = async (uid, document) => {
    let user = await userModel.findOne({ _id: uid });
    if (user) {
      for (let newDoc of document) {
        const docIndex = user.documents.findIndex(
          (doc) => doc.name === newDoc.name
        );
        if (docIndex !== -1) {
          // Si el documento existe, actualizarlo
          await this.db.updateOne(
            { _id: uid, "documents.name": newDoc.name },
            { $set: { "documents.$.reference": newDoc.reference } }
          );
        } else {
          // Si el documento no existe, añadirlo
          await this.db.updateOne(
            { _id: uid },
            { $push: { documents: newDoc } }
          );
        }
      }
      return {
        status: 200,
        response: "Documento cargado correctamente",
      };
    } else {
      return {
        status: 400,
        response: "El id es incorrecto",
      };
    }
  };
  getAllProfiles = async () => {
    return await this.db.find(
      {},
      "first_name last_name email rol last_connection user"
    );
  };
  deleteInactiveUsers = async () => {
    const inactivityPeriod = 2 * 24 * 60 * 60 * 1000; // 2 días en milisegundos
    const currentDate = new Date();
    const lastActiveDate = new Date(currentDate.getTime() - inactivityPeriod);

    const inactiveUsers = await this.db.find({
      rol: "user",
      last_connection: { $lt: lastActiveDate },
    });

    if (inactiveUsers.length > 0) {
      for (const user of inactiveUsers) {
        await this.db.deleteOne({ _id: user._id });
        if (user.email) {
          await transport.sendMail({
            from: process.env.MAIL_USER,
            to: user.email,
            subject: "Eliminación de cuenta por inactividad",
            html: `
            <div>
              <h1>Tu cuenta ha sido eliminada por inactividad</h1>
              <p>Lamentamos informarte que tu cuenta en nuestro sistema ha sido eliminada debido a inactividad. Si deseas volver a utilizar nuestros servicios, regístrate nuevamente.</p>
            </div>
          `,
          });
        }
      }
      return {
        status: 200,
        response: "Usuarios inactivos eliminados correctamente",
      };
    } else {
      return {
        status: 400,
        response: "No hay usuarios inactivos",
      };
    }
  };

  getRolWithEmail = async (email) => {
    let user = await this.db.findOne({ email: email });
    if (user) {
      return {
        status: 200,
        response: user.rol,
      };
    } else {
      return {
        status: 400,
        response: "User no encontrado",
      };
    }
  };

  deleteUser = async (email) => {
    let user = await this.db.findOne({ email: email });
    if (user) {
      await this.db.deleteOne({ _id: user._id });
      await transport.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Eliminación de cuenta",
        html: `
          <div>
            <h1>Tu cuenta ha sido eliminada</h1>
            <p>Lamentamos informarte que tu cuenta en nuestro sistema ha sido eliminada. Si deseas volver a utilizar nuestros servicios, regístrate nuevamente.</p>
          </div>
        `,
      });
      return {
        status: 200,
        response: "Usuario eliminado correctamente",
      };
    } else {
      return {
        status: 400,
        response: "User no encontrado",
      };
    }
  };
}
