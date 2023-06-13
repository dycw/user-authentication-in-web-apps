import passport from "passport";
import { validPassword } from "../lib/passwordUtils";
import { User } from "./database";
import { Strategy } from "passport-local";

const customFields = {
  usernameField: "uname",
  passwordField: "pw",
};

const strategy = new Strategy(
  customFields,
  async (username, password: string, done) => {
    const user = await User.findOne({ username });
    try {
      if (!user) {
        return done(null, false);
      }
      const isValid = validPassword(password, user.hash!, user.salt!);
      return done(null, isValid ? user : false);
    } catch (err) {
      done(err);
    }
  },
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await User.findById(userId);
  try {
    done(null, user);
  } catch (err) {
    done(err);
  }
});
