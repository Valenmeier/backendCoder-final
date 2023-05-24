import multer from "multer";
import path from "path";
import fs from "fs";
import _dirname from "../utils.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(_dirname, "../uploads/productImages"); // usa path.join para unir los segmentos de la ruta
    fs.mkdirSync(dir, { recursive: true }); // crea el directorio si no existe
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

export const uploadProductImage = multer({ storage: storage });
