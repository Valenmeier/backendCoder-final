import mongoose from "mongoose";
import { cartsSchema } from "./cartSchema.js";
import { transport } from "../../../../services/email/nodemailer.js";
const cartsCollection = "carts";
import dotenv from "dotenv";
dotenv.config();

let model = mongoose.model(cartsCollection, cartsSchema);

export class CartsModel {
  constructor() {
    this.db = model;
  }
  getAll = async () => {
    return await this.db
      .find()
      .then((carrito) => {
        if (carrito.length == 0) throw new Error("required");
        return {
          status: 200,
          payload: {
            result: "success",
            carts: carrito,
          },
        };
      })
      .catch((err) => {
        return {
          status: 400,
          payload: {
            result: `No hay ningún carrito`,
          },
        };
      });
  };
  createCart = async () => {
    const nuevoCarrito = {
      products: [],
    };
    let result = await this.db.create(nuevoCarrito);
    return result;
  };
  getOneCart = async (id) => {
    let carrito = await this.db.find({ _id: id });
    if (carrito.length > 0) {
      return {
        status: 200,
        payload: {
          result: "success",
          response: carrito,
        },
      };
    } else {
      return {
        status: 400,
        payload: {
          result: `Carrito no encontrado`,
        },
      };
    }
  };
  isValidCart = async (id) => {
    let carrito = await this.db.find({ _id: id });
    if (carrito.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  addProduct = async (productoId, carritoId) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { $inc: { "products.$.quantity": +1 } }
      );
      return {
        status: 200,
        payload: {
          result: "success",
          response: { status: 200, response: "Agregado correctamente" },
        },
      };
    }
    await this.db.updateOne(
      { _id: carritoId },
      { $push: { products: { _id: productoId }, quantity: 1 } }
    );
    return {
      status: 200,
      payload: {
        result: "success",
        response: { status: 200, response: "Actualizado Correctamente" },
      },
    };
  };

  deleteProduct = async (productoId, carritoId) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { $pull: { products: { _id: productoId } } }
      );
      return {
        status: 200,
        payload: {
          result: "success",
          response: { status: 200, response: "Eliminado correctamente" },
        },
      };
    }
    return {
      status: 200,
      payload: {
        result: "success",
        response: { status: 200, response: "Eliminado correctamente" },
      },
    };
  };
  updateWithArray = async (carritoId, products) => {
    let carrito = await this.db.updateOne({ _id: carritoId }, { products });
    return {
      status: 200,
      payload: {
        result: `productos agregados correctamente`,
        payload: carrito,
      },
    };
  };
  updateQuantity = async (carritoId, productoId, cantidadNueva) => {
    let buscarProductoDentro = await this.db.findOne({
      "products._id": productoId,
    });
    if (buscarProductoDentro) {
      await this.db.updateOne(
        { "products._id": productoId },
        { "products.$.quantity": cantidadNueva }
      );
      return {
        status: 200,
        payload: {
          result: `cantidades cambiadas correctamente`,
        },
      };
    }
    await this.db.updateOne(
      { _id: carritoId },
      { $push: { products: { _id: productoId }, quantity: cantidadNueva } }
    );
    return {
      status: 200,
      payload: {
        result: `cantidades cambiadas correctamente`,
      },
    };
  };
  deleteAllProducts = async (carritoId) => {
    let carrito = await this.db.updateOne(
      { _id: carritoId },
      { $set: { products: [] } }
    );
    return {
      status: 200,
      payload: {
        result: { status: 200, response: `Productos eliminados correctamente` },
      },
    };
  };
  buyProducts = async (user) => {
    let cart = await fetch(
      `${process.env.DOMAIN_NAME}/api/carts/${user.cart}`,
      {
        headers: {
          token: user.token,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        return data[0];
      });

    if (cart.products.length == 0) {
      return {
        status: 405,
        response:
          "Esta acción no está permitida debido a que su carrito se encuentra vacío",
      };
    }

    let failedProducts = [];
    let buyContinueProducts = [];

    for (let products of cart.products) {
      if (products._id.stock < products.quantity) {
        failedProducts.push(products);
      } else {
        buyContinueProducts.push(products);
      }
    }

    let purchasedProductsString = buyContinueProducts
      .map((product) => product._id.title)
      .join(", ");
    let failedProductsString = failedProducts
      .map((product) => product._id.title)
      .join(", ");

    let message = "";

    if (failedProducts.length == 0) {
      message =
        "Todos los productos se han comprado correctamente. Revisa tu email para más información";
    } else if (buyContinueProducts.length > 0 && failedProducts.length > 0) {
      message = `Los productos: ${purchasedProductsString} se pudieron comprar correctamente. Los productos: ${failedProductsString} no se pudieron comprar debido a que no tienen stock. Revisa tu email para más información`;
    } else {
      message = `Los productos: ${failedProductsString} no se pudieron comprar debido a que no tienen stock.`;
    }

    let amount = 0;

    for (let buyProducts of buyContinueProducts) {
      amount += buyProducts.quantity * buyProducts._id.price;
      let nuevoStock = JSON.stringify({
        stock: buyProducts._id.stock - buyProducts.quantity,
      });

      let email = process.env.ADMIN_PRODUCTS_AND_VERIFICATION_NAME;
      let password = process.env.ADMIN_PRODUCTS_AND_VERIFICATION_PASSWORD;

      let adminUser = await fetch(
        `${process.env.DOMAIN_NAME}/api/sessions/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      ).then((res) => res.json());

      await fetch(
        `${process.env.DOMAIN_NAME}/api/products/${buyProducts._id._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: adminUser.response.token,
          },
          body: nuevoStock,
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.status !== 200) {
            throw new Error(
              "Ha ocurrido un error en el servidor: el stock no se pudo cambiar, por favor intenta nuevamente"
            );
          }
        });

      await fetch(
        `${process.env.DOMAIN_NAME}/api/carts/${user.cart}/products/${buyProducts._id._id}`,
        {
          method: "DELETE",
        }
      ).then((res) => res.json());
    }

    let generarTicket = JSON.stringify({ amount: amount, email: user.email });

    if (amount > 0) {
      await fetch(`${process.env.DOMAIN_NAME}/api/ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: user.token,
        },
        body: generarTicket,
      })
        .then((res) => res.json())
        .then((res) => {
        
          let fecha = res.response.purchase_datatime.split("T");

          transport.sendMail({
            from: process.env.MAIL_USER,
            to: res.response.purchaser,
            subject: "Compra en meiercommerce",
            html: `
                    <div>
                        <h1>Se ha completado tu compra en meiercommerce </h1>
                        <h3>El monto total de la misma fue de : $${res.response.amount} </h3>
                        <h3>La compra fue realizada el día ${fecha[0]} a las ${fecha[1]}</h3>
                        <h3>El código de su compra es ${res.response.code}</h3>
                        <h4>Gracias por confiar en nosotros, esperamos su pronta vuelta 😁.</h4>
                    </div>
                `,
            attachments: [],
          });
        });
    }
    await this.db.updateOne({ _id: user.cart }, { $set: { products: [] } });
    return {
      status: 200,
      response: message,
    };
  };
}
