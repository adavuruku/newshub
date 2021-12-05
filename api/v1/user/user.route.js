const express = require("express");
const router = express.Router();
const setAuthUser = require("../../../middleware/setAuthUser");
const userController = require("./user.controller");

router
  .route("/user")
  .post(userController.create)
  .get(setAuthUser, userController.find);

router.param('id', userController.id)
router
  .route("/user/:id")
  .put(setAuthUser, userController.update)
//   .patch(userController.allUsers)
  .get(setAuthUser, userController.findOne);
router.post("/user/login", userController.login);

module.exports = router;
