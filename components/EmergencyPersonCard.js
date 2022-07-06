import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
} from "react-native";
import CustomButton from "../components/SettingsButtonField";
import Modal from "../components/SettingsFieldModal";
import { useState } from "react";
import React, { useContext, useEffect } from "react";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { getDatabase, ref, set } from "firebase/database";
import Firebase from "../config/firebase";

export default function EmergencyPersonCard({ navigation, route }) {
  const { user } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    if (typeof route.params !== "undefined") {
      console.log("aici" + route.params.key);
      setEmergencyEmail(route.params.data.email);
      setEmergencyPhone(route.params.data.phone);
    }
  }, []);

  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [emergencyEmail, setEmergencyEmail] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const handleEmailClick = () => {
    setEmailModalVisible(true);
  };

  const handlePhoneClick = () => {
    setPhoneModalVisible(true);
  };

  const handleEmailModalClose = () => {
    setEmailModalVisible(!emailModalVisible);
  };

  const handlePhoneModalClose = () => {
    setPhoneModalVisible(!phoneModalVisible);
  };

  const onPressDelete = () => {
    try {
      Firebase.database()
        .ref("users/" + user.uid + "/contacts/" + route.params.key)
        .remove();
      Alert.alert("Success", "Successfully deleted", [
        { text: "OK", onPress: () => navigation.navigate("Settings") },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message, [{ text: "OK" }]);
    }
  };

  const onPress = () => {
    if (typeof route.params !== "undefined") {
      if (validateEmail(emergencyEmail) && emergencyPhone.length > 9) {
        try {
          Firebase.database()
            .ref("users/" + user.uid + "/contacts/" + route.params.key)
            .update({ email: emergencyEmail, phone: emergencyPhone });
          Alert.alert("Success", "Successfully updated", [
            { text: "OK", onPress: () => navigation.navigate("Settings") },
          ]);
        } catch (err) {
          Alert.alert("Error", err.message, [{ text: "OK" }]);
        }
      } else {
        Alert.alert("Wrong data", "Please check the provided data", [
          { text: "OK" },
        ]);
      }
    } else {
      if (validateEmail(emergencyEmail) && emergencyPhone.length > 9) {
        console.log(emergencyEmail + " " + emergencyPhone);
        try {
          Firebase.database()
            .ref("users/" + user.uid + "/contacts")
            .push({ email: emergencyEmail, phone: emergencyPhone });
          Alert.alert("Success", "Successfully inserted", [
            { text: "OK", onPress: () => navigation.navigate("Settings") },
          ]);
        } catch (err) {
          Alert.alert("Error", err.message, [{ text: "OK" }]);
        }
      } else {
        Alert.alert("Wrong data", "Please check the provided data", [
          { text: "OK" },
        ]);
      }
    }
  };

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <CustomButton
        onPress={handleEmailClick}
        title="Emergency email"
        data={emergencyEmail}
      />
      <CustomButton
        onPress={handlePhoneClick}
        title="Emergency phone number"
        data={emergencyPhone.slice(2, emergencyPhone.length)}
      />
      <Modal
        onRequestClose={handleEmailModalClose}
        title={"Enter emergency person email"}
        modalVisible={emailModalVisible}
        onPress={handleEmailModalClose}
        data={emergencyEmail}
        onChangeText={setEmergencyEmail}
        animationType={"fade"}
      />
      <Modal
        onRequestClose={handlePhoneModalClose}
        title={"Enter emergency person phone"}
        modalVisible={phoneModalVisible}
        onPress={handlePhoneModalClose}
        data={emergencyPhone}
        onChangeText={setEmergencyPhone}
        animationType={"fade"}
        phone={true}
      />
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{"Save"}</Text>
      </Pressable>
      {typeof route.params !== "undefined" ? (
        <Pressable style={styles.buttonDelete} onPress={onPressDelete}>
          <Text style={styles.text}>{"Delete"}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#003f5c",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  buttonDelete: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
