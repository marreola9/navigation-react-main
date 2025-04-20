import React from "react";
import { View, Text, Button, Modal } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import styles from "./styles";

export default function Search() {
  const { params } = useRoute();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.item}>You searched for: {params?.term}</Text>
      <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}
