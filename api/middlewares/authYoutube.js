const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SIGN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    console.log(err);
  }
};
