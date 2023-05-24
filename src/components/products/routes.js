import { Router } from "express";
import { ProductsController } from "./productsController.js";
import { uploadProductImage } from "../../middlewares/productUploadImage.js";
import { authToken, authorization } from "../../middlewares/authMiddlewares.js";

const router = Router();

let Controller = new ProductsController();

//* Obtener Productos

router.get("/", async (req, res, next) => {
  try {
    let productos = await Controller.getAllProducts(req);

    if (productos.status == 200) {
      return res.status(200).json(productos.response);
    } else {
      return res.status(400).json(productos.response);
    }
  } catch (error) {
    next(error);
  }
});

//* Subir producto
router.post(
  "/",
  authorization("admin", "premium"),
  uploadProductImage.single("thumbnail"), // multer se encargará del archivo con el nombre 'thumbnail'
  async (req, res, next) => {
    try {
      let result = await Controller.addProduct(req);
      if (result.status == 200) {
        return res.status(200).send(result);
      } else {
        return res.status(400).send(result.response);
      }
    } catch (error) {
      next(error);
    }
  }
);

//* Traer Productos con un id
router.get("/:pid", async (req, res, next) => {
  try {
    let result = await Controller.getProductWhitId(req.params.pid);
    if (result.status == 200) {
      return res.status(200).send(result.response);
    } else {
      return res.status(400).send(result.response);
    }
  } catch (error) {
    next(error);
  }
});
//* Traer Productos con un owner
router.get("/getAllProduct/owner", authToken, async (req, res, next) => {
  try {
    let result = await Controller.getProductWithOwner(req.user.email);

    if (result.status == 200) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    next(error);
  }
});

//*Actualizar productos
router.put(
  "/:pid",
  authorization("admin", "premium"),
  async (req, res, next) => {
    try {
      let result = await Controller.updateProducts(req);
      if (result.status == 200) {
        return res.status(200).send({
          status: result.status,
          response: result.response,
        });
      } else {
        return res.status(400).send(result.response);
      }
    } catch (error) {
      next(error);
    }
  }
);

//* Eliminar productos
router.delete(
  "/:pid",
  authorization("admin", "premium"),
  async (req, res, next) => {
    try {
      let result = await Controller.deleteProducts(req);
      if (result.status == 200) {
        return res.status(200).send(result);
      } else {
        return res.status(400).send(result);
      }
    } catch (error) {
      next(error);
    }
  }
);

//* Eliminar productos con owner

router.delete("/deleteAllProduct/owner", authToken, async (req, res, next) => {
  try {
    let { owner } = req.headers;
    if (req.user.rol == "admin" || req.user.email == owner) {
      let result = await Controller.deleteProductWithOwner(owner);
      if (result.status == 200) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } else {
      return res
        .status(400)
        .send({ status: 400, response: "NO PUEDES ELIMINAR ESTOS PRODUCTOS" });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
