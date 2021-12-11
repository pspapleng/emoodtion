import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MyMoodList } from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase, { auth, db } from "../config/Firebase";
import { Card, List, Dialog, Portal, useTheme } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

const DashboardScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;
  const [mood, setMood] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    dayjs(new Date()).format("DD MMM YYYY")
  );
  const [haveDate, setHaveDate] = useState([]);
  const [pickedDate, setPickedDate] = useState(
    dayjs(currentDate).format("YYYY-MM-DD")
  );
  const [moodVisible, setMoodVisible] = useState(false);
  const [moodTime, setMoodTime] = useState("");
  const [moodIcon, setMoodIcon] = useState("");
  const [moodBackground, setMoodBackground] = useState("");
  const [moodNote, setMoodNote] = useState("");

  useEffect(() => {
    const unsubscribe = db
      .collection("mood")
      .where("auth_id", "==", currentUser.uid)
      .orderBy("create_at", "asc")
      .onSnapshot(
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          const user_mood = [];
          const createDate = [];
          querySnapshot.forEach((doc) => {
            let icon = "default";
            let background = "black";
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
            let create_at = doc.data().create_at.toDate();
            createDate.push(dayjs(create_at).format("YYYY-MM-DD"));
          });
          setMood(user_mood);
          setHaveDate(createDate);
          setIsLoading(false);
        }
      );
    return unsubscribe;
  }, []);

  const picked = (date) => {
    setCurrentDate(dayjs(date).format("DD MMM YYYY"));
    setPickedDate(date);
  };

  //remove duplicate dunction
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  let unique = haveDate.filter(onlyUnique);

  //cal each date acerage emotion
  let moodOfEachDay = []; // arr of [mood ทั้งหมด ของวันเดียวกัน]
  let dayOfMood = ""; // วันที่มี mood จาก moodOfEachDay
  let moodInDay = []; // arr of ค่าเฉลี่ย emotion ของวันที่มี mood
  let avg = 0;
  let background = "";
  let textCol = "";
  let sum = 0;
  const check = () => {
    for (let i = 0; i < unique.length; i++) {
      moodOfEachDay.push(
        mood.filter(
          (item) =>
            dayjs(item.create_at.toDate()).format("YYYY-MM-DD") == unique[i]
        )
      );
    }
    moodOfEachDay.map((moodOfDay, index) => {
      moodOfDay.map((mood, num) => {
        dayOfMood = dayjs(mood.create_at.toDate()).format("YYYY-MM-DD");
        sum += mood.value;
        avg = sum / moodOfDay.length;
      });
      if (avg > 0 && avg <= 20) {
        background = "#949599";
        textCol = "white";
      } else if (avg > 20 && avg <= 40) {
        background = "#87ADC9";
        textCol = "white";
      } else if (avg > 40 && avg <= 60) {
        background = "#ECEEED";
        textCol = colors.subtitle;
      } else if (avg > 60 && avg <= 80) {
        background = "#F9E786";
        textCol = colors.subtitle;
      } else if (avg > 80) {
        background = "#7BD5BC";
        textCol = "white";
      }
      moodInDay.push({ avg, dayOfMood, background, textCol });
      avg = 0;
      sum = 0;
      dayOfMood = "";
      background = "";
      textCol = "";
    });
  };

  check();

  const daysInMonth = dayjs(pickedDate).daysInMonth(); //จำนวนวันในเดือนที่ pickedDate
  const firstDay = dayjs(pickedDate).startOf("months"); //วันแรกของเดือนที่ pickedDate
  let datasource = {}; //สำหรับทำ markedDates
  for (let day = 0; day < daysInMonth; day++) {
    const currentDay = firstDay.add(day, "day").format("YYYY-MM-DD"); //วันที่ +1day ไปเรื่อยๆ จนครบเดือน
    // default marked

    // ckeck == pickedDate
    if (currentDay == pickedDate) {
      datasource[currentDay.toString()] = {
        date: currentDay.toString(),
        customStyles: {
          container: {
            borderColor: colors.subtitle,
            borderWidth: 1,
          },
          text: {
            color: colors.subtitle,
          },
        },
      };
    }
    // ถ้าเป็นวันที่มี mood จะใช้ด้านล่างนี้
    moodInDay.map((item, index) => {
      datasource[item.dayOfMood] = {
        date: item.dayOfMood,
        customStyles: {
          container: {
            backgroundColor: item.background,
            borderColor: colors.subtitle,
          },
          text: {
            color: item.textCol,
          },
        },
      };
      if (item.dayOfMood == pickedDate) {
        // ตรงกับ pickedDate จะมีกรอบ
        datasource[item.dayOfMood] = {
          date: item.dayOfMood,
          customStyles: {
            container: {
              backgroundColor: item.background,
              borderColor: colors.subtitle,
              borderWidth: 1,
            },
            text: {
              color: item.textCol,
            },
          },
        };
      } else {
        // ไม่ตรงกับ pickedDate จะมีสีตาม avg emotion
        datasource[item.dayOfMood] = {
          date: item.dayOfMood,
          customStyles: {
            container: {
              backgroundColor: item.background,
            },
            text: {
              color: item.textCol,
            },
          },
        };
      }
    });
  }

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.bigContainer}>
        <Calendar
          current={pickedDate}
          style={styles.calendar}
          onDayPress={(date) => {
            picked(date.dateString);
          }}
          markingType={"custom"}
          markedDates={datasource}
        />
        <View style={{ width: 350, marginTop: 8 }}>
          <Card style={{ height: 395, backgroundColor: "#f4f4f4" }}>
            <Card.Content>
              <View style={styles.noteContainer}>
                <Text style={[styles.noteDate, { color: colors.subtitle }]}>
                  {currentDate}
                </Text>
                <TouchableOpacity
                  style={[styles.viewStatistics, { color: colors.subtitle }]}
                  onPress={() => {
                    navigation.navigate("ViewStat");
                  }}
                >
                  <Text>
                    <Text>
                      view statistics <Text> </Text>
                    </Text>
                    <MaterialCommunityIcons
                      name="chart-line"
                      size={19}
                      color={colors.subtitle}
                    />
                  </Text>
                </TouchableOpacity>
              </View>
              <List.Section style={{ height: 325 }}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
                  {mood.map((item, index) => {
                    if (
                      dayjs(item.create_at.toDate()).format("DD MMM YYYY") ==
                      currentDate
                    ) {
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
                    }
                  })}
                </ScrollView>
              </List.Section>
            </Card.Content>
          </Card>
        </View>
      </View>
      <Portal>
        <Dialog visible={moodVisible} onDismiss={hideMoodDialog}>
          <Dialog.Content style={[styles.dialog, { color: colors.subtitle }]}>
            <MaterialCommunityIcons
              name={moodIcon}
              size={40}
              color={moodBackground}
              style={{ marginBottom: 5 }}
            />
            <Text>{moodTime} </Text>
            <Text></Text>
            <Text style={styles.subtitle}>{moodNote}</Text>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  calendar: {
    paddingTop: "8%",
    width: 400,
  },
  bigContainer: {
    flex: 1,
    alignItems: "center",
    position: "relative",
    marginVertical: 10,
    marginHorizontal: "2.5%",
  },
  noteContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  noteDate: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewStatistics: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "left",
    marginBottom: -10,
  },
  dialog: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default DashboardScreen;
