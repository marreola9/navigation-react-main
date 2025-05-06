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
  const [displayList, setDisplayList] = useState([]); // Lista de planetas que se muestran después de la búsqueda
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

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = planets.filter((planet) =>
      planet.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const newResults = matches.filter(
      (match) => !displayList.some((item) => item.uid === match.uid)
    );

    setDisplayList([...displayList, ...newResults]);
    setSearchText("");

    navigation.navigate("Search", { term: searchText });
  };

  const handleRemoveItem = (uid) => {
    setRemovingIds((prev) => [...prev, uid]);

    setTimeout(() => {
      setDisplayList((prev) => prev.filter((item) => item.uid !== uid));
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
      <Button title="Search" onPress={handleSearch} />

      <OfflineNotice />

      <ScrollView style={{ marginTop: 20 }}>
        {displayList.map((item) => (
          <SwipeableItem
            key={item.uid}
            uid={item.uid}
            name={item.name}
            onSwipe={() =>
              navigation.navigate("PlanetsDetail", { planet: item })
            } // esta parte es la que supuestamente lleva a otra screen
            //isRemoving={removingIds.includes(item.uid)}
          />
        ))}

        {displayList.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No planets searched yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
