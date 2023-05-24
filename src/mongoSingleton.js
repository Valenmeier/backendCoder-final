import { connect, set } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default class MongoConnection {
  static #instance;
  constructor() {
    set("strictQuery", false);
    connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGODB_NAME,
    });
  }
  static getInstance = () => {
    if (this.#instance) {
      console.log("Already connected!");

      return this.#instance;
    }
    this.#instance = new MongoConnection();
    console.log("Connected");
    return this.#instance;
  };
}
