import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import RSA from 'react-native-rsa-native';

const [publicKey, setPublicKey] = useState<string | null>(null);
const [privateKey, setPrivateKey] = useState<string | null>("MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDwu3/IfPqs+fbSucNRiU5Jw+MQSn+s+5M2ZAdo1Zg/4nV+9IfxjDGmhH5hGa7u5ZYAAEeXDOZJJ7wzhiGy77fDYF8Vt6J+jSQigIr6/1/AQ4kX8wbjc8d1OTN637jN0T5ROH7uD1gCSbSi0dtJTxUOVP/IpdNnKOwo2uhK+tArwA8vtXLdsHZiUggYfHF4vZ5Rp0tKJ6ewCFokUOFhCSWtlqVXO9diHKkWQTUx6oM4R1NkxQicYQSS5J7mPe5RK6xFQu61vStHt5Dn96S4Uh6nm2X55PmXEDY3JXMJNZM5RzV/82Qkib949qtFNkk9IGmORh7WkRaLCXpllvxhhY8pAgMBAAECggEAMvkwzI4SMlBXgDVPc1NknV/6E3gC4uj+OfUiUINx0o0sHe6/Xlk2JjFF5V+f1/wLMALfJc/Yb0MXqb1MI2x498jPOXUB1lQig5++TfmHF9n1DHosSjs4z8yF5w26PvKAhIg28EeVdh6PPi67hSFWrws2ghEC24QhxWDc8Qt8ytZd/s4yOVYb5Lzn/9i2I1iwDfJ0bMJlhMF1kaxLR3TdeNMj9Ug8GfJXONSWMcBO36Wk3fhykdXfK0L1dzPLfOhOn5vkpgTviSwlVDECmPskYPJLC4zvFs9aoX0lxCFPkgvbMc9rUhFMpcnKuMjt9Ro7Qvb+oZQif5ePDy41+K851QKBgQD29LDytPw/QlN8bvWZM8NlQoQHG8JrGCDfW3CzjQr0oRUaNo95qskSfQzxQnF68TT8xMCEdnjh2HxtDQWIRJjb7M8qv1N/c3k7B9SJFNNRH8pzZR0rNC8TQAJoNI2Bm3G1p5Fc5f+NONdux7mON+ud9zJPUFU2zYmAWY6DyWAYiwKBgQD5jHYHHPvFI471r6zY+Cn+yg9RQbtmtPW72PuvgJHBvZfxbmijHQVijdgGpUjyJB85UZJjYSvgOK4GTwqip9V5cIRdHiN3lTtRt/Ob2djp5s9XwHJhkUR4RVdWS6Syyc4+tlXeaQzw6CLqm7YNdoJTGp+1K5qs/tKONL4MxNd5mwKBgG4m1oZrk9fjjbmDBKlBHXadJKbHCwEZ0g/OiYaM8sYK047Np1FtjCJjBNLYACYGUMwuNnDfJywVk+pQVJdjgYsXJZC7plLC/uAFrhc24srck0DFaS1MKXM8qdYxGq0k2KNeCsiVDle/cthG3c1BxCbBi/80pc28AAjv6VF/EQ3hAoGBAOYxoXZyT/TMFkWgJcuHMAXuEi8ceWgGqV78iz6bVNjosU5uUGuWi68btRh8Q0vJ8luHWYf+zOBqqGz9YIwmUY9SMWdMM99Nc4iwLTGoxKUO2ljSFzDVNdnT7PqXkHe0HGJRA+jD8sIPAJZ1yHumxBUwy/3tGSNXdJblJCLXOQTdAoGBALWqKOcuo0M9dgzKeaI49OSbcOpLtoT/rDjRo6IQwwKaFGWaTAY6MvAzV0Nu7eEZgMUaHLkEgnMTjv5hQAMd0RqTdrUF5TaLdraCiOvgH85HatDWrH9D5Kucoixuant1R8gpwTzHLFJJ92hqdY3OWf3iZko9jumIaT8CehJ6v/Ls");
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