const express = require("express");
const router = express.Router();

const {
  check_is_Active,
  check_is_admin,
  check_is_consultant,
  check_is_consultant_and_admin,
} = require("../middlewares/check-auth");
const userController = require("../controllers/userController");

//route to add phone to NIN
router.params('id', userController.id)
app.route('/book')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })
router.post("/comment", userController.add_new_user)
.patch()
.;
router.post("/customer/register", userController.add_new_customer);
router.patch(
  "/customer/update",
  check_is_Active,
  userController.update_user_information
);

module.exports = router;
