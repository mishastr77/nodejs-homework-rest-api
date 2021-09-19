const express = require("express");

const { auth: ctrl } = require("../../controllers");
const { joiSchema } = require("../../models/user");
const {
  validation,
  controllerWrapper,
  authenticate,
  upload,
} = require("../../middlewares");

const router = express.Router();

const userValidationMiddleware = validation(joiSchema);

router.post(
  "/users/signup",
  userValidationMiddleware,
  controllerWrapper(ctrl.signup)
);

router.post(
  "/users/login",
  userValidationMiddleware,
  controllerWrapper(ctrl.login)
);

router.post(
  "/users/logout",
  controllerWrapper(authenticate),
  controllerWrapper(ctrl.logout)
);

router.get(
  "/users/current",
  controllerWrapper(authenticate),
  controllerWrapper(ctrl.current)
);

router.patch(
  "/users/avatars",
  upload.single("avatarURL"),
  controllerWrapper(authenticate),
  controllerWrapper(ctrl.updateAvatar)
);

router.get("/users/verify/:verificationToken", controllerWrapper(ctrl.verify));

module.exports = router;
