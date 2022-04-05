import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AddPersonButton(props) {
  const { onPress } = props;
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="person-add" size={24} color="black" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    display: "flex",
    paddingVertical: 12,
    // paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "grey",
    margin: 10,
    width: "20%",
    marginTop: "10%",
    alignItems: "center",
  },
});
