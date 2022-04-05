import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, View } from "react-native";
import background from "../assets/background.jpg";
import Button from "../components/SettingsButtonField";
import Modal from "../components/SettingsFieldModal";
import { useState } from "react";
import PersonCard from "../components/PersonCard";
import Buttontwo from "../components/Buttontwo";
import AddPersonButton from "../components/AddPersonButton";

const image = background;

export default function SettingsScreen({ navigation }) {
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [userName, setUserName] = useState("Flo");
  const [emergencyEmail, setEmergencyEmail] = useState("email@gmail.com");
  const [emergencyPhone, setEmergencyPhone] = useState("+40752275966");

  const handleNameClick = () => {
    setNameModalVisible(true);
  };

  const handleEmailClick = () => {
    setEmailModalVisible(true);
  };

  const handlePhoneClick = () => {
    setPhoneModalVisible(true);
  };

  const handleNameModalClose = () => {
    setNameModalVisible(!nameModalVisible);
  };

  const handleEmailModalClose = () => {
    setEmailModalVisible(!emailModalVisible);
  };

  const handlePhoneModalClose = () => {
    setPhoneModalVisible(!phoneModalVisible);
  };

  const handleNewContact = () => {
    navigation.navigate("EmergencyPersonCard");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.container2}>
          <AddPersonButton onPress={handleNewContact} />
        </View>
        <Button
          onPress={handleNameClick}
          title="Your emergency display name"
          data={userName}
        />
        {/* <Button
          onPress={handleEmailClick}
          title="Emergency person email"
          data={emergencyEmail}
        />
        <Button
          onPress={handlePhoneClick}
          title="Emergency person phone number"
          data={emergencyPhone.slice(2, emergencyPhone.length)}
        />  */}
        {/* <PersonCard /> */}
        <View style={styles.container3}>
          <Buttontwo
            onPress={handlePhoneClick}
            title="Emergency person phone number"
            data={emergencyPhone.slice(2, emergencyPhone.length)}
          />
        </View>

        <Modal
          onRequestClose={handleNameModalClose}
          title={"Enter your username"}
          modalVisible={nameModalVisible}
          onPress={handleNameModalClose}
          data={userName}
          onChangeText={setUserName}
          animationType={"fade"}
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: { alignItems: "flex-end" },
  container3: { flex: 0.5, justifyContent: "center", alignItems: "center" },
  image: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
});
