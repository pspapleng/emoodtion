import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import {
  MyButton,
  MyTextInput,
  MyErrorMessage,
  MyIconButton,
  MyAvatar,
  MyMoodList,
  MyGoalList,
} from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Firebase, { auth, db } from "../config/Firebase";

import { Card, List, FAB, Dialog, Portal, useTheme } from "react-native-paper";
import dayjs from "dayjs";

const MoodScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;
  const [name, setName] = useState(currentUser.displayName);
  const [today, setToday] = useState(new Date());
  const [todayText, setTodayText] = useState(
    dayjs(today).format("DD MMM YYYY")
  );
  const [mood, setMood] = useState([]);
  const [goal, setGoal] = useState([]);
  const [todayGaol, setTodayGoal] = useState(0);
  const [newGoal, setNewGoal] = useState("");
  const [visible, setVisible] = useState(false);
  const [moodTime, setMoodTime] = useState("");
  const [moodIcon, setMoodIcon] = useState("");
  const [moodBackground, setMoodBackground] = useState("");
  const [moodNote, setMoodNote] = useState("");

  useEffect(() => {
    const start_day = dayjs().startOf("date").toDate();
    const end_day = dayjs().endOf("date").toDate();
    // console.log("today", today, "start_day", start_day, "end_day", end_day);
    const unsubscribeMood = db
      .collection("mood")
      .where("auth_id", "==", currentUser.uid)
      .orderBy("create_at", "asc")
      .startAt(start_day)
      .endAt(end_day)
      .onSnapshot(
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          const user_mood = [];
          querySnapshot.forEach((doc) => {
            let icon = "emoticon-outline";
            let background = "transparent";
            switch (doc.data().emotion) {
              case 1: {
                icon = "emoticon-dead-outline";
                background = colors.mood1;
                break;
              }
              case 2: {
                icon = "emoticon-sad-outline";
                background = colors.mood2;
                break;
              }
              case 3: {
                icon = "emoticon-neutral-outline";
                background = colors.mood3;
                break;
              }
              case 4: {
                icon = "emoticon-happy-outline";
                background = colors.mood4;
                break;
              }
              case 5: {
                icon = "emoticon-cool-outline";
                background = colors.mood5;
                break;
              }
              default:
                break;
            }
            user_mood.push({ ...doc.data(), icon, background });
          });
          // console.log(user_mood);
          setMood(user_mood);
        }
      );

    const unsubscribeGoal = db
      .collection("goal")
      .where("auth_id", "==", currentUser.uid)
      .orderBy("create_at", "asc")
      .startAt(start_day)
      .endAt(end_day)
      .onSnapshot(
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          const user_goal = [];
          querySnapshot.forEach((doc) => {
            let doc_id = doc.id;
            user_goal.push({ ...doc.data(), doc_id });
          });
          if (user_goal.length > 0) {
            // console.log(user_goal);
            setGoal(user_goal);
            setTodayGoal(user_goal.length);
          }
          setIsLoading(false);
        }
      );
    return unsubscribeMood, unsubscribeGoal;
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
  };
  const showDialog = (time, icon, color, note) => {
    // console.log(icon, color, note);
    setMoodTime(time);
    setMoodIcon(icon);
    setMoodBackground(color);
    setMoodNote(note);
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
    setNewGoal("");
  };

  const addGoal = () => {
    if (newGoal != "") {
      return db
        .collection("goal")
        .add({
          auth_id: currentUser.uid,
          goal_name: newGoal,
          create_at: new Date(),
          checked: false,
        })
        .then(() => {
          console.log("Document successfully add!");
          setNewGoal("");
          setVisible(false);
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error adding document: ", error);
        });
    } else {
      Alert.alert("", "fill the blank");
    }
  };

  const deleteGoal = (id) => {
    Alert.alert("Delete Goal", "Are you sure?", [
      {
        text: "Yes",
        onPress: () => {
          return db
            .collection("goal")
            .doc(id)
            .delete()
            .then(() => {
              console.log("Document successfully deleted!");
              Alert.alert("", "Delete complete!");
            })
            .catch((error) => {
              console.error("Error removing document: ", error);
            });
        },
      },
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "destructive",
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content style={[styles.dialog, { color: colors.subtitle }]}>
            <Text></Text>
            <MaterialCommunityIcons
              name={moodIcon}
              size={30}
              style={{ marginBottom: 5 }}
            />
            <Text>{moodTime} </Text>
            <Text></Text>
            <Text style={styles.subtitle}>{moodNote}</Text>
          </Dialog.Content>
          <Dialog.Title
            style={{
              backgroundColor: moodBackground,
              height: 45,
              marginTop: 10,
            }}
          ></Dialog.Title>
        </Dialog>
      </Portal>
      <View style={{ width: 350 }}>
        <Card style={{ height: 490 }}>
          <Card.Content>
            <List.Subheader style={[styles.title, { color: colors.title }]}>
              Hi, {name}
            </List.Subheader>
            <List.Subheader
              style={[styles.subtitle, { color: colors.subtitle }]}
            >
              {todayText}
            </List.Subheader>
            <List.Section style={{ height: 360 }}>
              <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
                {mood.map((item, index) => {
                  // console.log("item", item);
                  return (
                    <MyMoodList
                      key={index}
                      title={item.create_at
                        .toDate()
                        .toLocaleTimeString()
                        .replace(/:\d{2}\s/, " ")}
                      description={item.note}
                      icon={item.icon}
                      moodColor={item.background}
                      onPress={() =>
                        showDialog(
                          item.create_at
                            .toDate()
                            .toLocaleTimeString()
                            .replace(/:\d{2}\s/, " "),
                          item.icon,
                          item.background,
                          item.note
                        )
                      }
                    />
                  );
                })}
              </ScrollView>
            </List.Section>
          </Card.Content>
        </Card>
      </View>
      <FAB
        style={[styles.fab, { backgroundColor: colors.subtitle }]}
        icon="plus"
        color="#fff"
        onPress={() => navigation.navigate("TrackMood")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: -15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "left",
    marginBottom: -10,
  },
  goal_card: {
    width: 350,
    marginBottom: 15,
  },
  goal_title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: -15,
  },
  dialog: {
    alignItems: "center",
    marginHorizontal: 20,
  },
});

export default MoodScreen;
