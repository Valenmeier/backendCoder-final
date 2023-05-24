import dotenv from "dotenv";
dotenv.config();
let modelo;

switch (process.env.factory) {
  case "FS":
    let {default:fsModel} = await import("./dao/fileSystem/manangers/productMananger.js");
    modelo = fsModel;

    break;
  case "MONGO":
    let {ProductsModel:mongoModel} = await import("./dao/mongodb/productsModel.js");

    modelo = mongoModel;
    break;
  default:
    let {deafult:defaultModel}= await import("./dao/mongodb/productsModel.js");

    modelo = defaultModel;
    break;
}

export let ProductsModel = modelo;
