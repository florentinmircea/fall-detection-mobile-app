import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Constants from "expo-constants";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import Polyline from "@mapbox/polyline";
import getDirections from "react-native-google-maps-directions";
import { Ionicons } from "@expo/vector-icons";

export default function MapScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);

  const [test, setTest] = useState("initial");

  const getNearestHospitals = async (location) => {
    const url = `${"https://maps.googleapis.com/maps/api/place/nearbysearch/json"}?location=${
      location.coords.latitude
    },${
      location.coords.longitude
    }&type=point_of_interest&keyword=hospital&rankby=distance&key=${
      Constants.manifest.extra.mapsKey
    }`;

    const response = await axios.get(url);
    setTest(response.data.results.length);
    let hospitals = [];
    let j = 0;
    for (let i = 0; i < response.data.results.length; i++) {
      if (j == 5) {
        break;
      } else {
        hospitals.push({
          latitude: response.data.results[i].geometry.location.lat,
          longitude: response.data.results[i].geometry.location.lng,
          name: response.data.results[i].name,
          opened_now: response.data.results[i].opening_hours?.open_now,
          adresa: response.data.results[i].vicinity,
        });
        j++;
      }
    }
    setHospitals(hospitals);
  };

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      getNearestHospitals(location);
    }
  }, [location]);

  const handleGetDirections = () => {
    const data = {
      source: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      destination: {
        latitude: hospitals[0].latitude,
        longitude: hospitals[0].longitude,
      },
      params: [
        {
          key: "travelmode",
          value: "walking",
        },
        {
          key: "dir_action",
          value: "navigate",
        },
      ],
    };
    getDirections(data);
  };

  const getDrawDirections = async (startLoc, destinationLoc) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=walking&key=${Constants.manifest.extra.mapsKey}`;
      const response = await axios.get(url);
      let points = Polyline.decode(
        response.data.routes[0].overview_polyline.points
      );
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      const newCoords = [];
      newCoords.push({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      for (let i = 0; i < coords.length; i++) {
        newCoords.push({
          latitude: coords[i].latitude,
          longitude: coords[i].longitude,
        });
      }
      setCoords(newCoords);
      console.log(newCoords);
      return coords;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (location && hospitals.length !== 0) {
      let start = `${location.coords.latitude},${location.coords.longitude}`;
      let destination = `${hospitals[0].latitude},${hospitals[0].longitude}`;
      getDrawDirections(start, destination);
      console.log("draw");
    }
  }, [location, hospitals]);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={{ alignSelf: "stretch", height: "100%", width: "100%" }}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            key={0}
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            title="Current Location"
            pinColor="blue"
          />
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
          {coords.length !== 0 ? (
            <MapView.Polyline
              coordinates={coords}
              strokeWidth={4}
              strokeColor="rgba(255,140,0,0.8)"
            />
          ) : null}
        </MapView>
      ) : null}
      {errorMsg ? <Text style={styles.loadingText}>{errorMsg}</Text> : null}
      <AntDesign
        style={styles.close}
        name="closecircle"
        size={40}
        color="black"
        onPress={() => navigation.navigate("Home")}
      />
      <Ionicons
        style={styles.navigate}
        name="navigate-circle"
        size={50}
        color="black"
        onPress={handleGetDirections}
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
  navigate: {
    margin: 5,
    position: "absolute",
    top: 40,
    right: 10,
  },
  loadingText: {
    fontSize: 30,
  },
  aux: {
    position: "absolute",
    top: 100,
    left: 10,
  },
  aux2: {
    position: "absolute",
    top: 130,
    left: 10,
  },
});
