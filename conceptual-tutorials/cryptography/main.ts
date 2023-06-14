import fs from "fs";
import { encryptWithPublicKey } from "./encrypt";
import { decryptWithPrivateKey } from "./decrypt";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const publicKey = fs.readFileSync(`${__dirname}/id_rsa_pub.pem`, "utf8");

const encryptedMessage = encryptWithPublicKey(
  publicKey,
  "Super secret message",
);

console.log(`encryptedMessage.toString() = ${encryptedMessage.toString()}`);

const privateKey = fs.readFileSync(`${__dirname}/id_rsa_priv.pem`, "utf8");

const decryptedMessage = decryptWithPrivateKey(privateKey, encryptedMessage);

console.log(`decryptedMessage.toString() = ${decryptedMessage.toString()}`);
