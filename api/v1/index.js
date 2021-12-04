const express = require("express");
const router = express.Router();

import userRoute from './user/user.route'
import postRoute from './post/post.route'
import commentRoute from './comment/comment.route'
router.use(userRoute)
router.use(postRoute)
router.use(commentRoute)
module.exports = router;