import express from "express";
import mongoose from "mongoose";
const router = express.Router();

import realtimeProductsRoutes from "./routes/realtimeProductsRouter.js";
import productRoutes from "./routes/productsRouter.js";
import cartRoutes from "./routes/cartRouter.js";
import chatRoutes from "./routes/chatRoutes.js";
import homeRouter from "./routes/homeRouter.js";
import sessionRoutes from "./routes/sessionRouter.js";

router.use("/", homeRouter);
router.use("/products", productRoutes);
router.use("/realtimeproducts", realtimeProductsRoutes);
router.use("/cart", cartRoutes);
router.use("/chat", chatRoutes);
router.use("/session", sessionRoutes);

export default router;
