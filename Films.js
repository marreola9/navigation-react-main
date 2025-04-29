import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import SwipeableItem from "./Swipeable";
import styles from "./styles";
import { fetchData } from "./api";

export default function Films({ navigation }) {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [displayList, setDisplayList] = useState([]);
  const [removingIds, setRemovingIds] = useState([]);

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
        {displayList.map((item) => (
          <SwipeableItem
            key={item.uid}
            uid={item.uid}
            name={item.properties.title}
            onSwipe={() => handleRemoveItem(item.uid)}
            isRemoving={removingIds.includes(item.uid)}
          />
        ))}

        {displayList.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No matching films found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
