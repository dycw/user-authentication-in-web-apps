import crypto from "crypto";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import jsonwebtoken from "jsonwebtoken";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

export const genPassword = (password: string) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash,
  };
};

export const validPassword = (password: string, hash: string, salt: string) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
};

export const issueJWT = (user: any) => {
  const expiresIn = "1d";
  const payload = {
    sub: user._id,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn,
    algorithm: "RS256",
  });
  return {
    token: `Bearer ${signedToken}`,
    expires: expiresIn,
  };
};
