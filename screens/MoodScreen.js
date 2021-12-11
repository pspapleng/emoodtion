import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  MyButton,
  MyIconButton,
  MyMoodList,
  MyGoalList,
  MyTextArea,
} from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Firebase, { auth, db } from "../config/Firebase";

import { Card, List, FAB, Dialog, Portal, useTheme } from "react-native-paper";
import dayjs from "dayjs";

const MoodScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;
  const [today, setToday] = useState(new Date());
  const [todayText, setTodayText] = useState(
    dayjs(today).format("DD MMM YYYY")
  );
  const [mood, setMood] = useState([]);
  const [goal, setGoal] = useState([]);
  const [todayGaol, setTodayGoal] = useState(0);
  const [newGoal, setNewGoal] = useState("");
  const [selectedGoal, setSeltectedGoal] = useState("");
  const [selectedGoalId, setSeltectedGoalId] = useState("");
  const [moodVisible, setMoodVisible] = useState(false);
  const [goalVisible, setGoalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [moodTime, setMoodTime] = useState("");
  const [moodIcon, setMoodIcon] = useState("");
  const [moodBackground, setMoodBackground] = useState("");
  const [moodNote, setMoodNote] = useState("");
  const username = useSelector((state) => state.user.username);

  useEffect(() => {
    const start_day = dayjs()
      .startOf("date")
      .toDate();
    const end_day = dayjs()
      .endOf("date")
      .toDate();
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
          setGoal(user_goal);
          setTodayGoal(user_goal.length);
          setIsLoading(false);
        }
      );
    return unsubscribeMood, unsubscribeGoal;
  }, []);

  const showMoodDialog = (time, icon, color, note) => {
    setMoodTime(time);
    setMoodIcon(icon);
    setMoodBackground(color);
    setMoodNote(note);
    setMoodVisible(true);
  };

  const hideMoodDialog = () => {
    setMoodVisible(false);
  };

  const hideGoalDialog = () => {
    setGoalVisible(false);
    setNewGoal("");
  };

  const hideEditDialog = () => {
    setEditVisible(false);
  };

  const addGoal = () => {
    if (newGoal != "") {
      setNewGoal("");
      setGoalVisible(false);
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
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error adding document: ", error);
        });
    } else {
      Alert.alert("", "fill the blank");
    }
  };

  const selcetGoal = (id, type) => {
    setSeltectedGoalId(id);
    let selected_goal = goal.filter((item) => {
      return item.doc_id == id;
    });
    setSeltectedGoal(selected_goal[0].goal_name);

    if (type == "edit") {
      if (selected_goal[0].checked) {
        Alert.alert("Goal completed", "Can't edit", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        setEditVisible(true);
      }
    } else if (type == "delete") {
      if (selected_goal[0].checked) {
        Alert.alert("Goal completed", "Can't delete", [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
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
      }
    }
  };

  const saveGoal = () => {
    return db
      .collection("goal")
      .doc(selectedGoalId)
      .update({
        goal_name: selectedGoal,
      })
      .then(() => {
        console.log("Document successfully updated!");
        setEditVisible(false);
        setSeltectedGoal("");
        setSeltectedGoalId("");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
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
        <Dialog visible={moodVisible} onDismiss={hideMoodDialog}>
          <Dialog.Content style={[styles.dialog, { color: colors.subtitle }]}>
            <MaterialCommunityIcons
              name={moodIcon}
              size={40}
              color={moodBackground}
              style={{ marginBottom: 5 }}
            />
            <Text>{moodTime}</Text>
            <Text></Text>
            <Text style={styles.subtitle}>{moodNote}</Text>
          </Dialog.Content>
        </Dialog>
        <Dialog visible={goalVisible} onDismiss={hideGoalDialog}>
          <Dialog.Content>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Dialog.Content style={{ height: 260, paddingVertical: 20 }}>
                <MyIconButton
                  name="close"
                  size={35}
                  color={colors.subtitle}
                  onPress={hideGoalDialog}
                  styleIcon={{ marginLeft: 235, marginVertical: -20 }}
                />
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "600",
                    marginTop: -15,
                    width: 200,
                  }}
                >
                  Add Goal
                </Text>
                <MyTextArea
                  onChangeText={(text) => {
                    setNewGoal(text);
                  }}
                  defaultValue={newGoal}
                  maxLength={100}
                  placeholder={"Add your little goal :-)"}
                  textareaStyle={{
                    height: 150,
                    width: 250,
                  }}
                  textareaContainerStyle={{
                    height: 130,
                    width: 280,
                    borderRadius: 5,
                    alignItems: "center",
                    backgroundColor: "#f2f2f2",
                    marginVertical: 10,
                  }}
                />
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <MyButton
                    onPress={addGoal}
                    backgroundColor={colors.secondary}
                    title="ADD GOAL"
                    color="#fff"
                    titleSize={16}
                    containerStyle={{}}
                  />
                </View>
              </Dialog.Content>
            </TouchableWithoutFeedback>
          </Dialog.Content>
        </Dialog>
        <Dialog visible={editVisible} onDismiss={hideEditDialog}>
          <Dialog.Content>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <Dialog.Content style={{ height: 260, paddingVertical: 20 }}>
                <MyIconButton
                  name="close"
                  size={35}
                  color={colors.subtitle}
                  onPress={hideEditDialog}
                  styleIcon={{ marginLeft: 235, marginVertical: -20 }}
                />
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "600",
                    marginTop: -15,
                    width: 200,
                  }}
                >
                  Edit Goal
                </Text>
                <MyTextArea
                  onChangeText={(text) => {
                    setSeltectedGoal(text);
                  }}
                  defaultValue={selectedGoal}
                  maxLength={100}
                  placeholder={"Your little goal :-)"}
                  textareaStyle={{
                    height: 150,
                    width: 250,
                  }}
                  textareaContainerStyle={{
                    height: 130,
                    width: 280,
                    borderRadius: 5,
                    alignItems: "center",
                    backgroundColor: "#f2f2f2",
                    marginVertical: 10,
                  }}
                />
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <MyButton
                    onPress={saveGoal}
                    backgroundColor={colors.secondary}
                    title="SAVE GOAL"
                    color="#fff"
                    titleSize={16}
                    containerStyle={{}}
                  />
                </View>
              </Dialog.Content>
            </TouchableWithoutFeedback>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <View style={{ width: 350, marginBottom: 15 }}>
        <Card style={{ height: 170 }}>
          <Card.Content>
            <Text style={{ marginTop: 5 }}>
              <Text style={[styles.goal_title, { color: colors.title }]}>
                <Text> </Text> Today goal
              </Text>
              {todayGaol >= 2 ? (
                <Text style={{ fontSize: 18 }}> 📍</Text>
              ) : (
                <MyIconButton
                  name="plus"
                  size={30}
                  color={colors.primary}
                  onPress={() => {
                    setGoalVisible(!goalVisible);
                  }}
                  styleIcon={{ marginLeft: 5 }}
                />
              )}
            </Text>
            <List.Section>
              {todayGaol > 0 ? null : (
                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.title, marginLeft: 12 },
                  ]}
                >
                  Don't have goal. Add it!
                </Text>
              )}
              {goal.map((item, index) => {
                return (
                  <MyGoalList
                    key={index}
                    title={item.goal_name}
                    status={item.checked}
                    onPress={() => {
                      db.collection("goal")
                        .doc(item.doc_id)
                        .update({
                          checked: !item.checked,
                        })
                        .then(() => {
                          console.log("Document successfully updated!");
                        })
                        .catch((error) => {
                          // The document probably doesn't exist.
                          console.error("Error updating document: ", error);
                        });
                    }}
                    size={20}
                    onDelete={() => {
                      selcetGoal(item.doc_id, "delete");
                    }}
                    onEdit={() => {
                      selcetGoal(item.doc_id, "edit");
                    }}
                  />
                );
              })}
            </List.Section>
          </Card.Content>
        </Card>
      </View>
      <View style={{ width: 350 }}>
        <Card style={{ height: 490 }}>
          <Card.Content>
            <List.Subheader style={[styles.title, { color: colors.title }]}>
              Hi, {username}
            </List.Subheader>
            <List.Subheader
              style={[styles.subtitle, { color: colors.subtitle }]}
            >
              {todayText}
            </List.Subheader>
            <List.Section style={{ height: 360 }}>
              <ScrollView
                contentContainerStyle={{
                  paddingHorizontal: 5,
                }}
              >
                {mood.map((item, index) => {
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
                        showMoodDialog(
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
    fontSize: 18,
    textAlign: "left",
    marginBottom: -10,
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
    marginBottom: 20,
  },
});

export default MoodScreen;
