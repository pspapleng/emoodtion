import React from "react";
import { Animated, Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";
import dayjs from "dayjs";

const MyListReview = ({ item }) => {
  const SPACING = 20;
  const AVATAR_SIZE = 100;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

  return (
    <Animated.View
      style={{
        flexDirection: "column",
        padding: SPACING,
        marginBottom: SPACING,
        // backgroundColor: "rgba(255,255,255,0.8)",
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 0.4 }}>
          <View
            style={[
              style.back,
              { backgroundColor: "transparent", borderColor: "#fff" },
            ]}
          >
            <SvgUri
              style={{
                width: 55,
                height: 55,
                marginBottom: 5,
              }}
              uri={item.avatarURL}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 20, marginTop: 12 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.username}
            <Text> </Text>
            {item.like ? (
              <MaterialCommunityIcons
                name="emoticon"
                size={20}
                color="#97DBAE"
              />
            ) : (
              <MaterialCommunityIcons
                name="emoticon-frown"
                size={20}
                color="#EC8678"
              />
            )}
          </Text>
          <Text
            style={{
              fontSize: 14,
              opacity: 0.8,
              color: "#0099cc",
            }}
          >
            {dayjs(item.create_at.toDate()).format("DD MMM YYYY | HH:mm a")}
          </Text>
          <View style={{ marginTop: 20, opacity: 0.8, fontSize: 12 }}>
            <Text>{item.review}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const style = StyleSheet.create({
  sentiment: {
    position: "absolute",
    top: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  back: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: 75,
    borderWidth: 2,
    borderRadius: 75,
    marginBottom: 10,
  },
});
export default MyListReview;
