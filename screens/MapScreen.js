import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Constants from "expo-constants";
import axios from "axios";
import dummyHospitals from "../dummyHospitals.json";
import { AntDesign } from "@expo/vector-icons";

export default function MapScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setmapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      getNearestHospitals(location);
      // console.log(JSON.stringify(location));
    })();
  }, []);

  const getNearestHospitals = async (location) => {
    // const url = `${"https://maps.googleapis.com/maps/api/place/nearbysearch/json"}?location=${
    //   location.coords.latitude
    // },${
    //   location.coords.longitude
    // }&radius=1000&type=point_of_interest&keyword=hospital&key=${
    //   Constants.manifest.extra.mapsKey
    // }`;

    // console.log(url);

    // const response = await axios.get(url);
    // console.log(response.data);
    let hospitals = [];
    for (let i = 0; i < dummyHospitals.results.length; i++) {
      hospitals.push({
        latitude: dummyHospitals.results[i].geometry.location.lat,
        longitude: dummyHospitals.results[i].geometry.location.lng,
        name: dummyHospitals.results[i].name,
        opened_now: dummyHospitals.results[i].opening_hours?.open_now,
        adresa: dummyHospitals.results[i].vicinity,
      });
    }
    // console.log(hospitals);
    setHospitals(hospitals);
  };

  const [mapRegion, setmapRegion] = useState(null);
  return (
    <View style={styles.container}>
      {mapRegion !== null ? (
        <MapView
          style={{ alignSelf: "stretch", height: "100%" }}
          region={mapRegion}
        >
          <Marker
            key={0}
            coordinate={mapRegion}
            title="Current Location"
            pinColor="blue"
          />
          {console.log(hospitals.length)}
          {hospitals.length !== 0
            ? hospitals.map((item, index) => {
                return (
                  <Marker
                    key={index + 1}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                    title={item.name}
                    pinColor="red"
                    description={"Address:" + item.adresa}
                  />
                );
              })
            : null}
        </MapView>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      {errorMsg !== null ? (
        <Text style={styles.loadingText}>{errorMsg}</Text>
      ) : null}
      <AntDesign
        style={styles.close}
        name="closecircle"
        size={40}
        color="black"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  close: {
    margin: 5,
    position: "absolute",
    top: 50,
    left: 10,
  },
  loadingText: {
    fontSize: 30,
  },
});
