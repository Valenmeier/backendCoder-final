import { Router } from "express";
import { CartController } from "./cartController.js";
import { authToken } from "../../middlewares/authMiddlewares.js";
import { PurchaseDTO } from "./purchaseDTO/purchaseDTO.js";

const router = Router();
let controller = new CartController();
//* Listar todos los carritos
router.get("/", async (req, res, next) => {
  try {
    const carts = await controller.getAll();
    if (carts.status == 200) {
      return res.status(200).send(carts.payload);
    }
    return res.status(400).send(carts.payload.result);
  } catch (error) {
    next(error);
  }
});

//* Crear nuevos carritos
router.post("/", async (req, res, next) => {
  try {
    const result = await controller.createCart();
    res.status(200).send({
      result: "success",
      payload: result,
    });
  } catch (error) {
    next(error);
  }
});

//*Buscar carrito por id y mostrarlo
router.get("/:cid", authToken, async (req, res, next) => {
  try {
    if (req.params.cid == req.user.cart) {
      const result = await controller.seeOneCart(req);
      if (result.status == 200) {
        return res.status(200).send(result.payload.response);
      }
      return res.status(400).send(result.payload.result);
    } else {
      res.status(401).send({
        status: 401,
        response: "El carrito no corresponde al token enviado",
      });
    }
  } catch (error) {
    next(error);
  }
});

//* Agregar producto a carrito
router.post("/:cid/products/:pid", authToken, async (req, res, next) => {
  try {
    if (req.params.cid == req.user.cart) {
      const result = await controller.addProductToCart(req);
      if (result.status == 200) {
        return res.status(200).send(result.payload.response);
      }
      return res.status(400).send(result.payload.result);
    } else {
      res.status(401).send({
        status: 401,
        response: "El carrito no corresponde al token enviado",
      });
    }
  } catch (error) {
    next(error);
  }
});

//*Eliminar producto carrito
router.delete("/:cid/products/:pid", authToken, async (req, res, next) => {
  try {
    const result = await controller.deleteProduct(req);
    if (result.status == 200) {
      return res.status(200).send(result.payload.response);
    }
    return res.status(400).send(result.payload.result);
  } catch (error) {
    next(error);
  }
});

//* Actualizar el carrito con un arreglo
router.put("/:cid", authToken, async (req, res, next) => {
  try {
    if (req.params.cid == req.user.cart) {
      const result = await controller.updateWithArray(req);
      if (result.status == 200) {
        return res.status(200).send(result.payload);
      }
      return res.status(400).send(result.payload.result);
    } else {
      res.status(401).send({
        status: 401,
        response: "El carrito no corresponde al token enviado",
      });
    }
  } catch (error) {
    next(error);
  }
});

//* Actualizar cantidades del producto
router.put("/:cid/products/:pid", async (req, res, next) => {
  try {
    const result = await controller.updateQuantity(req);
    if (result.status == 200) {
      return res.status(200).send(result.payload.result);
    }
    return res.status(400).send(result.payload.result);
  } catch (error) {
    next(error);
  }
});

//* Eliminar todos los productos de un carrito
router.delete("/:cid", authToken, async (req, res, next) => {
  try {
    if (req.params.cid == req.user.cart) {
      const result = await controller.deleteAllProducts(req);
      if (result.status == 200) {
        return res.status(200).send(result.payload.result);
      }
      return res.status(400).send(result.payload.result);
    } else {
      res.status(401).send({
        status: 401,
        response: "El carrito no corresponde al token enviado",
      });
    }
  } catch (error) {
    next(error);
  }
});

//*
router.post("/:cid/purchase", authToken, async (req, res, next) => {
  try {
    if (req.params.cid == req.user.cart) {
      let user = new PurchaseDTO(req.user, req.headers.token);
     
      const result = await controller.buyProducts(user);
      if (result.status == 200) {
        return res.status(result.status).send({
          status: result.status,
          response: result.response,
        });
      } else {
        return res.status(result.status).send({
          status: result.status,
          response: result.response,
        });
      }
    } else {
      res.status(401).send({
        status: 401,
        response: "El carrito no corresponde al token enviado",
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
