import crypto from "crypto";

export const encryptWithPublicKey = (publicKey: string, message: string) => {
  const bufferMessage = Buffer.from(message, "utf8");
  return crypto.publicEncrypt(publicKey, bufferMessage);
};

export const encryptWithPrivateKey = (privateKey: string, message: string) => {
  const bufferMessage = Buffer.from(message, "utf8");
  return crypto.privateEncrypt(privateKey, bufferMessage);
};
