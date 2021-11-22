import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";

const MyMoodList = ({
  title,
  description,
  icon,
  iconColor = "black",
  moodColor,
  onPress,
}) => {
  return (
    <View>
      <List.Item
        title={title}
        description={description}
        left={(props) => (
          <List.Icon
            {...props}
            icon={icon}
            color={iconColor}
            style={{ backgroundColor: moodColor }}
          />
        )}
        onPress={onPress}
        style={{ backgroundColor: "#fff" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default MyMoodList;
