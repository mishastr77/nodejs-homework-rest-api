const express = require("express");
const router = express.Router();
const { joiContactSchema } = require("../../validation/contactsSchema");
const Contacts = require("../../model");

router.get("/", async (req, res, next) => {
  try {
    const result = await Contacts.listContacts();
    return res.json({ status: "success", code: 200, data: { result } });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    return res.json({
      contact,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = joiContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
    const newContact = await Contacts.addContact(req.body);
    return res.status(201).json({ newContact });
  } catch (error) {
    next(error);
  }
  res.json({ message: "template message" });
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleteContact = await Contacts.removeContact(req.params.id);
    if (!deleteContact) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    return res.json({
      message: "contact deleted",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = joiContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: "missing fields",
      });
    }
    const updateContact = await Contacts.updateContact(req.params.id, req.body);
    if (!updateContact) {
      return res.status(400).json({
        message: "Not found",
      });
    }
    return res.json({ updateContact });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
