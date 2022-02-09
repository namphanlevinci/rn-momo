import {
  Text,
  View,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import React, { Component } from 'react';
import RNMomosdk from 'react-native-momosdk';
import axios from "axios";


const EventEmitter = new NativeEventEmitter(NativeModules.RNMomosdk);

const merchantname = "levinci";
const merchantcode = "MOMOXPYV20220130";
const merchantNameLabel = "Levinci";
const billdescription = "thanh toan momo";
const amount = 50000;
const enviroment = "0"; //"0": SANBOX , "1": PRODUCTION

let jsonData = {};
jsonData.enviroment = "0"; //"0": SANBOX , "1": PRODUCTION
jsonData.action = "gettoken"; //DO NOT EDIT
jsonData.isDev = true;
jsonData.merchantname = merchantname; //edit your merchantname here
jsonData.merchantcode = merchantcode; //edit your merchantcode here
jsonData.partnerCode = merchantcode;
jsonData.merchantnamelabel = merchantNameLabel;
jsonData.description = billdescription;
jsonData.amount = 50000;//order total amount
jsonData.orderId = `OrderId test`;
jsonData.orderLabel = "Ma don hang";
jsonData.appScheme = "momoxpyv20220130";

const generateRandomNumber = () => {
  let foo = '';
  for (let i = 0; i < 19; ++i) foo += Math.floor(Math.random() * 10);
  return foo;
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jonData: {
        enviroment: "0",
        action: "gettoken",
        isDev: true,
        merchantname,
        merchantcode,
        partnerCode: merchantcode,
        merchantnamelabel: merchantNameLabel,
        description: billdescription,
        amount: amount,
        orderId: `OrderId_${generateRandomNumber()}`,
        orderLabel: "Ma don hang",
        appScheme: "momoxpyv20220130",
      },
      isLoading: false,
    }
  }

  // componentDidMount() {
  //   EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenReceived', (response) => {
  //     try {
  //       console.log("<MoMoPay>Listen.Event::" + JSON.stringify(response));
  //       if (response && response.status == 0) {
  //         //SUCCESS: continue to submit momoToken,phonenumber to server
  //         let fromapp = response.fromapp; //ALWAYS:: fromapp==momotransfer
  //         let momoToken = response.data;
  //         let phonenumber = response.phonenumber;
  //         let message = response.message;
  //       } else {
  //         //let message = response.message;
  //         //Has Error: show message here
  //       }
  //     } catch (ex) { }
  //   })
  //   EventEmitter.addListener('RCTMoMoNoficationCenterRequestTokenState', (response) => {
  //     console.log("<MoMoPay>Listen.RequestTokenState:: App is not installed or config LSApplicationQueriesSchemes failed");
  //     //response.status = 1: Parameters valid & ready to open MoMo app., 2: canOpenURL failed for URL MoMo app, 3: Parameters invalid
  //   })
  // }

  onPayment = async (appData, phoneNumber, version) => {
    this.setState({ isLoading: true })

    const data = {
      "partnerCode": merchantcode,
      "partnerRefId": `transactionId_levinci_${generateRandomNumber()}`,
      "amount": amount,
      "customerNumber": phoneNumber,
      "appData": appData,
      "description": billdescription,
      amount
    }

    try {
      console.log({ data })
      const response = await axios.post(`http://192.168.1.112:3001/momoPayment`, data);
      this.setState({ isLoading: false });

    } catch (error) {
      console.log({ error })
    }

    return;

  }

  onPress = async () => {
    if (Platform.OS === 'android') {
      let dataPayment = await RNMomosdk.requestPayment(jsonData);
      this.momoHandleResponse(dataPayment);
    } else {
      RNMomosdk.requestPayment(jsonData);
    }
  }

  async momoHandleResponse(response) {
    try {
      if (response && response.status == 0) {
        let momoToken = response.data;
        let phonenumber = response.phonenumber;
        const version = response.momoappversion;

        this.onPayment(momoToken, phonenumber, version);

      } else {

      }
    } catch (ex) { }
  }



  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

        <View style={{ flexDirection: "row" }}>
        <Text style={{ color: "white", fontSize: 17 }}>
            Mã đơn hàng
          </Text>
          <Text style={{ color: "white", fontSize: 17 }}>
            test payment momo
          </Text>
        </View>

        <TouchableOpacity onPress={this.onPress} style={styles.buttonPay}>
          <Text style={{ color: "white", fontSize: 17 }}>
            test payment momo
          </Text>
        </TouchableOpacity>

        {
          this.state.isLoading && <Loading />
        }
      </View>
    );
  }
}


const Loading = () => {
  return (
    <View style={styles.containerLoading}>
      <ActivityIndicator size={'large'} />
    </View>
  )
}

const styles = StyleSheet.create({
  containerLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonPay: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 10
  }
})