import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native";

import SwipeableItem from "./Swipeable";
import styles from "./styles";
import { fetchData } from "./api";
import Icon from "react-native-vector-icons/Ionicons";
import OfflineNotice from "./Offline";

export default function Planets({ navigation }) {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [displayList, setDisplayList] = useState([]);
  const [removingIds, setRemovingIds] = useState([]);

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
      <View style={styles.iconContainer}>
        <Icon name="planet" size={100} color="black" />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search Planets..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Search" onPress={handleSearch} />

      <OfflineNotice />

      <ScrollView style={{ marginTop: 20 }}>
        {displayList.map((item) => (
          <SwipeableItem
            key={item.uid}
            uid={item.uid}
            name={item.name}
            onSwipe={() => handleRemoveItem(item.uid)}
            isRemoving={removingIds.includes(item.uid)}
          />
        ))}

        {displayList.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No planets searched yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
