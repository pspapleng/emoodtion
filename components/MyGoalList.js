import React from "react";
import { View, StyleSheet } from "react-native";
import { List, Checkbox } from "react-native-paper";
import { MyIconButton } from "./MyIconButton";

const MyGoalList = ({
  title,
  description,
  status,
  color = "black",
  onCheck,
  onPress,
  onDelete,
  icon,
  size,
}) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: "90%" }}>
        <List.Item
          title={title}
          description={description}
          left={() => (
            <Checkbox
              status={status ? "checked" : "unchecked"}
              onPress={onCheck}
              color={color}
              style={{ marginTop: 15 }}
            />
          )}
          onPress={onPress}
        />
      </View>
      <View style={{ width: "10%" }}>
        <MyIconButton
          name={icon}
          size={size}
          color={color}
          onPress={onDelete}
          styleIcon={{ marginTop: 17 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MyGoalList;
