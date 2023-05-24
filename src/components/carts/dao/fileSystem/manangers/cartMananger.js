import fs from "fs";
import mongoose from "mongoose";

export default class CartMananger {
  constructor() {
    this.path = `./src/components/carts/dao/fileSystem/data/carrito.json`;
  }
  createCart = async () => {
    if (fs.existsSync(this.path)) {
      let info = await fs.promises.readFile(this.path, "utf-8");
      let result = JSON.parse(info);
      let idParaCarrito = await mongoose.Types.ObjectId();
      let nuevoCarrito = {
        id: idParaCarrito,
        products: [],
      };
      result.push(nuevoCarrito);
      await fs.promises.writeFile(this.path, JSON.stringify(result, null, 2));
      return `Se ha creado un nuevo carrito, id del carrito=${idParaCarrito}`;
    } else {
      let nuevoCarrito = {
        id: await mongoose.Types.ObjectId(),
        products: [],
      };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify([nuevoCarrito], null, 2)
      );
      return `Se ha creado un nuevo carrito, id del carrito=${nuevoCarrito.id}`;
    }
  };
  getOneCart = async (id) => {
    if (fs.existsSync(this.path)) {
      let info = await fs.promises.readFile(this.path, "utf-8");
      let result = JSON.parse(info);
      let mostrarProducto = result.find((carrito) => carrito.id == id);
      if (mostrarProducto) {
        return mostrarProducto;
      } else {
        return `Not found, carrito no encontrado, verifique el id ingresado`;
      }
    } else {
      return `No hay ningún carrito con ese id`;
    }
  };
  getAll = async () => {
    if (fs.existsSync(this.path)) {
      let info = await fs.promises.readFile(this.path, "utf-8");
      let result = JSON.parse(info);
      return {
        payload: result,
        status: 200,
      };
    } else {
      return {
        result: `No hay ningún carrito con ese id`,
        status: 400,
      };
    }
  };
  addProduct = async (product, id) => {
    let info = await fs.promises.readFile(this.path, "utf-8");
    let result = JSON.parse(info);
    let agregarProducto = result.map((prod) => {
      if (prod.id == id) {
        if (prod.products.length > 0) {
          let repiteProducto = prod.products.filter(
            (prod) => prod.product == product
          );
          if (repiteProducto.length > 0) {
            let cambiarCantidad = repiteProducto.map((objeto) => {
              return { ...objeto, quantity: objeto.quantity + 1 };
            });
            let nuevoProdProducts = prod.products.map((producto) => {
              if (producto.product == product) {
                producto = cambiarCantidad[0];
                return producto;
              }
              return producto;
            });
            prod.products = nuevoProdProducts;
            return prod;
          } else {
            let nuevoProducto = {
              product: Number(product),
              quantity: 1,
            };
            prod.products.push(nuevoProducto);
          }
        } else {
          let nuevoProducto = {
            product: Number(product),
            quantity: 1,
          };
          prod.products.push(nuevoProducto);
        }
      }
      return prod;
    });
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(agregarProducto, null, 2)
    );
  };
}
