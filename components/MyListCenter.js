import React from "react";
import {
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const MyListCenter = ({ item, onPress }) => {
  const { width, height } = Dimensions.get("screen");
  const SPACING = 20;
  const AVATAR_SIZE = 100;
  const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

  return (
    <TouchableOpacity onPress={onPress}>
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
          <View style={{}}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                borderRadius: 3,
                marginRight: SPACING / 2,
                backgroundColor: "#FFDEED",
              }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "400" }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                opacity: 0.8,
                color: "#0099cc",
                marginBottom: 10,
              }}
            >
              {item.province}
            </Text>
            <View>
              {(() => {
                if (item.online == true && item.offline == false) {
                  return <Text style={{ opacity: 0.8 }}>online</Text>;
                } else if (item.online == false && item.offline == true) {
                  return <Text style={{ opacity: 0.8 }}>offline</Text>;
                } else if (item.online == true && item.offline == true) {
                  return <Text style={{ opacity: 0.8 }}>offline / online</Text>;
                }
                return null;
              })()}
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default MyListCenter;
