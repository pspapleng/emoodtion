import React from "react";
import { View, Text, StyleSheet } from "react-native";

const LandingScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>Landing Screen</Text>
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

export default LandingScreen;
