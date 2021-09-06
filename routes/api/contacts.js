const express = require("express");
const router = express.Router();
const {
  joiContactSchemaMain,
  joiSchemaForFavorite,
} = require("../../models/contacts");
const { contact } = require("../../controllers");
const {
  validation,
  authenticate,
  controllerWrapper,
} = require("../../middlewares");

const validationMiddleware = validation(joiContactSchemaMain);
const validationForFavorite = validation(joiSchemaForFavorite);

router.get("/", controllerWrapper(authenticate), contact.getAllContacts);

router.get("/:id", controllerWrapper(authenticate), contact.getContactById);

router.post(
  "/",
  controllerWrapper(authenticate),
  validationMiddleware,
  contact.createContact
);

router.delete("/:id", controllerWrapper(authenticate), contact.removeContact);

router.put(
  "/:id",
  controllerWrapper(authenticate),
  validationMiddleware,
  contact.updateContact
);

router.patch(
  "/:id/favorite",
  controllerWrapper(authenticate),
  validationForFavorite,
  contact.updateStatusContact
);

module.exports = router;
