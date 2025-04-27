import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
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
      .then((data) => {
        console.log("Fetched films:", data);
        setFilms(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = films.filter((film) =>
      film.properties.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const newMatches = matches.filter(
      (m) => !filteredFilms.some((s) => s.uid === m.uid)
    );

    setFilteredFilms((prev) => [...prev, ...newMatches]);

    navigation.navigate("Search", { term: searchText });
  };

  const dataToRender = filteredFilms.length > 0 ? filteredFilms : films;

  if (loading) return <ActivityIndicator size="large" color="dodgerblue" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Films..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />

      <ScrollView style={{ marginTop: 20 }}>
        {dataToRender.map((item) => (
          <View key={item.uid} style={styles.item}>
            <Text>{item.properties.title}</Text>
          </View>
        ))}
        {dataToRender.length === 0 && searchText !== "" && (
          <Text>No matching films found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
