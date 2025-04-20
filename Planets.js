import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ActivityIndicator, TextInput, Button } from "react-native";
import styles from "./styles";
import { fetchData } from "./api";

export default function Planets({ navigation }) {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPlanets, setFilteredPlanets] = useState([]);

  useEffect(() => {
    fetchData("Planets")
      .then(setPlanets)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = planets.filter((planet) =>
      planet.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredPlanets(matches);

    // Navigate to modal
    navigation.navigate("Search", { term: searchText });
  };

  if (loading) return <ActivityIndicator size="large" color="dodgerblue" />;
  if (error) return <Text>Error: {error.message}</Text>;

  // Search Input
  // Show only filtered planets if there are any

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search planets..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />

      {filteredPlanets.length > 0 ? (
        <FlatList
          data={filteredPlanets}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.name}</Text>
          )}
        />
      ) : (
        searchText !== "" && <Text>No matching planets found.</Text>
      )}
    </View>
  );
}
