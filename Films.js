import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { ActivityIndicator, TextInput, Button } from "react-native";
import styles from "./styles";
import { fetchData } from "./api";

export default function Films({ navigation }) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredFilms, setFilteredFilms] = useState([]);

  useEffect(() => {
    fetchData("films")
      .then(setFilms)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = films.filter((film) =>
      film.title.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredFilms(matches);

    // Navigate modal
    navigation.navigate("Search", { term: searchText });
  };

  if (loading) return <ActivityIndicator size="large" color="dodgerblue" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      // Search Input
      <TextInput
        style={styles.input}
        placeholder="Search films..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />
      // Show only filtered pfilms if there are any
      {filteredFilms.length > 0 ? (
        <FlatList
          data={filteredFilms}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => (
            <Text style={styles.item}>{item.title}</Text>
          )}
        />
      ) : (
        searchText !== "" && <Text>No matching films found.</Text>
      )}
    </View>
  );
}
