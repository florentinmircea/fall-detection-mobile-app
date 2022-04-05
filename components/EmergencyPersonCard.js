import { StatusBar } from "expo-status-bar";
import {
  ImageBackground,
  StyleSheet,
  View,
  Pressable,
  Text,
} from "react-native";
import background from "../assets/background.jpg";
import CustomButton from "../components/SettingsButtonField";
import Modal from "../components/SettingsFieldModal";
import { useState } from "react";

export default function EmergencyPersonCard() {
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

  const onPress = () => {
    console.log("ceva");
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
