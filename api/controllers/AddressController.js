const database = require("../models");

class AddressController {
  static async createAddres(req, res) {
    try {
      const createdAddres = req.body;
      const newAddress = await database.Address.create(createdAddres);

      return res.status(200).json(newAddress);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async updateAddres(req, res) {
    try {
      const { addressId } = req.params;
      const newInfo = req.body;

      await database.Address.update(newInfo, {
        where: { id: Number(addressId) },
      });

      const updatedAddress = await database.Address.findOne({
        where: { id: Number(addressId) },
      });

      return res.status(200).json(updatedAddress);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async deleteAddress(req, res) {
    try {
      const { addressId } = req.params;

      await database.Address.destroy({
        where: { id: Number(addressId) },
      });

      return res
        .status(200)
        .json({ message: `O endereço ${addressId} was completed deleted` });
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

module.exports = AddressController;
