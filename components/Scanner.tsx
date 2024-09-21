import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NfcManager, { NfcTech, NfcEvents, Ndef } from 'react-native-nfc-manager';
import { socket } from '../socket/socket';
const {decryptMessage} = require('../RSA/RSA')
const {playAudio} = require('../SoundResponse/SoundResponse')

interface CartItem {
  id: string,
  hash: string
}

NfcManager.start();

function Scanner() {
  const [nfcSupported, setNfcSupported] = useState<boolean>(false);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(false);
  const [tag, setTag] = useState<string|undefined>("");
  const [scan, setScan] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([{id: '13', hash: '34'}]);
  const [buzzer, setBuzzer] = useState<boolean>(false);

  useEffect(() => {
    if (!socket.connected) {
      console.log("Not connected to the server");
    }
    else {
      socket.on('item_scanned', (current_cart: CartItem[]) => {
        setCart(current_cart);
      })
    }
  }, [])

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
            messageString = messageString.slice(3,messageString.length); 
            const message = JSON.parse(messageString);
            setTag(message.id)
            setBuzzer(true);
            verifyItem(message.product_id);
            setTag("");
          }

        }
        
    } catch (ex: any) {
      // console.warn('Oops!', ex);
      // Alert.alert('Error reading NFC tag', ex.message);
      console.log("scan closed, click again to start")
    }
    finally {
      await NfcManager.cancelTechnologyRequest();
    }
  }

  function verifyItem(product_id: string) {
    let present = false;
    console.log(product_id)
    cart.forEach((item) => {
      console.log(product_id + " " + item.id)
      if (item.id == product_id) {
        // const encryptedMessage = product_id+item.hash;

        // const decryptedMessage = decryptMessage(encryptedMessage);

        // if (decryptedMessage.slice(-20) == '00000000000000000000') {
        //   setBuzzer(false);
        // }

        setBuzzer(false);
        present = true;

        setCart((prevCart) => prevCart.filter(matched => matched.id != product_id ));

        return;
      }
    })

    // playAudio(buzzer)
    console.log("Present " + present)
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
        Ndef.textRecord(JSON.stringify({ "product_id": "13" })) // Convert object to string
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