const { Contact } = require("../models/contacts");

const createContact = async (req, res, next) => {
  try {
    const newContact = { ...req.body, owner: req.user._id };
    console.log(req.user._id);
    const result = await Contact.create(newContact);
    res.status(201).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find({ owner: req.user._id }).populate(
      "owner",
      "_id email"
    );
    res.status(200).json({
      result,
    });
  } catch (error) {
    next();
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.status(200).json({
      result,
    });
  } catch (error) {
    next();
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.status(201).json({
      result,
    });
  } catch (error) {
    next();
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );
    if (!result) {
      res.status(400).json({
        message: "missing field favorite",
      });
    }

    res.status(200).json({
      result,
    });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findByIdAndRemove({ _id: id });
    if (!result) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    res.status(204).json({
      result,
    });
  } catch (error) {
    next();
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  removeContact,
  updateStatusContact,
};
