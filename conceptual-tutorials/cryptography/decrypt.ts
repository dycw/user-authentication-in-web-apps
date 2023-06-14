import crypto from "crypto";

export const decryptWithPrivateKey = (
  privateKey: string,
  encryptedMessage: Buffer,
) => {
  return crypto.privateDecrypt(privateKey, encryptedMessage);
};

export const decryptWithPublicKey = (
  publicKey: string,
  encryptedMessage: Buffer,
) => {
  return crypto.publicDecrypt(publicKey, encryptedMessage);
};
