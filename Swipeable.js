import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { SlideInLeft, SlideOutRight } from "react-native-reanimated";

export default function SwipeableItem({ name, onSwipe, isRemoving }) {
  const renderRightActions = () => {
    return (
      <TouchableOpacity onPress={onSwipe}>
        <View
          style={{
            backgroundColor: "green",
            justifyContent: "center",
            alignItems: "flex-end",
            padding: 20,
            flex: 1,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={50}
      overshootRight={false}
    >
      <Animated.View
        entering={SlideInLeft}
        exiting={isRemoving ? SlideOutRight : undefined}
        style={{
          backgroundColor: "white",
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={onSwipe}>
          <Text>{name}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
}
