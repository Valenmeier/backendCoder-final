import EErrors from "../services/errors/enums.js";

export default (error, req, res, next) => {
  switch (error.status) {
    case EErrors.INVALID_TYPES_ERROR:
      res
        .status(error.status)
        .send({ status: error.status, response: error.response });
      break;
    case EErrors.SERVER_ERROR:
      res
        .status(error.status)
        .send({ status: error.status, response: error.response });
      break;
    default:
      
      res.send({ status: "error", error: "Unhandled error" });
  }
};
