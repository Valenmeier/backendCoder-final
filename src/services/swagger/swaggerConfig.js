import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import _dirname from "../../utils.js"

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "📄 MeierCommerce API documentation 📄",
      description: "Documentación del backend de MeierCommerce ",
    },
  },
  apis: [`${_dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

const swaggerConfig = {
  serve: swaggerUiExpress.serve,
  setup: swaggerUiExpress.setup(specs),
};

export default swaggerConfig;