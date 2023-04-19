const database = require("../models");

class CartController {
  static async postCart(req, res) {
    try {
      const cart = await database.Cart.create();

      return res.status(200).json(cart);
    } catch (err) {
      console.log(err);
    }
  }

  static async addProduct(req, res) {
    try {
      const { productId } = req.body;
      const { cartId } = req.params;

      // Find the cart and associated products
      const cart = await database.Cart.findByPk(cartId);

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      // Check if the product is already in the cart

      const productInsideCart = await cart.getProducts({
        where: { id: productId },
      });

      if (productInsideCart[0] && productInsideCart[0].id === productId) {
        console.log("cai aqui");
        const cartItem = productInsideCart[0].CartItem;
        await cartItem.update({
          quantity: cartItem.quantity + 1,
          price: productInsideCart[0].price * (cartItem.quantity + 1),
        });
      } else {
        // If the product is not in the cart, add it with quantity = 1
        const newProduct = await database.Product.findByPk(productId);
        await cart.addProduct(newProduct);
        const cartItem = await database.CartItem.findOne({
          where: { ProductId: productId },
        });
        await cartItem.update({
          quantity: 1,
          price: newProduct.price,
        });
      }

      // Reload the cart to get the updated products
      const products = await cart.getProducts();
      const totalPrice = products.reduce((sum, product) => {
        const cartItem = product.CartItem;
        return sum + cartItem.quantity * product.price;
      }, 0);

      await cart.update({ totalPrice });

      const updatedCart = await database.Cart.findByPk(cartId, {
        include: database.Product,
      });

      return res.status(200).json(updatedCart);
    } catch (err) {
      console.log(err);
    }
  }

  static async removeProductCart(req, res) {
    try {
      const { productId } = req.body;
      const { cartId } = req.params;

      const cart = await database.Cart.findByPk(cartId);
      const product = await cart.getProducts({ where: { id: productId } });

      const removeItem = cart.removeProduct(product);

      const updatedCart = await database.Cart.findByPk(cartId);
      return res.status(200).json(updatedCart);
    } catch (err) {
      console.log(err);
    }
  }

  static async getProductsCart(req, res) {
    try {
      const { productId } = req.body;
      const { cartId } = req.params;

      const cart = await database.Cart.findByPk(cartId, {
        include: database.Product,
      });
      const products = await cart.getProducts();

      return res.status(200).json(cart);
    } catch (err) {
      console.log(err);
    }
  }

  static async updateCart(req, res) {
    try {
      const { cartId } = req.params;
      const cart = await database.Cart.findByPk(cartId);
      const productsInsideCart = await cart.getProducts();
      const updatedCart = await cart.update({
        totalPrice: productsInsideCart.price,
      });
      return res.status(200).json(updatedCart);
    } catch (err) {
      console.log(err);
    }
  }

  static async createCartItem(req, res, next) {
    try {
      const { productId, cartId } = req.body;
      const product = await database.Product.findByPk(productId);
      const cart = await database.Cart.findByPk(cartId);
      const cartItem = await database.CartItem.create({
        CartId: cart.id,
        ProductId: product.id,
        price: product.price,
        quantity: product.quantity,
      });

      return res.status(200).json(cartItem);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = CartController;
