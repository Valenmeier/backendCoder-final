//* Dependencias
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
//* Rutas
import _dirname, { MongoInstance } from "./utils.js";
import ruters from "./routes/routes.js";
//*Middlewares
import errorHandler from "./middlewares/errorHandler.js";
//* Models
import passport from "passport";
import initializePassport from "./config/passportConfig.js";
import MongoConnection from "./mongoSingleton.js";
import { socketServer } from "./config/socket.js";
import { addLogger } from "./services/logger/logger.js";
import swaggerConfig from "./services/swagger/swaggerConfig.js";

dotenv.config();
const app = express();
app.use("/apidocs", swaggerConfig.serve, swaggerConfig.setup);

initializePassport();

MongoConnection.getInstance();

app.use(
  cors({
    origin: process.env.FRONT_DOMAIN,
    credentials: true,
  })
);
app.use(addLogger);
app.use(session(MongoInstance));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser("valen"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(_dirname + `/public`));
app.use(
  "/profileImages",
  express.static(_dirname + "/.." + `/uploads/profiles`)
);
app.use(
  "/productImages",
  express.static(_dirname + "/.." + `/uploads/productImages`)
);
socketServer(app);
app.engine(`handlebars`, handlebars.engine());
app.set(`views`, "src/client/views");
app.set(`partials`, "src/client/partials");
app.set(`view engine`, `handlebars`);

app.use("/", ruters);
app.use(errorHandler);
