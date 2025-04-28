import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import Swipeable from "./Swipeable";
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

    setFilteredFilms(matches);

    navigation.navigate("Search", { term: searchText });
  };

  const handleSwipe = (filmTitle) => {
    console.log(`Swiped on: ${filmTitle}`);
  };

  const dataToRender = filteredFilms.length > 0 ? filteredFilms : films;

  if (loading) return <ActivityIndicator size="large" color="green" />;
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
          <Swipeable
            key={item.uid}
            name={item.properties.title}
            onSwipe={() => handleSwipe(item.properties.title)}
          />
        ))}
        {dataToRender.length === 0 && searchText !== "" && (
          <Text>No matching films found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
