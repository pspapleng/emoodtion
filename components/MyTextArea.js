import React from "react";
import { View, StyleSheet } from "react-native";
import Textarea from "react-native-textarea";

const MyTextArea = ({
  placeholder,
  placeholderTextColor = "#c7c7c7",
  maxLength,
  defaultValue,
  onChangeText,
  textareaStyle,
  textareaContainerStyle,
}) => {
  return (
    <View style={styles.container}>
      <Textarea
        containerStyle={[styles.textareaContainer, textareaContainerStyle]}
        style={[styles.textarea, textareaStyle]}
        onChangeText={onChangeText}
        defaultValue={defaultValue}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        // underlineColorAndroid={"transparent"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    flexDirection: "row",
    padding: 12,
    alignContent: "center",
    justifyContent: "center",
  },
  textareaContainer: {
    padding: 5,
    width: "80%",
  },
  textarea: {
    // textAlignVertical: "top", // hack android
    fontSize: 16,
    color: "#333",
  },
});

export default MyTextArea;
