import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ActivityIndicator, TextInput, Button } from "react-native";
import styles from "./styles";
import { fetchData } from "./api";

export default function SpaceshipsTab({ navigation }) {
  const [spaceships, setSpaceships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredSpaceships, setFilteredSpaceships] = useState([]);

  useEffect(() => {
    fetchData("starships")
      .then(setSpaceships)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = spaceships.filter((spaceship) =>
      spaceship.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredSpaceships(matches);

    // Navigate to modal
    navigation.navigate("Search", { term: searchText });
  };

  if (loading) return <ActivityIndicator size="large" color="dodgerblue" />;
  if (error) return <Text>Error: {error.message}</Text>;

  // Show only filtered spaceships if there are any
  // Search Input

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Spaceships..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />

      {filteredSpaceships.length > 0 ? (
        <FlatList
          data={filteredSpaceships}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.name}</Text>
          )}
        />
      ) : (
        searchText !== "" && <Text>No matching Spaceship found.</Text>
      )}
    </View>
  );
}
