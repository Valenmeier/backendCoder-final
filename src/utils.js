import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
dotenv.config();

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
export default _dirname;

export const MongoInstance = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    mongoOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ttl: 30,
  }),
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: true,
};


