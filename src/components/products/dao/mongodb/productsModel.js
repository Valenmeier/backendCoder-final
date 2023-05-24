import mongoose from "mongoose";
import { productsSchema } from "./productsSchema.js";
import { actualizarPagina } from "../../../../scripts/funcionActualizaLinks.js";
import dotenv from "dotenv";
dotenv.config();

const productsCollection = "products";
let productsModel = mongoose.model(productsCollection, productsSchema);

export class ProductsModel {
  constructor() {
    this.db = productsModel;
  }
  isValidProduct = async (id) => {
    let producto = await this.db.find({ _id: id });
    if (producto.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  getAllProducts = async (req) => {
    const productos = await this.db.paginate(
      {},
      { limit: 6, page: 1, lean: true }
    ); //* Buscamos los productos
    if (productos && productos.docs.length > 0) {
      if (
        req.query.limit ||
        req.query.page ||
        req.query.sort ||
        req.query.query //* Revisamos si tienen params
      ) {
        let limite = req.query.limit;
        let pagina = req.query.page;
        let orden = req.query.sort;
        let query = req.query.query; //* Guardamos los params

        let filter = {
          //* Creamos una variable para configurar los filtros de la peticion
        };
        let options = {
          //* Creamos una variable para configurar las opciones de la peticion
          limit: limite || 6,
          page: pagina || 1,
          lean: true,
        };

        if (orden == "asc" || orden == "desc" || orden == 1 || orden == -1) {
          //* En caso de que se pida ordenamiento agregamos la opcion
          options = {
            ...options,
            sort: { price: orden },
          };
        }
        if (query == "disponible") {
          //* En caso de que se busque por disponibilidad agregamos el filtro
          filter = {
            status: true,
          };
        }
        if (query == "agotado") {
          //* En caso de que se busque por disponibilidad agregamos el filtro
          filter = {
            status: false,
          };
        }
        const response = await this.db.paginate(filter, options); //* Hacemos la paginación

        if (filter.status == false && response.docs.length < 1) {
          return {
            status: 400,
            response: "No hay productos agotados",
          };
        }
        if (pagina > response.totalPages || 0 >= pagina) {
          //* En caso de que busque una página inexistente sera informado
          return {
            status: 400,
            response: `Página no encontrada, las páginas van de 1 a ${response.totalPages} `,
          };
        }

        let newGetFormat = {
          status: "Success",
          payload: response.docs,
          totalPages: response.totalPages,
          prevPage: response.prevPage,
          nextPage: response.nextPage,
          page: response.page,
          hasPrevPage: response.hasPrevPage,
          hasNextPage: response.hasNextPage,
          prevLink: actualizarPagina(
            await response.totalPages,
            "anterior",
            req.originalUrl
          ),
          nextLink: actualizarPagina(
            await response.totalPages,
            "siguiente",
            req.originalUrl
          ),
          firstLink: actualizarPagina(
            await response.totalPages,
            "first",
            req.originalUrl
          ),
          ultimateLink: actualizarPagina(
            await response.totalPages,
            "ultimate",
            req.originalUrl
          ),
        };

        return {
          status: 200,
          response: newGetFormat,
        };
      } else {
        return {
          status: 200,
          response: {
            status: "Success",
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: actualizarPagina(
              await productos.totalPages,
              "anterior",
              req.originalUrl
            ),
            nextLink: actualizarPagina(
              await productos.totalPages,
              "siguiente",
              req.originalUrl
            ),
          },
        };
      }
    } else {
      return {
        status: 400,
        response: "No hay ningún producto en la empresa",
      };
    }
  };
  addProduct = async (req) => {
    let nuevoProducto = req.body;
    nuevoProducto.owner = req.owner || "admin";

    // Añade la ruta del thumbnail al objeto nuevoProducto
    if (req.file) {
      nuevoProducto.thumbnail = `${process.env.DOMAIN_NAME}/productImages/${req.file.filename}`;
    }

    let verificacionDeCode = await this.db.find({
      code: nuevoProducto.code,
    });

    if (verificacionDeCode.length > 0) {
      return {
        status: 400,
        response: "Error, código existente",
      };
    }

    const response = await this.db.insertMany(nuevoProducto);
    return {
      status: 200,
      message: "Producto subido correctamente",
      response: response,
    };
  };
  getProductsWithId = async (id) => {
    let producto = await this.db.find({ _id: id });
    if (producto.length > 0) {
      return {
        status: 200,
        response: producto,
      };
    } else {
      return {
        status: 400,
        response: "Product not found",
      };
    }
  };
  updateProducts = async (idActualizar, nuevaInformacion) => {
    let producto = await productsModel.find({ _id: idActualizar });

    if (producto.length > 0) {
      if (nuevaInformacion) {
        await this.db.updateOne({ _id: idActualizar }, nuevaInformacion);
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
        response: "El id del producto no existe",
      };
    }
  };
  deleteProducts = async (idEliminar) => {
    let producto = await this.db.find({ _id: idEliminar });
    if (producto.length > 0) {
      await this.db.deleteOne({ _id: idEliminar });
      return {
        status: 200,
        response: "Success, product removed successfully",
      };
    } else {
      return {
        status: 400,
        response: "El id del producto no existe",
      };
    }
  };
  getProductWithOwner = async (owner) => {
    let producto = await this.db.find({ owner: owner });
    if (producto.length > 0) {
      return {
        status: 200,
        response: producto,
      };
    } else {
      return {
        status: 400,
        response: "No subiste ningún producto.",
      };
    }
  };
  deleteProductWithOwner = async (owner) => {
    if (owner !== "admin") {
      const productsToDelete = await this.db.find({ owner: owner });

      if (productsToDelete.length > 0) {
        const deletedProducts = [];

        for (const product of productsToDelete) {
          const deletedProduct = await this.db.deleteOne({ _id: product._id });
          deletedProducts.push(deletedProduct);
        }

        return {
          status: 200,
          response: `Success, ${deletedProducts.length} products removed successfully`,
        };
      } else {
        return {
          status: 200,
          response: "No hay productos que eliminar",
        };
      }
    } else {
      return {
        status: 400,
        response: "No puedes eliminar productos de administradores",
      };
    }
  };
}
