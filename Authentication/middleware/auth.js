const jwt = require("jsonwebtoken");

//Model is optional

const auth = (req, res, next) => {
  // console.log(req.cookies.token);
  const token =
    (req.header("Authorization") &&
      req.header("Authorization").replace("Bearer ", "")) ||
    (req.cookies && req.cookies.token) ||
    req.body.token;
  if (!token) {
    return res.status(403).send("User not logged in");
  }

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);
  } catch (err) {
    return res.status(401).send("Invalid token");
  }

  return next();
};

module.exports = auth;
