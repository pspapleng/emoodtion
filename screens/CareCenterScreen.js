import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CareCenterScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>Care Center Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CareCenterScreen;
