import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native";

import SwipeableItem from "./Swipeable";
import styles from "./styles";
import { fetchData } from "./api";
import Icon from "react-native-vector-icons/Ionicons";
import OfflineNotice from "./Offline";

export default function Planets({ navigation }) {
  const [planets, setPlanets] = useState([]); // Todos los planetas encontrados en el API
  const [loading, setLoading] = useState(true); // Muestra el indicador de carga hasta que se cargan los datos
  const [error, setError] = useState(null); // Se encarga de los errores de API
  const [searchText, setSearchText] = useState(""); // Lo que el usuario escribe en la barra de busqueda

  const [removingIds, setRemovingIds] = useState([]); // mantiene record de los planetas que se han borrado

  useEffect(() => {
    fetchData("planets")
      .then((data) => {
        console.log("Fetched planets:", data);
        setPlanets(data); // Guarda todos los planetas en  state
      })

      // Guarda cualquier error
      .catch(setError)

      // Deja de mostrar la barra cargadora
      .finally(() => setLoading(false));
  }, []);

  // si la barra de busqueda esta vacia (filteredList) is an empty array -> no muestra nada
  // Una vez que el usuario  empieza a escribir, el filtro sirve y los planetas empiezan a parecer

  const filteredList =
    searchText.trim() === ""
      ? []
      : planets.filter((planet) =>
          planet.name.toLowerCase().includes(searchText.toLowerCase())
        );

  const handleRemoveItem = (uid) => {
    setRemovingIds((prev) => [...prev, uid]);

    setTimeout(() => {
      setPlanets((prev) => prev.filter((item) => item.uid !== uid));

      setRemovingIds((prev) => prev.filter((id) => id !== uid));
    }, 300);
  };

  if (loading) return <ActivityIndicator size="large" color="green" />;

  if (error) return <Text>Error: {error.message}</Text>;

  // icono

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="planet" size={100} color="black" />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search Planets..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <OfflineNotice />

      <ScrollView style={{ marginTop: 20 }}>
        {filteredList.map((item) => (
          <SwipeableItem
            key={item.uid}
            uid={item.uid}
            name={item.name}
            onSwipe={() => {
              if (
                item.name.toLowerCase().trim() ===
                searchText.toLowerCase().trim()
              ) {
                navigation.navigate("PlanetsDetail", { planet: item });
              }
              // item.name.toLowerCase().trim() === searchText.toLowerCase().trim()
              // No distingue entre mayúsculas y minúsculas -> (lowerCase()).
              // Ignora los espacios iniciales y finales -> (trim()).
              // Solo se ejecuta si el texto escrito coincide exactamente con el nombre del planeta.
            }}
          />

          //"No  matching planets found" solo aparecera cuando el usuario busque algo y no exista
          // (searchText.trim() !== "")
        ))}
        {filteredList.length === 0 && searchText.trim() !== "" && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No matching planets found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
