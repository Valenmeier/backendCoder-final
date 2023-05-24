import { ProductsController } from "../components/products/productsController.js";
import { CartController } from "../components/carts/cartController.js";
import { UserController } from "../components/sessions/userController.js";

export let confirmarProducto = async (id) => {
  let productsController = new ProductsController();
  let producto = productsController.isValidProduct(id);
  return producto;
};
export let confirmarCarrito = async (id) => {
  let cartController = new CartController();
  let carrito = await cartController.isValidCart(id);
  return carrito;
};

export let getOwnerCart = async (id) => {
  let userController = new UserController();
  let owner = await userController.searchUserByCartId(id);
  return owner.email;
};
export let getOwnerProduct = async (id) => {
  let productsController = new ProductsController();
  let owner = await productsController.getProductWhitId(id);
  return owner.response[0].owner;
};
