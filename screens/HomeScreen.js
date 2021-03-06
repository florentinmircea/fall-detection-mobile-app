import React, { useContext } from "react";

import Firebase from "../config/firebase";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import background from "../assets/background.jpg";
import { Accelerometer } from "expo-sensors";
import axios from "axios";
import { Audio } from "expo-av";
import useCountDown from "react-countdown-hook";
import * as Location from "expo-location";

const auth = Firebase.auth();

const image = background;

const initialTimeBeforeAlert = 30 * 1000;
const timeUnitInterval = 1000;

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    initialTimeBeforeAlert,
    timeUnitInterval
  );

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      if (timeLeft <= 0) {
        sendMessages();
        reset();
      }
    } else {
      didMount.current = true;
    }
  }, [timeLeft]);

  const updateFallNumbers = () => {
    let fallNr;
    try {
      Firebase.database()
        .ref("users/" + user.uid + "/fallNr")
        .on("value", (snapshot) => {
          fallNr = snapshot.val();
        });
      if (typeof fallNr === "undefined") {
        Firebase.database()
          .ref("users/" + user.uid)
          .child("fallNr")
          .set(1);
      } else {
        Firebase.database()
          .ref("users/" + user.uid)
          .child("fallNr")
          .set(Number(fallNr) + 1);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const sendMessages = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let contacts = [];
    let phoneNr = [];
    try {
      Firebase.database()
        .ref("users/" + user.uid + "/contacts")
        .on("value", (snapshot) => {
          let data = snapshot.val();
          if (data !== null) {
            const items = Object.values(data);
            contacts = items;
          }
        });
    } catch (err) {
      console.log(err.message);
    }
    console.log(contacts);
    for (let i = 0; i < contacts.length; i++) {
      phoneNr.push(contacts[i].phone);
    }
    if (phoneNr.length === 1) {
      phoneNr.push(phoneNr[0]);
    }
    const body = {
      userName: user.email,
      phoneNumbers: phoneNr,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    console.log(body);
    try {
      const response = await axios.post(
        "http://192.168.0.148:3001/sendMessage",
        body
      );
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const [serviceStarted, setServiceStarted] = useState(false);

  const [resultant_acc_vector, setResultant_acc_vector] = useState(0);
  const acceleration_threshold = 3;

  const [dataAccelerometer, setDataAccelerometer] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscriptionAccelerometer, setSubscriptionAccelerometer] =
    useState(null);

  const [counter, setCounter] = useState(0);
  let t;
  const [fallDetected, setFallDetected] = useState(false);
  const [userOK, setUserOK] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [predictionResults, setPredictionResults] = useState([]);
  const [xyzData, setXyzData] = useState([]);
  const [done, setDone] = useState(false);

  const [ok, setOK] = useState(null);

  const webServiceUrl =
    "https://ussouthcentral.services.azureml.net/workspaces/74deb8d5935745aea0b3101bc2519aa7/services/d10d5c59720c43dcb9765f4c364375b8/execute?api-version=2.0&details=true";

  const eventPrediction = async (xyz) => {
    const token =
      "QNKvXi9Un4lGvoYcXvB+ywUFwpKWcUud3Z00QpODODZHwp22fckbhCxedpgFF0T/F5czC1P5/DWp+U1fprPpoA==";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const body = {
      Inputs: {
        input1: {
          ColumnNames: ["xAxis", "yAxis", "zAxis"],
          Values: [],
        },
      },
      GlobalParameters: {},
    };
    for (let i = 0; i < xyz.length; i++) {
      body.Inputs.input1.Values.push(xyz[i]);
    }
    const response = await axios.post(webServiceUrl, body, config);
    let results = [];
    for (
      let i = 0;
      i < response.data.Results.output1.value.Values.length;
      i++
    ) {
      let current = response.data.Results.output1.value.Values[i];
      results.push(current);
    }
    if (results.length !== 0) {
      setPredictionResults(results);
    }
  };

  const handleClick = () => {
    if (ok === true) {
      if (serviceStarted === false) {
        _subscribeAccelerometer();
        _fastAccelerometer();
        t = setInterval(() => tick(), 100);
      } else {
        _unsubscribeAccelerometer();
      }
      setServiceStarted(!serviceStarted);
    } else {
      Alert.alert("Please enter at least one emergency contact in settings");
    }
  };

  const _fastAccelerometer = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const tick = () => {
    setCounter((x) => x + 1);
  };

  const _subscribeAccelerometer = () => {
    setSubscriptionAccelerometer(
      Accelerometer.addListener((accelerometerData) => {
        setDataAccelerometer(accelerometerData);
      })
    );
  };

  const _unsubscribeAccelerometer = () => {
    subscriptionAccelerometer && subscriptionAccelerometer.remove();
    setSubscriptionAccelerometer(null);
  };

  const { x, y, z } = dataAccelerometer;

  useEffect(() => {
    try {
      Firebase.database()
        .ref("users/" + user.uid + "/contacts")
        .on("value", (snapshot) => {
          let data = snapshot.val();
          if (data !== null) {
            setOK(true);
          } else {
            setOK(false);
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    const { x, y, z } = dataAccelerometer;
    let v = Math.abs(Math.sqrt(x * x + y * y + z * z));
    if (v > acceleration_threshold) {
      console.log(v);
      xyzData.push([x.toString(), y.toString(), z.toString()]);
      setResultant_acc_vector(v);
      setCounter(0);
    }
    if (
      v < acceleration_threshold &&
      counter >= 25 &&
      resultant_acc_vector > acceleration_threshold &&
      done === false
    ) {
      xyzData.push([x.toString(), y.toString(), z.toString()]);
      setDone(true);
      console.log(xyzData);
      eventPrediction(xyzData);
      setXyzData([]);
    }
  }, [dataAccelerometer]);

  useEffect(() => {
    if (fallDetected === true && userOK === true) {
      setUserOK(false);
      setFallDetected(false);
      setCounter(0);
      setResultant_acc_vector(0);
      setModalVisible(false);
      setPredictionResults([]);
      reset();
      setDone(false);
      return sound
        ? () => {
            console.log("Unloading Sound");
            sound.unloadAsync();
          }
        : undefined;
    }
  }, [fallDetected, userOK]);

  useEffect(() => {
    for (let i = 0; i < predictionResults.length; i++) {
      console.log(predictionResults[i][1]);
      if (predictionResults[i][1] > 0.6) {
        setFallDetected(true);
        setModalVisible(true);
        playSound();
        start();
        updateFallNumbers();
      }
    }
  }, [predictionResults]);

  const [sound, setSound] = useState();

  async function playSound() {
    console.log("Loading Sound");
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/alarm.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  const showHospitals = () => {
    sendMessages();
    setModalVisible(false);
    reset();
    navigation.navigate("Map");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <TouchableOpacity
          onPress={handleClick}
          style={
            serviceStarted === false ? styles.buttonStart : styles.buttonStop
          }
        >
          <Text style={styles.buttonText}>
            {serviceStarted === false ? "Start service" : "Stop service"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSettings}
          onPressIn={() => navigation.navigate("Settings")}
        >
          <Text style={styles.buttonText}>Settings ??????</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSettings}
          onPressIn={() => navigation.navigate("Map")}
        >
          <Text style={styles.buttonText}>Map ???????</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Fall detected!</Text>
              <Text style={styles.textEmergency}>{timeLeft / 1000}</Text>
              <Pressable
                style={[styles.button, styles.buttonMap]}
                onPress={showHospitals.bind(this)}
              >
                <Text style={styles.textStyle}>Show Hospitals</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setUserOK(true)}
              >
                <Text style={styles.textStyle}>I'm OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonStart: {
    backgroundColor: "green",
    padding: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonStop: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 5,
    alignSelf: "center",
    width: 150,
  },
  buttonSettings: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
    alignSelf: "center",
    width: 150,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 500,
  },
  button: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    width: 200,
    height: 70,
  },
  buttonClose: {
    backgroundColor: "green",
    borderColor: "#000000",
    borderWidth: 2,
  },
  buttonMap: {
    backgroundColor: "red",
    borderColor: "#000000",
    borderWidth: 2,
  },
  textStyle: {
    marginTop: 15,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    fontSize: 40,
    marginBottom: 15,
    textAlign: "center",
  },
  textEmergency: {
    fontSize: 40,
    color: "red",
    marginLeft: 7,
  },
});
