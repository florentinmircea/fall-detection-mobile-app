import { StatusBar } from "expo-status-bar";
import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

import { Button, InputField, ErrorMessage } from "../components";
import Firebase from "../config/firebase";

const auth = Firebase.auth();

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [resetLinkError, setResetLinkError] = useState("");

  const onSendResetLink = async () => {
    setResetLinkError(false);
    try {
      if (email !== "") {
        await auth.sendPasswordResetEmail(email);
        Alert.alert("Reset password link sent");
        navigation.navigate("Login");
      }
    } catch (error) {
      setResetLinkError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark-content" />
      <Text style={styles.title}>Reset Password</Text>
      <InputField
        inputStyle={{
          fontSize: 14,
        }}
        containerStyle={{
          backgroundColor: "#fff",
          marginBottom: 20,
          borderRadius: 20,
        }}
        leftIcon="email"
        placeholder="Enter email"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {resetLinkError ? (
        <ErrorMessage error={resetLinkError} visible={true} />
      ) : null}
      <Button
        onPress={onSendResetLink}
        backgroundColor="#fb5b5a"
        title="Reset password"
        tileColor="#fff"
        titleSize={20}
        containerStyle={{
          marginBottom: 24,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003f5c",
    paddingTop: 40,
    paddingHorizontal: 12,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    alignSelf: "center",
    paddingBottom: 24,
  },
});
