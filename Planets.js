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

export default function Planets({ navigation }) {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPlanets, setFilteredPlanets] = useState([]);

  useEffect(() => {
    fetchData("planets")
      .then((data) => {
        console.log("Fetched planets:", data);
        setPlanets(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = planets.filter((planet) =>
      planet.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredPlanets(matches);

    navigation.navigate("Search", { term: searchText });
  };

  const handleSwipe = (planetName) => {
    console.log(`Swiped on: ${planetName}`);
  };

  const dataToRender = filteredPlanets.length > 0 ? filteredPlanets : planets;

  if (loading) return <ActivityIndicator size="large" color="green" />;
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
          <Swipeable
            key={item.uid}
            name={item.name}
            onSwipe={() => handleSwipe(item.name)}
          />
        ))}
        {dataToRender.length === 0 && searchText !== "" && (
          <Text>No matching planets found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
