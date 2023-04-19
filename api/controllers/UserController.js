const database = require("../models");
const bcrypt = require("bcrypt");
const generateToken = require("../config/jwt.config");

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await database.User.findAll();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async getUser(req, res) {
    try {
      const { userId } = req.params;
      const user = await database.User.findOne({
        where: { id: Number(userId) },
        include: [
          {
            model: database.Address,
            as: "address",
          },
        ],
      });

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async signUp(req, res) {
    try {
      const SALT_ROUNDS = 10;
      const { password } = req.body || {};

      if (!password) {
        return res.status(400).json({ message: "Senha invalida." });
      }

      const salt = await bcrypt.genSalt(SALT_ROUNDS);

      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = await database.User.create({
        ...req.body,
        password: hashedPassword,
      });

      delete createdUser.password;

      return res.status(200).json(createdUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await database.User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).json({ message: "Email ou senha inválidos" });
      }

      if (await bcrypt.compare(password, user.password)) {
        const token = generateToken(user);
        res.cookie("jwt", token, { httpOnly: true });

        return res.status(200).json({
          user: {
            name: user.name,
            email: user.email,
            id: user.id,
            role: user.role,
          },
          token: token,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Email ou senha inválidossssss" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }

  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const newInfo = req.body;

      await database.User.update(newInfo, {
        where: { id: Number(userId) },
      });
      const updatedUser = await database.User.findOne({
        where: { id: Number(userId) },
      });

      return res.status(201).json(updatedUser);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      await database.User.destroy({ where: { id: Number(userId) } });

      return res.status(201).json({ message: "User deleted" });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

module.exports = UserController;
