import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MyButton } from "../components";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const LandingScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.screen}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#E2F0FB", "#FFE6E6", "#F0E4EB"]}
        style={styles.background}
      />
      <MyButton
        onPress={() => {
          navigation.navigate("SignIn");
        }}
        backgroundColor={colors.primary}
        title="SIGN IN"
        color="#fff"
        titleSize={20}
        containerStyle={{
          marginBottom: 24,
        }}
      />
      <MyButton
        onPress={() => {
          navigation.navigate("SignUp");
        }}
        backgroundColor={colors.secondary}
        title="SIGN UP"
        color="#fff"
        titleSize={20}
        containerStyle={{
          marginBottom: 24,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});

export default LandingScreen;
