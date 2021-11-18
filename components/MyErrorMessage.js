import React from "react";
import { StyleSheet, Text } from "react-native";

const MyErrorMessage = ({ error, visible }) => {
  if (!error || !visible) {
    return null;
  }

  return <Text style={styles.errorText}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: "#E90404",
    fontSize: 14,
    marginVertical: 20,
    marginHorizontal: 50,
    fontWeight: "600",
  },
});

export default MyErrorMessage;
