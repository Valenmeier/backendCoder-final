import express from "express";
import mongoose from "mongoose";
const router = express.Router();
import { passportCall } from "../../middlewares/authMiddlewares.js";
import { verificarAdmin } from "../../scripts/verificarAdmin.js";
import dotenv from "dotenv";
dotenv.config();

router.get(`/`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  let params = req.query;
  let products;
  if (params.limit || params.page || params.sort || params.query) {
    let url = `${process.env.DOMAIN_NAME}/api/products?`;
    for (let param in params) {
      let completParam = `${param}=${params[param]}&`;
      url += completParam;
    }

    products = await fetch(url.slice(0, -1))
      .then((res) => res.json())
      .then((res) => res);
  } else {
    products = await fetch(`${process.env.DOMAIN_NAME}/api/products`)
      .then((res) => res.json())
      .then((res) => {
        return res;
      });
  }

  if (products.status == 400) {
    return res.render("products/products", {
      admin,
      activateSession,
      mensaje: products.response,
      style: "listasDeProductos.css",
    });
  }
  let prevLink = `${products.prevLink}`,
    nextLink = `${products.nextLink}`,
    firstLink = `${products.firstLink}`,
    ultimateLink = `${products.ultimateLink}`;

  return res.render("products/products", {
    admin,
    activateSession,
    data: products.payload || products,
    prevLink: prevLink.slice(4),
    nextLink: nextLink.slice(4),
    page: products.page,
    firstLink: firstLink.slice(4),
    ultimateLink: ultimateLink.slice(4),
    style: "listasDeProductos.css",
  });
});
router.get(`/:pid`, passportCall("jwt"), async (req, res) => {
  let adminSession = verificarAdmin(req);
  let { activateSession, admin } = adminSession;
  let id = req.params.pid;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    let error = "Id no válido";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }
  let producto = await fetch(`${process.env.DOMAIN_NAME}/api/products/${id}`)
    .then((res) => res.json())
    .then((res) => res);

  if (!producto) {
    let error = "Producto no encontrado";
    return res.render(`products/detalles`, {
      admin,
      activateSession,
      error,
      style: "detalles.css",
    });
  }

  let { _id, title, description, price, thumbnail, stock } =
    (await producto[0]) || producto;

  res.render(`products/detalles`, {
    admin,
    activateSession,
    _id,
    title,
    description,
    price,
    thumbnail,
    stock,
    style: "detalles.css",
  });
});
export default router;
