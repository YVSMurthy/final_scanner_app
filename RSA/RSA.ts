import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import RSA from 'react-native-rsa-native';



// Generate RSA keys on component mount
// const generateKeys = async () => {
//     const rsa: any = RSA;
//     const keys = await rsa.generateKeys(2048); // Generate 2048-bit RSA keys
//     setPublicKey(keys.public); // Store the public key
//     setPrivateKey(keys.private); // Store the private key
//     console.log('Public Key:', keys.public);
//     console.log('Private Key:', keys.private);
// };

// generateKeys();

// Function to encrypt the message
// const encryptMessage = async (message: string) => {
//     if (publicKey) {
//         const rsa: any = RSA;
//         const encrypted = await rsa.encrypt(message, publicKey);
//         setEncryptedMessage(encrypted);
//         console.log('Encrypted:', encrypted);
//     }
// };

// Function to decrypt the message
const decryptMessage = async (encryptedMessage: string) => {
    console.log("start")
    const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIBUwIBADANBgkqhkiG9w0BAQEFAASCAT0wggE5AgEAAkEAiPL4OW9f32LaEE8G16nefDxr/g9JaDKeEiQvjJ3t4IS03XmVCjvw9Qxbp7v/4OGOwhEouruD7yMAaochx7jK0QIDAQABAkAE0NE7opsf50fTQuNZW8lHNZzqwDdc2sppSWZc2IqoAzCaI9OsMPO/UHjvzt1yfDmtoQ/J/Nkv9umCrInFCf5lAiEAzhXqMcOlMBL7gGWteUe5dcO/CBOGpjrU3dlfkeUoNN0CIQCqHlSjqfZgV9op8mzxCLBJLQcG3AA4YwTk6Tplq3tkhQIgFBMubQqR3Mz8ktVUwKur9TzMLw034Jl6guHZ3WxlLkECIBZwu89/Cw34aMHhxbch40cz1lp0SN8nSKz9iwOAVF2VAiBATECqk+j7YCGBrrD+NQtKuupu2fdM5Y6SCZ3KHWyHtg==
-----END RSA PRIVATE KEY-----`;
    const rsa: any = RSA;
    console.log("exctypted message ", encryptedMessage)
    const decrypted = await rsa.decrypt(encryptedMessage, privateKey);
    // setDecryptedMessage(decrypted);
    console.log("decryted message : ", decrypted)
    return decrypted;
    // console.log('Decrypted:', decrypted);
};


module.exports = {
    decryptMessage: decryptMessage
}