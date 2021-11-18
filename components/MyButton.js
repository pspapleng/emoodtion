import React from "react";
import { StyleSheet, Pressable, Text } from "react-native";

const MyButton = ({
  title,
  backgroundColor,
  color,
  titleSize = 14,
  onPress,
  width = "75%",
  containerStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={(args) => {
        if (args.pressed) {
          return [
            styles.base,
            {
              opacity: 0.5,
              backgroundColor,
              width,
            },
            containerStyle,
          ];
        }

        return [
          styles.base,
          {
            opacity: 1,
            backgroundColor,
            width,
          },
          containerStyle,
        ];
      }}
    >
      <Text style={[styles.text, { color: color, fontSize: titleSize }]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "600",
  },
  base: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
});

export default MyButton;
