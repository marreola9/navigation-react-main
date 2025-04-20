import React from "react";
import { View, Text, StatusBar } from "react-native";
import styles from "./styles";

export default function Details({ route, navigation }) {
  const { content, title } = route.params;

  //We are going to use the useEffect hook
  // UseEffect is a hook that allows you to perform side effects in your function components
  // Side effects are anything  that affects something outside of the function
  // Use effect runds after every render

  React.useEffect(() => {
    navigation.setOptions({ title });
  });
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <Text>{content}</Text>
    </View>
  );
}
