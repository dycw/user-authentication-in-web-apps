import crypto from "crypto";
import fs from "fs";
import { decryptWithPublicKey } from "./decrypt";

import receivedData from "./signMessage";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const hash = crypto.createHash(receivedData.algorithm);

const publicKey = fs.readFileSync(`${__dirname}/id_rsa_pub.pem`, "utf8");

const decryptedMessage = decryptWithPublicKey(
  publicKey,
  receivedData.signedAndEncryptedData,
);

const decryptedMessageHex = decryptedMessage.toString();

const hashOfOriginal = hash.update(JSON.stringify(receivedData.originalData));
const hashOfOriginalHex = hashOfOriginal.digest("hex");

if (hashOfOriginalHex === decryptedMessageHex) {
  console.log(
    "Success!  The data has not been tampered with and the sender is valid.",
  );
} else {
  console.log(
    "Uh oh... Someone is trying to manipulate the data or someone else is sending this!  Do not use!",
  );
}
