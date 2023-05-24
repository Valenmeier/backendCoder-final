import { Router } from "express";
import { generateProduct } from "./mockProducts.js";

const router = Router();

router.get("/", (req, res, next) => {
  try {
    let products = generateProduct(100);

    res.status(200).send({
      status: 200,
      response: products.response,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
