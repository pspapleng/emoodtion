import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyIconButton = ({ color, size, onPress, name, styleIcon }) => {
  return (
    <Pressable
      style={(args) => {
        if (args.pressed) {
          return [
            styles.base,
            {
              opacity: 0.5,
              backgroundColor: "transparent",
            },
          ];
        }

        return [styles.base, { opacity: 1, backgroundColor: "transparent" }];
      }}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={name}
        size={size}
        color={color}
        style={styleIcon}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {},
});

export default MyIconButton;
