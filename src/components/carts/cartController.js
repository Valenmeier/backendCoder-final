import { CartService } from "./cartServices.js";
import {
  confirmarCarrito,
  confirmarProducto,
  getOwnerCart,
  getOwnerProduct,
} from "../../scripts/confirmacionExistencia.js";

import mongoose from "mongoose";

export class CartController {
  constructor() {
    this.cartService = new CartService();
  }
  getAll = () => {
    return this.cartService.getAllCarts();
  };
  createCart = () => {
    return this.cartService.createCart();
  };
  seeOneCart = async (req) => {
    let id = req.params.cid || req;
    let verificacion = await confirmarCarrito(id);
    if (verificacion) {
      return this.cartService.getOneCart(id);
    } else {
      return {
        status: 400,
        payload: {
          result: `Coloca un id valido`,
        },
      };
    }
  };
  isValidCart = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return this.cartService.isValidCart(id);
    } else {
      return false;
    }
  };
  addProductToCart = async (req) => {
    let carritoId = await req.params.cid;
    let productoId = await req.params.pid;

    let verificarProducto = await confirmarProducto(productoId);
    let verificarCarrito = await confirmarCarrito(carritoId);

    if (verificarCarrito && verificarProducto) {
      let cartOwner = await getOwnerCart(carritoId);
      let productOwner = await getOwnerProduct(productoId);

      if (cartOwner != productOwner) {
        return this.cartService.addProduct(productoId, carritoId);
      } else {
        return {
          status: 400,
          response: "Solo puedes agregar productos que no son tuyos",
        };
      }
    } else {
      return {
        status: 400,
        payload: {
          result: `Coloca identificaciones validas`,
        },
      };
    }
  };
  deleteProduct = async (req) => {
    let carritoId = req.params.cid;
    let productoId = req.params.pid;
    let verificarProducto = await confirmarProducto(productoId);
    let verificarCarrito = await confirmarCarrito(carritoId);
    if (verificarCarrito && verificarProducto) {
      return this.cartService.deleteProduct(productoId, carritoId);
    } else {
      return {
        status: 400,
        payload: {
          result: `Coloca identificaciones validas`,
        },
      };
    }
  };
  updateWithArray = async (req) => {
    //*Recogemos los query
    let carritoId = req.params.cid;
    let productos = req.body.products;

    let validacionCarrito = confirmarCarrito(carritoId);

    if (!(await validacionCarrito)) {
      return {
        status: 400,
        payload: {
          result: `carritoId: ${carritoId} No es valido, porfavor coloca ids validos`,
        },
      };
    }
    for (let producto of productos) {
      let id = producto._id;
      let validacion = confirmarProducto(id);
      if (!(await validacion)) {
        return {
          status: 400,
          payload: {
            result: `productId: ${producto._id} No es valido, porfavor coloca ids validos`,
          },
        };
      }
    }
    return this.cartService.updateWithArray(carritoId, productos);
  };
  updateQuantity = async (req) => {
    //*Recogemos los query
    let carritoId = req.params.cid;
    let productoId = req.params.pid;
    let cantidadNueva = req.body.quantity;

    let verificarProducto = await confirmarProducto(productoId);
    let verificarCarrito = await confirmarCarrito(carritoId);
    if (verificarCarrito && verificarProducto) {
      return this.cartService.updateQuantity(
        carritoId,
        productoId,
        cantidadNueva
      );
    } else {
      return {
        status: 400,
        payload: {
          result: `Carrito no encontrado`,
        },
      };
    }
  };
  deleteAllProducts = async (req) => {
    let carritoId = req.params.cid;

    let verificarCarrito = await confirmarCarrito(carritoId);
    if (verificarCarrito) {
      return this.cartService.deleteAllProducts(carritoId);
    } else {
      return {
        status: 400,
        payload: {
          result: `Carrito no encontrado`,
        },
      };
    }
  };

  buyProducts = async (user) => {
    return this.cartService.buyProducts(user);
  };
}
