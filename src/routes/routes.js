import { Router } from "express";
import cartsRouter from "../components/carts/routes.js";
import chatRouter from "../components/chats/routes.js";
import productsRouter from "../components/products/routes.js";
import sessionRouter from "../components/sessions/routes.js";
import ticketRouter from "../components/ticket/routes.js";
import mockingProducts from "../components/mock/routes.js";
import loggerTest from "../components/log/routes.js";
import users from "../components/user/routes.js";
import handlebarsRouter from "../client/handlebarRoutes.js";

const router = Router();

router.use("/", handlebarsRouter);
router.use("/loggerTest", loggerTest);
router.use("/mockingproducts", mockingProducts);
router.use("/api/users", users);
router.use("/api/ticket", ticketRouter);
router.use("/api/sessions", sessionRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/chat", chatRouter);
router.use("/api/products", productsRouter);

export default router;
