import React, { useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import PhoneInput from "react-native-phone-input";

export default function Button(props) {
  const {
    onRequestClose,
    title = "Save",
    modalVisible,
    onPress,
    data,
    onChangeText,
    animationType,
    phone = false,
  } = props;
  const phoneInput = useRef(null);
  return (
    <View>
      <Modal
        animationType={animationType}
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
          <View style={styles.modalOverlay}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{title}</Text>
                {phone === true ? (
                  <PhoneInput
                    style={styles.phone}
                    ref={phoneInput}
                    initialValue={data}
                    initialCountry={"ro"}
                    layout="first"
                    withShadow
                    autoFocus
                    containerStyle={styles.phoneNumberView}
                    textContainerStyle={{ paddingVertical: 0 }}
                    onChangePhoneNumber={onChangeText}
                    textStyle={styles.phoneText}
                  />
                ) : (
                  <TextInput
                    autoFocus
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={data}
                  />
                )}
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={onPress}
                >
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    // justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
    height: 250,
  },
  input: {
    height: 40,
    width: 230,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    borderRadius: 50,
    padding: 10,
    elevation: 2,
    marginTop: 20,
    width: 200,
    height: 50,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    fontSize: 25,
    // marginBottom: 15,
    textAlign: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  phoneNumberView: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
  },
  phone: {
    marginTop: 20,
  },
  phoneText: {
    fontSize: 20,
  },
});
