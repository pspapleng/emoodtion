import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StatusBar,
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MyListCenter } from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase, { db } from "../config/Firebase"; //import db จาก config
import { useTheme } from "react-native-paper";

const BG_IMG =
  "https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const SPACING = 20;
const AVATAR_SIZE = 100;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const CareCenterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [Data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("care_center")
      .orderBy("name", "asc")
      // .limit(10)
      .onSnapshot(
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          const care_center = [];
          querySnapshot.forEach((doc) => {
            let doc_id = doc.id;
            care_center.push({ ...doc.data(), doc_id });
          });
          setData(care_center);
          setFilterData(care_center);
          setIsLoading(false);
        }
      );
    return unsubscribe;
  }, []);

  const bookmarks = useSelector((state) => state.user.bookmarks);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [filterData, setFilterData] = useState(Data);
  const [search, setSearch] = useState("");
  const [bookmark, setBookmark] = useState(false);
  const [myBookMark, setMyBookMark] = useState([]);

  const searchFilter = (text) => {
    if (text) {
      const newData = Data.filter((item) => {
        const textData = text.toUpperCase();
        if (item.name.toUpperCase().indexOf(textData) > -1) {
          return item.name.toUpperCase().indexOf(textData) > -1;
        } else if (item.province.toUpperCase().indexOf(textData) > -1) {
          return item.province.toUpperCase().indexOf(textData) > -1;
        } else {
          return "".toUpperCase().indexOf(textData) > -1;
        }
      });
      setFilterData(newData);
      setSearch(text);
    } else {
      setFilterData(Data);
      setSearch(text);
    }
  };

  const myBookmark = (item) => {
    if (bookmark == false) {
      setFilterData(item);
    } else {
      searchFilter(search);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View>
        <View style={style.searchInputContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={30}
            color={colors.subtitle}
            style={{ marginLeft: 20 }}
          />
          <TextInput
            placeholder="Search"
            style={{
              fontSize: 20,
              paddingLeft: 10,
              width: 280,
            }}
            value={search}
            editable
            onChangeText={(text) => searchFilter(text)}
          />
          <View style={style.iconContainer}>
            <TouchableOpacity
              onPress={() => (myBookmark(bookmarks), setBookmark(!bookmark))}
            >
              <MaterialCommunityIcons
                name={bookmark ? "bookmark" : "bookmark-outline"}
                size={30}
                color={bookmark ? colors.primary : colors.subtitle}
                style={{ justifyContent: "flex-end" }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Animated.FlatList
        data={filterData}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(index, item) => item}
        contentContainerStyle={{
          padding: SPACING,
          paddingTop: StatusBar.currentHeight || 35,
        }}
        renderItem={({ item, index }) => {
          return (
            <MyListCenter
              key={index}
              item={item}
              onPress={() => navigation.navigate("Detail", { Item: item })}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  searchInputContainer: {
    height: 50,
    backgroundColor: "white",
    margin: 15,
    marginBottom: 0,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    height: 35,
    width: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CareCenterScreen;
