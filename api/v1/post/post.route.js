const express = require("express");
const router = express.Router();
const postController = require("./post.controller");
const setAuthUser = require("../../../middleware/setAuthUser");

router
  .route("/post")
  .post(setAuthUser,postController.create)
  .get(setAuthUser, postController.find);

router.get('/post/index/:page',postController.public)

router.param('id', postController.id)
router
  .route("/post/:id")
  .put(setAuthUser, postController.update)
  .patch(setAuthUser, postController.patch)
  .delete(setAuthUser, postController.delete)
  .get(setAuthUser, postController.findOne);

module.exports = router;
