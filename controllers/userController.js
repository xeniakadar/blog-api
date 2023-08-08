const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../controllers/user");

// create user
// exports.signup_get = (req, res, next) => {
//   res.render()
// }
