import fs from "fs";
import { Strategy, ExtractJwt } from "passport-jwt";
import { fileURLToPath } from "url";
import path from "path";
import mongoose from "mongoose";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const User = mongoose.model("User");

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new Strategy(options, async (payload, done) => {
  const user = await User.findOne({ _id: payload.sub });
  try {
    return done(null, user ? user : false);
  } catch (err) {
    done(err, null);
  }
});

export default (passport: any) => {
  passport.use(strategy);
};
