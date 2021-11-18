import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgUri } from "react-native-svg";

const MyAvatar = ({ uri, width, height, color }) => {
  return (
    <View
      style={[
        styles.back,
        { backgroundColor: "transparent", borderColor: color },
      ]}
    >
      <SvgUri
        style={{
          width: width,
          height: height,
          marginBottom: 5,
        }}
        uri={uri}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  back: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    borderWidth: 2,
    borderRadius: 75,
    marginBottom: 10,
  },
});

export default MyAvatar;
