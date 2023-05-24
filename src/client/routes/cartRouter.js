import express from "express";
import mongoose from "mongoose";
import { passportCall } from "../../middlewares/authMiddlewares.js";
import { verificarAdmin } from "../../scripts/verificarAdmin.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

router.get(`/:cid`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  let id = req.params.cid;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = "Id del carrito no válido";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }

  let carrito = await fetch(`${process.env.DOMAIN_NAME}/api/carts/${id}`)
    .then((res) => res.json())
    .then((res) => res);

  if (!carrito) {
    let error = "Carrito no encontrado";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }
  let traerProductos = [];
  let error;

  if (!carrito[0].products) {
    for (let producto of carrito.products) {
      let buscarProducto = await fetch(
        `${process.env.DOMAIN_NAME}/api/products/${id}`
      )
        .then((res) => res.json())
        .then((res) => res);

      let nuevoObjeto = {
        ...buscarProducto,
        quantity: producto.quantity,
        totalPrice: buscarProducto.price * producto.quantity,
      };
      traerProductos.push(nuevoObjeto);
    }
  } else {
    error = "El carrito se encuentra vacio";
  }

  res.render(`products/carrito`, {
    admin,
    activateSession,
    traerProductos,
    error,
    style: "carrito.css",
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
