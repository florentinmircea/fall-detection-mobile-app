import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, View, Text } from "react-native";
import background from "../assets/background.jpg";
import Button from "../components/SettingsButtonField";
import Modal from "../components/SettingsFieldModal";
import { useState } from "react";
import PersonCard from "../components/PersonCard";
import Buttontwo from "../components/Buttontwo";
import AddPersonButton from "../components/AddPersonButton";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import Firebase from "../config/firebase";
import React, { useContext, useEffect } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { IconButton } from "../components";

const auth = Firebase.auth();

const image = background;

export default function SettingsScreen({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [userName, setUserName] = useState("Flo");
  const [emergencyEmail, setEmergencyEmail] = useState("email@gmail.com");
  const [emergencyPhone, setEmergencyPhone] = useState("+40752275966");
  const [fallsNr, setFallsNr] = useState(0);

  const handleNameClick = () => {
    setNameModalVisible(true);
  };

  const handleEmailClick = () => {
    setEmailModalVisible(true);
  };

  const handlePhoneClick = (data, key) => {
    // setPhoneModalVisible(true);
    // console.log("data" + data.email);
    navigation.navigate("EmergencyPersonCard", { data: data, key: key });
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

  const [itemsArray, setItemsArray] = useState([]);
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    try {
      let keyArr = [];
      Firebase.database()
        .ref("users/" + user.uid + "/contacts")
        .on("value", (snapshot) => {
          snapshot.forEach(function (snapshot3) {
            console.log(snapshot3.key); // e.g. "-Kb9...gkE"
            keyArr.push(snapshot3.key);
          });
        });
      setKeys(keyArr);
    } catch (err) {
      console.log(err.message);
    }
    try {
      Firebase.database()
        .ref("users/" + user.uid + "/contacts")
        .on("value", (snapshot) => {
          let data = snapshot.val();
          // console.log(snapshot.key);
          if (data !== null) {
            const items = Object.values(data);
            setItemsArray(items);
          }
        });
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    let fallNr;
    try {
      Firebase.database()
        .ref("users/" + user.uid + "/fallNr")
        .on("value", (snapshot) => {
          fallNr = snapshot.val();
        });
      if (typeof fallNr !== "undefined") {
        setFallsNr(fallNr);
      }
    } catch (err) {
      console.log(err.message);
    }
  }, [itemsArray]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {console.log(keys)}
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.container2}>
          <IconButton
            name="logout"
            size={24}
            color="#fff"
            onPress={handleSignOut}
          />

          <AddPersonButton
            disabled={itemsArray.length > 2}
            onPress={handleNewContact}
          />
        </View>
        {/* <Button
          onPress={handleNameClick}
          title="Your emergency display name"
          data={userName}
        /> */}
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
          {itemsArray.map((item, index) => {
            return (
              <Buttontwo
                onPress={handlePhoneClick.bind(this, item, keys[index])}
                title="Emergency person phone number"
                data={item}
                key={index}
              />
            );
          })}
          {/* <Buttontwo
            onPress={handlePhoneClick}
            title="Emergency person phone number"
            data={emergencyPhone.slice(2, emergencyPhone.length)}
          />
          <Buttontwo
            onPress={handlePhoneClick}
            title="Emergency person phone number"
            data={emergencyPhone.slice(2, emergencyPhone.length)}
          /> */}
          <Text style={styles.text}>{"Falls detected:" + fallsNr}</Text>
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
  container2: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  container3: { flex: 0.5, alignItems: "center" },
  image: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  text: {
    fontSize: 20,
    paddingTop: 40,
  },
});
