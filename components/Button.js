import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";

export default function Button(props) {
  const { onPress, title = "Save", data } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.textData}>{data}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    // alignItems: "center",
    // justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "grey",
    margin: 10,
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
