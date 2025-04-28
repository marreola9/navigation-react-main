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

export default function SpaceshipsTab({ navigation }) {
  const [spaceships, setSpaceships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredSpaceships, setFilteredSpaceships] = useState([]);

  useEffect(() => {
    fetchData("starships")
      .then((data) => {
        console.log("Fetched spaceships:", data);
        setSpaceships(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchText.trim() === "") return;

    const matches = spaceships.filter((spaceship) =>
      spaceship.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredSpaceships(matches);

    navigation.navigate("Search", { term: searchText });
  };

  const handleSwipe = (spaceshipName) => {
    console.log(`Swiped on: ${spaceshipName}`);
  };

  const dataToRender =
    filteredSpaceships.length > 0 ? filteredSpaceships : spaceships;

  if (loading) return <ActivityIndicator size="large" color="green" />;
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
          <Swipeable
            key={item.uid}
            name={item.name}
            onSwipe={() => handleSwipe(item.name)}
          />
        ))}
        {dataToRender.length === 0 && searchText !== "" && (
          <Text>No matching spaceships found.</Text>
        )}
      </ScrollView>
    </View>
  );
}
