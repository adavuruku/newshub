const express = require("express");
const router = express.Router();
const postController = require("./comment.controller");
const setAuthUser = require("../../../middleware/setAuthUser");

router
  .route("/comment")
  .post(setAuthUser,postController.create);

router.get('/comment/:post/:page',postController.find)

router.param('id', postController.id)
router
  .route("/comment/:id")
  .put(setAuthUser, postController.update)
  .patch(setAuthUser, postController.patch)
  .delete(setAuthUser, postController.delete)
  .get(setAuthUser, postController.findOne);

module.exports = router;
