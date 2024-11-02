const expressSession = require("express-session");
const express = require("express");
const jwt = require("jsonwebtoken");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const passport = require("./config/passport");
const apiRouter = require("./routes/apiRouter");
const userRouter = require("./routes/userRouter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(apiRouter);
app.use(userRouter);

const SECRET_KEY = process.env.SECRET_KEY; 

app.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({ token });
  })(req, res, next);
});

app.listen(3000, () => console.log("running on port 3000"));
