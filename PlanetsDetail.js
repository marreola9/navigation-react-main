import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// This screen displays the details of a planet
// It gets the planet data passed form the Planets.js

export default function PlanetsDetail({ route }) {
  // The route prop contains the parameters passed from navigation
  // In Planets.js example navigation.navigate('PlanetsDetail", {planet: item})
  // Aqui se extrae el planet object from route.params

  const { planet } = route.params;

  // Regresa los detalles de el planeta que se busco
  //se agrega el icono en la pantalla de detalles
  return (
    <View style={styles.container}>
      <Icon
        name="planet"
        size={300}
        color="green"
        style={{ marginBottom: 30 }}
      />
      <Text style={styles.title}>{planet.name}</Text>
      <Text style={styles.detailText}>Climate: {planet.climate}</Text>
      <Text style={styles.detailText}>Diameter: {planet.diameter}</Text>
      <Text style={styles.detailText}>Population: {planet.population}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10, // espacio entre el planeta y el titulo
  },
  detailText: {
    fontSize: 18, // detalles en los textos de diametro, poblacion, clima
    marginVertical: 5,
  },
});
