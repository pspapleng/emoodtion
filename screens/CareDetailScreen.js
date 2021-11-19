import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  StatusBar,
  Animated,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  MyTextArea,
  MyButton,
  MyIconButton,
  MyListReview,
} from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Firebase, { db } from "../config/Firebase"; //import db จาก config

import { Dialog, Portal, useTheme } from "react-native-paper";
import { set } from "react-native-reanimated";

const SPACING = 20;
const AVATAR_SIZE = 100;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const CareDetailScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [careCenter, setCareCenter] = useState(route.params.Item);
  const [review, setReview] = useState([]);
  var numReview = review.length;
  const [visible, setVisible] = useState(false);
  const [textReview, setTextReview] = useState("");
  const [isGood, setIsGood] = useState(false);
  const [isBad, setIsBad] = useState(false);

  const [bookmark, setBookmark] = useState(true);

  const [myBookmark, setMybookmark] = useState(
    useSelector((state) => state.user.bookmarks)
  );
  const [isBookmark, setIsBookmark] = useState(true);

  const id = useSelector((state) => state.user.auth_id);
  const doc_id = useSelector((state) => state.user.doc_id);
  const username = useSelector((state) => state.user.username);
  const avatarURL = useSelector((state) => state.user.avatarURL);
  const bookmarks = useSelector((state) => state.user.bookmarks);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = db
      .collection("care_center")
      .doc(careCenter.doc_id)
      .collection("reviews")
      .orderBy("create_at", "desc")
      .onSnapshot(
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          const review = [];
          querySnapshot.forEach((doc) => {
            let doc_id = doc.id;
            review.push({ ...doc.data(), doc_id });
          });
          setReview(review);
          setIsLoading(false);
          // console.log(review[0].create_at.toDate());
        }
      );
    return unsubscribe;
  }, []);

  const showDialog = () => {
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };

  const addReview = () => {
    return db
      .collection("care_center")
      .doc(careCenter.doc_id)
      .collection("reviews")
      .add({
        auth_id: id,
        username: username,
        avatarURL: avatarURL,
        review: textReview,
        like: isGood,
        create_at: new Date(),
      })
      .then(() => {
        setVisible(false);
        setTextReview("");
        setIsGood(false);
        setIsBad(false);
        console.log("Document successfully added!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error adding document: ", error);
      });
  };

  const addBookmark = () => {
    bookmarks.push(careCenter);
    // console.log(bookmarks);
    return db
      .collection("users")
      .doc(doc_id)
      .update({
        bookmarks: bookmarks,
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
    // console.log("bookmark succ", bookmarks);
  };

  const removeBookmark = () => {
    bookmarks.filter((items, index) => {
      if (items.doc_id.indexOf(careCenter.doc_id) > -1) {
        // console.log("eiei", index);
        return bookmarks.splice(index, 1);
      } else {
        return "".indexOf(careCenter.doc_id) > -1;
      }
    });
    return db
      .collection("users")
      .doc(doc_id)
      .update({
        bookmarks: bookmarks,
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
    // console.log("remove succ", bookmarks);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          color: colors.background,
          paddingBottom: 20,
          marginBottom: 30,
          borderRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        }}
      >
        <ImageBackground
          style={style.headerImage}
          source={{ uri: careCenter.image }}
        >
          <View style={style.header}>
            <View style={style.iconContainer}>
              {isBookmark ? (
                <MyIconButton
                  name="bookmark"
                  size={30}
                  color={colors.primary}
                  onPress={() => console.log("book")}
                />
              ) : (
                <MyIconButton
                  name="bookmark-outline"
                  size={30}
                  color={colors.primary}
                  onPress={() => console.log("unbook")}
                />
              )}
              {/* {(() => {
                if (
                  bookmarks.filter((items) => {
                    if (items.doc_id.indexOf(item.doc_id) > -1) {
                      return items.doc_id.indexOf(item.doc_id) > -1;
                    } else {
                      return "".indexOf(item.doc_id) > -1;
                    }
                  }).length == 1
                ) {
                  return (
                    <TouchableOpacity
                      onPress={() => (setbookmark(!bookmark), removeBookmark())}
                    >
                      <MaterialCommunityIcons
                        name="bookmark"
                        color={colors.primary}
                        size={30}
                      />
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      onPress={() => (setbookmark(!bookmark), addBookmark())}
                    >
                      <MaterialCommunityIcons
                        name="bookmark-outline"
                        color={colors.primary}
                        size={30}
                      />
                    </TouchableOpacity>
                  );
                }
              })()} */}
            </View>
          </View>
        </ImageBackground>
        <View>
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              {careCenter.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "#0099cc",
                marginTop: 5,
                marginHorizontal: 2,
              }}
            >
              {careCenter.address}
            </Text>
            <View style={{ marginTop: 15 }}>
              <Text style={{ lineHeight: 20 }}>{careCenter.description}</Text>
              <Text style={{ lineHeight: 20, marginTop: 15 }}>
                เวลาทำการ : {careCenter.office_hours}
              </Text>
              {(() => {
                if (careCenter.contact.phone) {
                  return (
                    <Text style={{ lineHeight: 20 }}>
                      เบอร์โทรติดต่อ : {careCenter.contact.phone}
                    </Text>
                  );
                }
              })()}
              {(() => {
                if (careCenter.contact.web) {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <Text style={{}}>Website : </Text>
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity>
                          <Text
                            style={{
                              color: "#BCA7D5",
                              textDecorationLine: "underline",
                              flex: 1,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            onPress={() =>
                              Linking.openURL(careCenter.contact.web)
                            }
                          >
                            {careCenter.contact.web}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }
              })()}
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              ค่าบริการโดยประมาณ
            </Text>
            <View style={style.priceTag}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#fff",
                  marginLeft: 5,
                }}
              >
                ฿ {careCenter.cost}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            // marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 20,
            paddingBottom: 10,
            alignItems: "center",
            flex: 1,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>
            {numReview} Reviews
          </Text>
          <View style={{ alignItems: "flex-end", marginRight: 20 }}>
            <MaterialCommunityIcons
              onPress={() => setVisible(!visible)}
              name="pencil"
              size={30}
              color={colors.primary}
            />
          </View>
        </View>
        <Animated.FlatList
          data={review}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          keyExtractor={(item, index) => item}
          contentContainerStyle={{
            padding: SPACING,
            paddingTop: StatusBar.currentHeight || 20,
          }}
          renderItem={({ item, index }) => {
            return <MyListReview key={index} item={item} />;
          }}
        />
      </SafeAreaView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Dialog.Content style={{ height: 450, paddingVertical: 20 }}>
              <Text style={{ fontSize: 24, fontWeight: "600" }}>Review</Text>
              <MyTextArea
                onChangeText={(text) => {
                  setTextReview(text);
                }}
                defaultValue={textReview}
                maxLength={250}
                placeholder={"Type here . . ."}
                textareaStyle={{
                  height: 210,
                  width: 275,
                }}
                textareaContainerStyle={{
                  height: 210,
                  width: 300,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: -10,
                  marginBottom: 15,
                  marginHorizontal: 25,
                }}
              >
                <MaterialCommunityIcons
                  onPress={() => {
                    setIsGood(!isGood);
                    setIsBad(isGood);
                  }}
                  name={isGood ? "emoticon" : "emoticon-outline"}
                  size={70}
                  color={colors.primary}
                />
                <MaterialCommunityIcons
                  onPress={() => {
                    setIsBad(!isBad);
                    setIsGood(isBad);
                  }}
                  name={isBad ? "emoticon-frown" : "emoticon-frown-outline"}
                  size={70}
                  color={colors.primary}
                />
              </View>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <MyButton
                  onPress={addReview}
                  backgroundColor={colors.secondary}
                  title="ADD REVIEW"
                  color="#fff"
                  titleSize={16}
                  containerStyle={{
                    marginVertical: 5,
                  }}
                />
              </View>
            </Dialog.Content>
          </TouchableWithoutFeedback>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  btn: {
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "rgba(0,0,0,0)",
    marginHorizontal: 20,
    borderRadius: 10,
  },
  sentiment: {
    position: "absolute",
    top: 1,
    right: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  priceTag: {
    height: 40,
    alignItems: "center",
    marginLeft: 35,
    paddingLeft: 20,
    flex: 1,
    backgroundColor: "#BCA7D5",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: "row",
  },
  iconContainer: {
    height: 35,
    width: 35,
    backgroundColor: "#fff",
    borderRadius: 10,
    position: "absolute",
    right: 0,
    top: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    height: 300,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
    overflow: "hidden",
    backgroundColor: "pink",
  },
  header: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  headerModal: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default CareDetailScreen;
