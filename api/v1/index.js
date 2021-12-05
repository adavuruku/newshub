const express = require("express");
const router = express.Router();

const userRoute =require('./user/user.route')
const postRoute =require('./post/post.route')
const commentRoute =require('./comment/comment.route')
// import commentRoute from './comment/comment.route'
router.use(userRoute)
router.use(postRoute)
router.use(commentRoute)
module.exports = router;