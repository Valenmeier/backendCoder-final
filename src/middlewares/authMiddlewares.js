import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: "24h" });
};
export const generatePasswordToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_PASSWORD_KEY, { expiresIn: "1h" });
};

export const authToken = (req, res, next) => {
  const authToken = req.headers.token;
  if (!authToken)
    return res.status(401).send({
      status: 401,
      response: "Token not recibed",
    });
  jwt.verify(authToken, process.env.JWT_PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(403).send({
        status: 403,
        response: "No authorized",
      });
    }
    req.user = credentials.user;
    next();
  });
};

export const authPasswordToken = async (req, res, next) => {
  let { token } = req.params;
  let email;
  const authToken = token;
  if (!authToken)
    return res.status(401).send({
      status: 401,
      response: "Token not received",
    });
  try {
    const credentials = await new Promise((resolve, reject) => {
      jwt.verify(authToken, process.env.JWT_PASSWORD_KEY, (error, decoded) => {
        if (error) reject(error);
        else resolve(decoded);
      });
    });
    email = {
      status: 200,
      response: credentials.email,
    };
  } catch (error) {
    email = {
      status: 403,
      response:
        "Su token de cambio de contraseña expiró, envie otro mail nuevamente",
    };
  }
  if (email.status == 403) {
    return res.status(email.status).send({ response: email.response });
  } else {
    req.user = email;
    next();
  }
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(401).render("error", {
          mensaje: info.messages ? info.messages : info.toString(),
        });

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const extractCookie = (req) =>
  req && req.cookies ? req.cookies[process.env.COOKIE_NAME_JWT] : null;

export const authorization = (...roles) => {
  return async (req, res, next) => {
    let token = req.headers.token;

    fetch(`${process.env.DOMAIN_NAME}/api/sessions/current`, {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200 && roles.includes(data.response.rol)) {
          if (data.response.rol == "premium") {
            req.owner = data.response.email;
          }
          req.role = data.response.rol;
          next();
        } else {
          return res.status(401).send({
            status: 401,
            response: `No autorizado: Solo los ${roles.join(
              " o "
            )} pueden acceder a este contenido, tu rol es ${data.response.rol}`,
          });
        }
      });
  };
};
