import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NfcManager, { NfcTech, NfcEvents, Ndef } from 'react-native-nfc-manager';
import TcpSocket from 'react-native-tcp-socket';
const { decryptMessage } = require('../RSA/RSA')
const { playAudio } = require('../SoundResponse/SoundResponse')

interface CartItem {
  product_id: string,
  verification_hash: string
}

interface Message {
  key: string;
}

NfcManager.start();

function Scanner() {
  const [nfcSupported, setNfcSupported] = useState<boolean>(false);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(false);
  const [tag, setTag] = useState<string | undefined>("");
  const [scan, setScan] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<TcpSocket.Socket | null>(null);

  useEffect(() => {
    const tcpClient = TcpSocket.createConnection({ port: 8080, host: '192.168.28.149' }, () => {
      console.log('Connected to server');
    });

    tcpClient.on('data', (data) => {
      console.log(data.toString())
      const curr_cart: any[] = JSON.parse(data.toString());
      console.log('Received from server: ', curr_cart);
      console.log(typeof curr_cart); // Should be 'object' for an array

      // Use functional state update to ensure correct updates
      setCart(curr_cart);
    },[]);

    // Set the client to state
    setClient(tcpClient);

    // Cleanup on unmount
    return () => {
      tcpClient.destroy();
    };
  }, []);

  useEffect(() => {
    setTag("");
  }, [])

  useEffect(() => {
    checkNfcSupport();

    // Set up event listeners for NFC events
    const handleStateChange = (event: any) => {
      if (event.state === 'off') {
        Alert.alert('NFC is turned off');
      }
    };

    NfcManager.setEventListener(NfcEvents.StateChanged, handleStateChange);

    return () => {
      // Clean up the NFC state change event listener
      NfcManager.setEventListener(NfcEvents.StateChanged, null);
    };



  }, []);

  const checkNfcSupport = async () => {
    const supported = await NfcManager.isSupported();
    setNfcSupported(supported);

    if (supported) {
      const enabled = await NfcManager.isEnabled();
      setNfcEnabled(enabled);
    } else {
      Alert.alert('NFC is not supported on this device');
    }
  };


  async function readNdef() {
    setScan(true)
    if (!nfcEnabled) {
      Alert.alert('NFC is not enabled. Please enable it in settings.');
      return;
    }

    try {
      while (scan == true) {
        // Request NFC technology
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tagDetails = await NfcManager.getTag();
        await NfcManager.cancelTechnologyRequest();

        // if tag detected
        if (tagDetails) {
          const firstRecord = tagDetails.ndefMessage[0];
          const byteArray = firstRecord.payload;
          let messageString = String.fromCharCode(...byteArray);
          messageString = messageString.slice(3, messageString.length);
          const message = JSON.parse(messageString);
          setTag(message.id)
          if (verifyItem(message.product_id) == true) {
            console.log("present")
            playAudio(true)
          }
          else {
            console.log("not present")
            playAudio(false)
          }
          setTag("");
          setCart([])
        }

      }

    } catch (ex: any) {
      // console.warn('Oops!', ex);
      // Alert.alert('Error reading NFC tag', ex.message);
      console.log(ex)
    }
    finally {
      await NfcManager.cancelTechnologyRequest();
    }
  }

   function verifyItem(product_id: string) {
    console.log("vrify cart : ",cart)
    let present = false;
    console.log(product_id)
    cart.forEach(async (item) => {
      console.log(product_id + " " + item.product_id)
      if (item.product_id.toString() == product_id.toString()) {
        // const encryptedMessage = product_id+item.verification_hash;
        console.log('equal')
        // console.log(encryptedMessage)
        // const decryptedMessage = await decryptMessage(encryptedMessage);

        // if (decryptMessage) {
        //   console.log("yes")
        // }
        // console.log("decrypted message", decryptedMessage)

        // if (decryptedMessage.slice(-10) == '0000000000') {
        //   present = true;
        // }

        present = true

        // setCart((prevCart) => prevCart.filter(matched => matched.product_id != product_id ));
      }
    })

    return present;
  }

  function stopScan() {
    setScan(false)
    setTag("")
  }

  async function writeNdef() {
    if (!nfcEnabled) {
      Alert.alert('NFC is not enabled. Please enable it in settings.');
      return;
    }

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Create NDEF message using Ndef helper
      const ndefMessage = [
        Ndef.textRecord(JSON.stringify({ "product_id": "g53z+KWhvsX5ZzYOjWArw78vyAcDFqrqg8O2dtbZqV6e" })) // Convert object to string
      ];

      const bytes = Ndef.encodeMessage(ndefMessage); // Use Ndef to encode the message

      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      Alert.alert('NDEF message written successfully!');
    } catch (ex: any) {
      console.warn('Error writing NDEF message:', ex);
      Alert.alert('Error writing NDEF message', ex.message);
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      {nfcSupported ? (
        <>
          <Text>NFC Supported: {nfcEnabled ? 'Yes' : 'No, please enable NFC'}</Text>
          <TouchableOpacity onPress={readNdef}>
            <Text>Start Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={writeNdef}>
            <Text>Write Tag</Text>
          </TouchableOpacity>
          <Text>Tag id : {tag}</Text>
          <TouchableOpacity onPress={stopScan}>
            <Text>Stop Scan</Text>
          </TouchableOpacity>
          {/* <Text>Tag Message : {tagMessage}</Text> */}
        </>
      ) : (
        <Text>NFC is not supported on this device</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
});

export default Scanner;