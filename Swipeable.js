import React, { useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import styles from "./styles";

export default function Swipeable({ onSwipe, name }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  function onScroll(e) {
    if (e.nativeEvent.contentOffset.x >= 200) {
      onSwipe();
    }
  }

  const scrollProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    scrollEventThrottle: 16,
    onScroll,
  };

  return (
    <View style={styles.swipeContainer}>
      <ScrollView {...scrollProps}>
        <TouchableOpacity>
          <Animated.View style={[styles.swipeItem, { opacity: fadeAnim }]}>
            <Text style={styles.swipeItemText}>{name}</Text>
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.swipeBlank}></View>
      </ScrollView>
    </View>
  );
}
