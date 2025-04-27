import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Button,
} from "react-native";
import styles from "./styles";
import { fetchData } from "./api";

export default function Planets({ navigation }) {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPlanets, setFilteredPlanets] = useState([]);

  useEffect(() => {
    fetchData("planets")
      .then(setPlanets)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = planets.filter((planet) =>
      planet.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const newMatches = matches.filter(
      (m) => !filteredPlanets.some((s) => s.uid === m.uid)
    );

    setFilteredPlanets((prev) => [...prev, ...newMatches]);

    // Navigate to modal
    navigation.navigate("Search", { term: searchText });
  };

  const dataToRender = filteredPlanets.length > 0 ? filteredPlanets : planets;

  if (loading) return <ActivityIndicator size="large" color="dodgerblue" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Planets..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />

      <ScrollView style={{ marginTop: 20 }}>
        {dataToRender.map((item) => (
          <View key={item.uid} style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        ))}
        {dataToRender.length === 0 && searchText !== "" && (
          <Text>No matching planets found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
