import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MyTextInput = ({
  leftIcon,
  rightIcon,
  iconColor = "#30343F",
  inputStyle,
  containerStyle,
  placeholderTextColor = "#ccc",
  handlePasswordVisibility,
  editable = true,
  label,
  ...rest
}) => {
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.container, containerStyle]}>
        {leftIcon ? (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={iconColor}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          {...rest}
          editable={editable}
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, inputStyle]}
        />
        {rightIcon ? (
          <TouchableOpacity onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={iconColor}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    flexDirection: "row",
    padding: 12,
    width: "75%",
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  leftIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "600",
    color: "#FF9EB1",
  },
  input: {
    flex: 1,
    width: "100%",
    fontSize: 16,
  },
  rightIcon: {
    alignSelf: "center",
    marginTop: 2,
    marginLeft: 10,
  },
});

export default MyTextInput;
