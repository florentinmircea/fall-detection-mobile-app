import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
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
import background from "./assets/background.jpg";
import { Accelerometer, Gyroscope } from "expo-sensors";

const image = background;

export default function App() {
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

  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);
  const [timer,setTimer] = useState();
  const [timerStarted, setTimerStarted] = useState(false);
  const [counter, setCounter] = useState(0);
  let t;
  const [fallDetected, setFallDetected] = useState(false);
  const [userOK, setUserOK] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleClick = () => {
    if (serviceStarted === false) {
      _subscribeAccelerometer();
      _subscribe();
      _fastAccelerometer();
      _fast();
      t = setInterval(() => tick(), 100);
    } else {
      _unsubscribeAccelerometer();
      _unsubscribe();
    }
    setServiceStarted(!serviceStarted);
  };

  const _slowAccelerometer = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fastAccelerometer = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const tick = () => {
    setCounter(x => x + 1);
  }

//   useEffect(() => {
//     let timer = setInterval(() => console.log('fire!'), 1000);

//     return () => clearInterval(timer)
// }, [])

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

  const _slow = () => {
    Gyroscope.setUpdateInterval(1000);
  };

  const _fast = () => {
    Gyroscope.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const { x: xg, y: yg, z: zg } = data;

  function round(n) {
    if (!n) {
      return 0;
    }
    return Math.floor(n * 100) / 100;
  }

  useEffect(()=>{
    const { x, y, z } = dataAccelerometer;
        let v = Math.abs(Math.sqrt(x*x+y*y+z*z));
        if(v>acceleration_threshold)
        {
          console.log(v)
          setResultant_acc_vector(v);
          setTimerStarted(true);
          setCounter(0);
        }
        if(v < acceleration_threshold && counter >=25 && resultant_acc_vector > acceleration_threshold)
        {
          setFallDetected(true);
          setModalVisible(true);
          console.log(v.toString()+" fall detected")
          
          // setTimeout(() => {
          //   if(v<=acceleration_threshold)
          //   {
              
          //   }
          // }, 2500);
        }
  },[dataAccelerometer])

  useEffect(()=>{
    if(fallDetected === true && userOK === true)
    {
      setUserOK(false);
      setFallDetected(false);
      setCounter(0);
      setResultant_acc_vector(0);
      setModalVisible(false);
    }
  },[fallDetected,userOK])

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
      <Text style={styles.text}>
            Timer {counter}
          </Text>
        {serviceStarted === true ? (
          <Text style={styles.text}>
            Accelerometer x: {round(x)} y: {round(y)} z: {round(z)}
          </Text>
        ) : null}
        {serviceStarted === true ? (
          <Text style={styles.text}>
            Gyroscope x: {round(xg)} y: {round(yg)} z: {round(zg)}
          </Text>
        ) : null}
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
        <TouchableOpacity onPress={handleClick} style={styles.buttonSettings}>
          <Text style={styles.buttonText}>Settings</Text>
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
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 500
  },
  button: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    width: 200,
    height: 70
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    marginTop: 15,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    fontSize: 40,
    marginBottom: 15,
    textAlign: "center"
  },
});
