import { faker } from "@faker-js/faker";
import CustomError from "../../services/errors/customErrors.js";
import EErrors from "../../services/errors/enums.js";
export const generateProduct = (quantity) => {
  if (!quantity)
    CustomError.createError({
      status: EErrors.SERVER_ERROR,
      response: "Quantity of products is not defined",
    });
  let products = [];
  for (let index = 0; index < quantity; index++) {
    let newProduct = {
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.commerce.productDescription(),
      code: faker.random.numeric(1),
      status: true,
      stock: faker.random.numeric(1),
      thumbnail: faker.image.image(),
    };
    products.push(newProduct);
  }
  return {
    status: 200,
    response: products,
  };
};
