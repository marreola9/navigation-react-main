import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default function OfflineNotice() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={{ alignItems: "center", marginVertical: 5 }}>
      <Text
        style={{
          fontWeight: "bold",
          color: isConnected ? "green" : "red",
        }}
      >
        {isConnected ? "Connected" : "Disconnected"}
      </Text>
    </View>
  );
}
