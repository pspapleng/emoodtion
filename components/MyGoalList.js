import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { List, Checkbox } from "react-native-paper";
import { MyIconButton } from "./MyIconButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyGoalList = ({
  title,
  status,
  color = "black",
  onPress,
  onDelete,
  icon,
  size,
}) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 0.8 }}>
        <List.Item
          title={title}
          left={() => (
            <Checkbox
              status={status ? "checked" : "unchecked"}
              onPress={onPress}
              color={color}
              style={{ marginTop: 15 }}
            />
          )}
          onPress={onPress}
        />
      </View>
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
        onPress={onDelete}
      >
        <MaterialCommunityIcons name={icon} size={size} color={color} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MyGoalList;
