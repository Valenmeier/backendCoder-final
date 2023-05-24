import {CartsModel}  from "./individualFactory.js";


//* Listar todos los carritos

export class CartService {
  constructor() {
    this.cartModel = new CartsModel();
  }
  getAllCarts = () => {
    return this.cartModel.getAll();
  };
  createCart = () => {
    return this.cartModel.createCart();
  };
  getOneCart = (id) => {
    return this.cartModel.getOneCart(id);
  };
  isValidCart = (id) => {
    return this.cartModel.isValidCart(id);
  };
  addProduct = (productId, cartId) => {
    return this.cartModel.addProduct(productId, cartId);
  };
  deleteProduct = (productId, cartId) => {
    return this.cartModel.deleteProduct(productId, cartId);
  };
  updateWithArray = (carritoId, productos) => {
    return this.cartModel.updateWithArray(carritoId, productos);
  };
  updateQuantity = (carritoId, productoId, cantidadNueva) => {
    return this.cartModel.updateQuantity(carritoId, productoId, cantidadNueva);
  };
  deleteAllProducts=(carritoId)=>{
    return this.cartModel.deleteAllProducts(carritoId)
  }
  buyProducts=(user)=>{
    return this.cartModel.buyProducts(user)
  }
}
