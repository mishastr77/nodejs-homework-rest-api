const express = require("express");
const router = express.Router();
const {
  joiContactSchemaMain,
  joiSchemaForFavorite,
} = require("../../model/contacts");
const contact = require("../../controllers/contacts");
const validation = require("../../middlewares/validation");

const validationMiddleware = validation(joiContactSchemaMain);
const validationForFavorite = validation(joiSchemaForFavorite);

router.get("/", contact.getAllContacts);

router.get("/:id", contact.getContactById);

router.post("/", validationMiddleware, contact.createContact);

router.delete("/:id", contact.removeContact);

router.put("/:id", validationMiddleware, contact.updateContact);

router.patch(
  "/:id/favorite",
  validationForFavorite,
  contact.updateStatusContact
);

module.exports = router;
