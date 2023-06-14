import crypto from "crypto";
import fs from "fs";
import { encryptWithPrivateKey } from "./encrypt";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const myData = {
  firstName: "Zach",
  lastName: "Gollwitzer",
  socialSecurityNumber:
    "NO NO NO.  Never put personal info in a digitally \
  signed message since this form of cryptography does not hide the data!",
};

const myDataString = JSON.stringify(myData);

const hash = crypto.createHash("sha256");
hash.update(myDataString);

const hashedData = hash.digest("hex");

const senderPrivateKey = fs.readFileSync(
  `${__dirname}/id_rsa_priv.pem`,
  "utf8",
);

const signedMessage = encryptWithPrivateKey(senderPrivateKey, hashedData);

const packageOfDataToSend = {
  algorithm: "sha256",
  originalData: myData,
  signedAndEncryptedData: signedMessage,
};

export default packageOfDataToSend;
