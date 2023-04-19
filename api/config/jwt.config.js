const jwt = require("jsonwebtoken");

function generateToken(user) {
  const { id, nome, email, role } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;

  const expiration = "8h";

  return jwt.sign({ id, nome, email, role }, signature, {
    expiresIn: expiration,
  });
}
module.exports = generateToken;
