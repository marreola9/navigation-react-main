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

    const newMatches = matches.filter(
      (m) => !filteredSpaceships.some((s) => s.uid === m.uid)
    );

    setFilteredSpaceships((prev) => [...prev, ...newMatches]);

    // Navigate to modal
    navigation.navigate("Search", { term: searchText });
  };

  const dataToRender =
    filteredSpaceships.length > 0 ? filteredSpaceships : spaceships;

  if (loading) return <ActivityIndicator size="large" color="dodgerblue" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Spaceships..."
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
          <Text>No matching spaceships found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
