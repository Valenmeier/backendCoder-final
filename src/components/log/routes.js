import { Router } from "express";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    req.logger.debug("Debug Test");
    req.logger.info("Info Test");
    req.logger.http("Http Test");
    req.logger.warning("Warning Test");
    req.logger.error("Error Test");
    req.logger.fatal("Fatal Error Test");
  } catch (error) {
    next(req.logger.error(error));
  }
});

export default router;
