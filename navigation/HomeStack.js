import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MapScreen from "../screens/MapScreen";
import EmergencyPersonCard from "../components/EmergencyPersonCard";

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen
        name="EmergencyPersonCard"
        component={EmergencyPersonCard}
      />
    </Stack.Navigator>
  );
}
