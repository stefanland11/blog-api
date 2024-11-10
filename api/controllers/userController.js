const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const lengthErr = "must be between 1 and 30 characters.";
const validateUser = [
  body("email")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Email ${lengthErr}`),
  body("username")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Username ${lengthErr}`),
  body("password")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage(`Password: ${lengthErr}`),
];

const postSignUp = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //return res.status(400).json({ errors });
    }
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      console.log(req.body);
      const user = await db.createUserQuery(
        req.body.username,
        req.body.email,
        hashedPassword
      );

      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: "Failed to create user" });
    }
  },
];

const getSignUp = (req, res) => {
 // res.render("sign-up");
};

const getLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    //res.redirect("/");
  });
};

module.exports = {
  postSignUp,
  getSignUp,
  getLogOut,
};
