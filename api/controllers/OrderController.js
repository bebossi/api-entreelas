const database = require("../models");

class OrderController {
  static async getOrders(req, res) {
    try {
      const orders = await database.Order.findAll({
        include: [
          {
            model: database.Product,
          },
          {
            model: database.User,
            include: [
              {
                model: database.Address,
              },
            ],
          },
        ],
      });
      return res.status(200).json(orders);
    } catch (err) {
      console.log(err);
    }
  }

  static async createOrderByCart(req, res) {
    try {
      const { userId } = req.currentUser.id;
      console.log(userId);
      const user = await database.User.findByPk(userId);
      const cart = await user.getCart();
      const products = await cart.getProducts();
      const order = await user.createOrder();

      await order.addProducts(products);

      const orderProducts = await products.map(async (product) => {
        const orderItem = await database.OrderItem.findOne({
          where: {
            ProductId: product.id,
            OrderId: order.id,
          },
        });

        if (!orderItem) {
          orderItem = await database.OrderItem.create({
            quantity: product.CartItem.quantity,
            price: product.CartItem.price,
            OrderId: order.id,
            ProductId: product.id,
          });
        } else {
          await orderItem.update({
            quantity: product.CartItem.quantity,
            price: product.CartItem.price,
          });
        }

        product.OrderItem = orderItem;

        return { product, orderItem };
      });

      const createdOrder = await database.Order.findOne({
        where: { id: order.id },
        include: database.Product,
      });

      const totalPrice = products.reduce((sum, product) => {
        return sum + product.price * product.CartItem.quantity;
      }, 0);

      createdOrder.update({
        totalPrice: totalPrice,
      });

      return res.status(201).json(createdOrder);
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { orderId } = req.params;
      const orderItem = await database.OrderItem.destroy({
        where: { OrderId: Number(orderId) },
      });
      const order = await database.Order.destroy({
        where: { id: Number(orderId) },
      });

      return res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = OrderController;
