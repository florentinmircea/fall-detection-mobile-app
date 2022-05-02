import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import Constants from "expo-constants";
import axios from "axios";
// import dummyHospitals from "../dummyHospitals.json";
import { AntDesign } from "@expo/vector-icons";

export default function MapScreen({ navigation }) {
  const [mapRegion, setmapRegion] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  // const [location, setLocation] = useState(null);
  // const [errorMsg, setErrorMsg] = useState(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }

  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //     setmapRegion({
  //       latitude: location.coords.latitude,
  //       longitude: location.coords.longitude,
  //       latitudeDelta: 0.0922,
  //       longitudeDelta: 0.0421,
  //     });
  //     getNearestHospitals(location);
  //     // console.log(JSON.stringify(location));
  //   })();
  // }, []);

  const [test, setTest] = useState("initial");

  const getNearestHospitals = async (location) => {
    const url = `${"https://maps.googleapis.com/maps/api/place/nearbysearch/json"}?location=${
      location.coords.latitude
    },${
      location.coords.longitude
    }&radius=10000&type=point_of_interest&keyword=hospital&key=${
      Constants.manifest.extra.mapsKey
    }`;

    console.log(url);
    console.log(url);

    const response = await axios.get(url);
    console.log(response.data);
    setTest(response.data.results.length);
    let hospitals = [];
    for (let i = 0; i < response.data.results.length; i++) {
      hospitals.push({
        latitude: response.data.results[i].geometry.location.lat,
        longitude: response.data.results[i].geometry.location.lng,
        name: response.data.results[i].name,
        opened_now: response.data.results[i].opening_hours?.open_now,
        adresa: response.data.results[i].vicinity,
      });
    }
    // console.log(hospitals);
    setHospitals(hospitals);
  };

  // return (
  //   <View style={styles.container}>
  //     {mapRegion !== null ? (
  //       <MapView
  //         style={{ alignSelf: "stretch", height: "100%", width: "100%" }}
  //         region={mapRegion}
  // provider={PROVIDER_GOOGLE}
  //       >
  //         <Marker
  //           key={0}
  //           coordinate={mapRegion}
  //           title="Current Location"
  //           pinColor="blue"
  //         />
  //         {console.log(hospitals.length)}
  //         {hospitals.length !== 0
  //           ? hospitals.map((item, index) => {
  //               return (
  //                 <Marker
  //                   key={index + 1}
  //                   coordinate={{
  //                     latitude: item.latitude,
  //                     longitude: item.longitude,
  //                   }}
  //                   title={item.name}
  //                   pinColor="red"
  //                   description={"Address:" + item.adresa}
  //                 />
  //               );
  //             })
  //           : null}
  //       </MapView>
  //     ) : (
  //       <Text style={styles.loadingText}>Loading...</Text>
  //     )}
  //     {errorMsg !== null ? (
  //       <Text style={styles.loadingText}>{errorMsg}</Text>
  //     ) : null}
  //     <AntDesign
  //       style={styles.close}
  //       name="closecircle"
  //       size={40}
  //       color="black"
  //       onPress={() => navigation.navigate("Home")}
  //     />
  //     <Text>
  //       {location !== null
  //         ? location.coords.latitude + " " + location.coords.longitude
  //         : "null"}
  //     </Text>
  //     <Text>
  //       {mapRegion !== null
  //         ? mapRegion.latitude + " " + mapRegion.longitude
  //         : "null"}
  //     </Text>
  //   </View>
  // );
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
    })();
  }, []);

  useEffect(() => {
    if (location) {
      // setmapRegion({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   latitudeDelta: 0.0922,
      //   longitudeDelta: 0.0421,
      // });
      getNearestHospitals(location);
    }
  }, [location]);

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
      ) : null}
      {errorMsg ? <Text style={styles.loadingText}>{errorMsg}</Text> : null}
      <AntDesign
        style={styles.close}
        name="closecircle"
        size={40}
        color="black"
        onPress={() => navigation.navigate("Home")}
      />
      <Text style={{ marginTop: -130 }}>{test}</Text>
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
