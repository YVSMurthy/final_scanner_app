import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import RSA from 'react-native-rsa-native';

const [publicKey, setPublicKey] = useState<string | null>(null);
const [privateKey, setPrivateKey] = useState<string | null>(null);
const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);
const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

  // Generate RSA keys on component mount
const generateKeys = async () => {
    const rsa: any = RSA;
    const keys = await rsa.generateKeys(2048); // Generate 2048-bit RSA keys
    setPublicKey(keys.public); // Store the public key
    setPrivateKey(keys.private); // Store the private key
    console.log('Public Key:', keys.public);
    console.log('Private Key:', keys.private);
};

generateKeys();

// Function to encrypt the message
const encryptMessage = async (message: string) => {
    if (publicKey) {
        const rsa: any = RSA;
        const encrypted = await rsa.encrypt(message, publicKey);
        setEncryptedMessage(encrypted);
        console.log('Encrypted:', encrypted);
    }
};

// Function to decrypt the message
const decryptMessage = async (encryptedMessage: string) => {
    if (privateKey) {
        const rsa: any = RSA;
        const decrypted = await rsa.decrypt(encryptedMessage, privateKey);
        setDecryptedMessage(decrypted);
        console.log('Decrypted:', decrypted);
    }
};


module.exports = {
    encryptMessage: encryptMessage,
    decryptMessage: decryptMessage
}