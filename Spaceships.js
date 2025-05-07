import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import SwipeableItem from "./Swipeable";
import styles from "./styles";
import { fetchData } from "./api";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import OfflineNotice from "./Offline";

export default function SpaceshipsTab({ navigation }) {
  const [spaceships, setSpaceships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    fetchData("starships")
      .then((data) => {
        console.log("Fetched spaceships:", data);
        setSpaceships(data);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setRemovingIds([]);
  }, [searchText]);

  const filteredList =
    searchText.trim() === ""
      ? []
      : spaceships
          .filter((spaceship) =>
            spaceship.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .filter((spaceship) => !removingIds.includes(spaceship.uid));

  const handleRemoveItem = (uid) => {
    if (!removingIds.includes(uid)) {
      setRemovingIds((prev) => [...prev, uid]);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="green" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="space-station" size={100} color="black" />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search Spaceships..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <OfflineNotice />

      <ScrollView style={{ marginTop: 20 }}>
        {filteredList.map((item) => (
          <SwipeableItem
            key={item.uid}
            uid={item.uid}
            name={item.name}
            onSwipe={() => {
              if (
                item.name.toLowerCase().trim() ===
                searchText.toLowerCase().trim()
              ) {
                handleRemoveItem(item.uid);
              }
              // Else: do nothing
            }}
          />
        ))}

        {filteredList.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No matching spaceship found.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
