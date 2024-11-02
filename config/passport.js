const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });

      if (!user) {
        console.log("incorrect user");
        return done(null, false, { message: "Incorrect username" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log("incorrect pass");
        return done(null, false, { message: "Incorrect password" });
      }
      console.log("succeess");
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

module.exports = passport;