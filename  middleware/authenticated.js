const jwt = require("jwt-simple");
const moment = require("moment");
const SECRET_KEY = process.env.SECRET;

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "Request do not have headers.",
    });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, SECRET_KEY);
    if (payload.exp <= moment.unix()) {
      return res.status(404).send({
        message: "Token expired",
      });
    }
  } catch (ex) {
    // console.log(ex);
    return res.status(404).send({
      message: "Invalid token",
    });
  }
  req.user = payload;
  next();
};
