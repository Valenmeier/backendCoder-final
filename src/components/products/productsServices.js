import { ProductsModel } from "./individualFactory.js";

//* Listar todos los carritos

export class ProductsServices {
  constructor() {
    this.productsModel = new ProductsModel();
  }
  isValidProduct = (id) => {
    return this.productsModel.isValidProduct(id);
  };
  getAllProducts = (req) => {
    return this.productsModel.getAllProducts(req);
  };
  addProduct = (req) => {
    return this.productsModel.addProduct(req);
  };
  getProductsWithId = (id) => {
    return this.productsModel.getProductsWithId(id);
  };
  updateProducts = (id, nuevoProducto) => {
    return this.productsModel.updateProducts(id, nuevoProducto);
  };
  deleteProducts = (id) => {
    return this.productsModel.deleteProducts(id);
  };
  getProductWithOwner = (owner) => {
    return this.productsModel.getProductWithOwner(owner);
  };
  deleteProductWithOwner=(owner)=>{
    return this.productsModel.deleteProductWithOwner(owner);
  }
}
