const database = require("../models");
const bcrypt = require("bcrypt");
const generateToken = require("../config/jwt.config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");

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

      const cart = await createdUser.createCart();
      async function notifyAdmin(toEmail) {
        const transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "0105dc2752e455",
            pass: "54351b02f74217",
          },
        });

        const info = await transport.sendMail({
          from: "bernardobossi77@gmail.com",
          to: toEmail,
          subject: "Confirm your account",
          text: "Click in the link below to confirm your account",
        });
      }

      await notifyAdmin(createdUser.email);

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
      const userId = req.currentUser.id;
      const newInfo = req.body;
      console.log(req.currentUser.id);

      await database.User.update(newInfo, {
        where: { id: Number(userId) },
      });
      const updatedUser = await database.User.findOne({
        where: { id: Number(userId) },
      });

      return res.status(201).json(updatedUser);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      await database.Cart.destroy({ where: { userId: Number(userId) } });
      await database.User.destroy({ where: { id: Number(userId) } });

      return res.status(201).json({ message: "User deleted" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  static async forgotPassword(req, res) {
    try {
      crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
          console.log(err);
        }

        const token = buffer.toString("hex");

        const { email } = req.body;
        const user = await database.User.findOne({ where: { email: email } });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();

        async function notifyAdmin(toEmail) {
          const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "0105dc2752e455",
              pass: "54351b02f74217",
            },
          });

          const info = await transport.sendMail({
            from: "bernardobossi77@gmail.com",
            to: toEmail,
            subject: "Forgot Password",
            text: "Click in the link below to update your password",
          });
        }
        await notifyAdmin(user.email);

        return res
          .status(200)
          .json({ message: "Check your email, to update your password" });
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async updatePassword(req, res) {
    try {
      const { newPassword } = req.body;
      const { token } = req.params;

      const user = await database.User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiration: { [Op.gte]: Date.now() },
        },
      });

      if (
        !user.resetToken ||
        user.resetToken !== token ||
        user.resetTokenExpiration <= Date.now()
      ) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;

      await user.save();

      return res.status(200).json({ message: "Password updated succesfully" });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = UserController;
