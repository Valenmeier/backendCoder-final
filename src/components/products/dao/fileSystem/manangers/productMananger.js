import fs from "fs";
import mongoose from "mongoose";

export default class ProductMananger {
  constructor() {
    this.path =
      "./src/components/products/dao/fileSystem/data/listaDeProductos.json";
  }
  addProduct = async (req) => {
    let { title, description, code, price, stock, thumbnail, status } =
      req.body;
    if (!title || !description || !code || !price || !stock || !status) {
      return {
        success: false,
        message: `Compruebe que tenga todos los datos solicitados(title, description, code, price, stock, thumbnail(opcional)) para subir correctamente su producto `,
      };
    }
    if (fs.existsSync(this.path)) {
      let info = await fs.promises.readFile(this.path, "utf-8");
      let result = JSON.parse(info);
      const codeCheck = result.find((el) => el.code == code);
      if (codeCheck)
        return {
          status: 400,
          response: `El código del producto agregado ya existe, porfavor agrega un producto valido o un nuevo producto`,
        };
      let idParaProducto = await mongoose.Types.ObjectId();
      let nuevoProducto = {
        id: idParaProducto,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        thumbnail,
      };
      result.push(nuevoProducto);
      await fs.promises.writeFile(this.path, JSON.stringify(result, null, 2));
      return { status: 200, response: "Producto agregado exitosamente:" };
    } else {
      let nuevoProducto = {
        id: await mongoose.Types.ObjectId(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        thumbnail,
      };
      await fs.promises.writeFile(
        this.path,
        JSON.stringify([nuevoProducto], null, 2)
      );
      return {
        success: true,
        status: 200,
        response: "Producto agregado exitosamente:",
      };
    }
  };
  getAllProducts = async (req) => {
    if (fs.existsSync(this.path)) {
      let info = await fs.promises.readFile(this.path, "utf-8");
      let result = await JSON.parse(info);
      return {
        response: result,
        status: 200,
      };
    } else {
      return null;
    }
  };
  getProductsWithId = async (id) => {
    if (fs.existsSync(this.path)) {
      let info = await fs.promises.readFile(this.path, "utf-8");
      let result = JSON.parse(info);
      let mostrarProducto = result.find((product) => product._id == id);
      if (mostrarProducto) {
        return {
          response: mostrarProducto,
        };
      } else {
        return `Not found, producto no encontrado`;
      }
    } else {
    return(`No hay ningún producto en la empresa`);
    }
  };
  updateProducts = async (id, propiedadesActualizadas) => {
    if ((id, propiedadesActualizadas)) {
      if (fs.existsSync(this.path)) {
        let info = await fs.promises.readFile(this.path, "utf-8");
        let result = JSON.parse(info);
        let encontrarProducto = result.find((product) => {
          return product._id == id;
        });

        if (encontrarProducto) {
          const productUpdates = result.map((product) => {
            if (product._id == id) {
              return { ...product, ...propiedadesActualizadas };
            } else {
              return product;
            }
          });
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(productUpdates, null, 2)
          );
          return {
            status: 200,
            response: "Producto actualizado correctamente",
          };
        } else {
          return {
            status: 400,
            response: "El producto a actualizar no se ha encontrado",
          };
        }
      } else {
        return {
          status: 400,
          response: "No hay productos para actualizar",
        };
      }
    } else {
      return {
        status: 400,
        response: `Completa todos los campos para actualizar`,
      };
    }
  };
  deleteProducts = async (id) => {
    if (fs.existsSync(this.path)) {
      let info = await fs.promises.readFile(this.path, "utf-8");
      let result = JSON.parse(info);
      let eliminarProducto = result.filter((prod) => prod._id != id);
      result = eliminarProducto;
      await fs.promises.writeFile(this.path, JSON.stringify(result, null, 2));
      return `Producto eliminado correctamente`;
    } else {
      `No existe ningún producto dentro de la empresa`;
    }
  };
}
