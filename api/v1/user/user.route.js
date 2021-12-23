const express = require("express");
const router = express.Router();
const setAuthUser = require("../../../middleware/setAuthUser");
const userController = require("./user.controller");

router
  .route("/user")
  .post(userController.create)
  .get(setAuthUser, userController.find)
  .delete(setAuthUser, userController.delete);;
router.get('/user/populate/:id', userController.findUserPopulation)
// router.param('id', userController.id)
router
  .route("/user/:id")
  .put(setAuthUser, userController.update)
  .patch(setAuthUser, userController.patch)
  .get(setAuthUser, userController.findOne);

router.post("/user/login", userController.login);
router.post("/user/changepassword",setAuthUser, userController.updatePassword);

module.exports = router;
