import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Buttontwo(props) {
  const { onPress, title = "Save", data } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="person" size={50} color="black" />
      {/* <Text style={styles.text}>{title}</Text>
      <Text style={styles.textData}>{data}</Text> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "grey",
    margin: 10,
    width: "50%",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  textData: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
  },
});
