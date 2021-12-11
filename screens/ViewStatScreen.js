import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase, { auth, db } from "../config/Firebase";
import { Card, useTheme } from "react-native-paper";
import { LineChart, ContributionGraph } from "react-native-chart-kit";
import dayjs from "dayjs";

const greyColor = "#c4c4c4";

const ViewStatScreen = () => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [mood, setMood] = useState([]);
  //for keep date existed in database
  const [haveDate, setHaveDate] = useState([]);
  //for render filter contrubute graph
  const [emoodtion, setEmoodtion] = useState(5);
  //for annual graph
  const [month, setMonth] = useState([]);
  const [isMood1Click, setIsMood1Click] = useState(false);
  const [isMood2Click, setIsMood2Click] = useState(false);
  const [isMood3Click, setIsMood3Click] = useState(false);
  const [isMood4Click, setIsMood4Click] = useState(false);
  const [isMood5Click, setIsMood5Click] = useState(true);
  const [selectedMood, setSelectedMood] = useState("Happy Mood");
  const [colorTitle, setColorTitle] = useState(colors.mood5);
  const [config, setConfig] = useState(`rgba(123, 213, 188`);
  const [opa, setOpa] = useState(1);

  useEffect(() => {
    const currentUser = auth.currentUser;
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
          const keepMonth = [];
          const keepDate = [];
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
            keepDate.push(dayjs(create_at).format("YYYY-MM-DD"));
            keepMonth.push(dayjs(create_at).format("YYYY-MM"));
          });
          setMood(user_mood);
          setHaveDate(keepDate);
          setMonth(keepMonth);
          setIsLoading(false);
        }
      );
    return unsubscribe;
  }, []);

  // grey 58, 58, 60
  // primary 255, 158, 177
  // secondary 188, 167, 213
  // mood1 148, 149, 153
  // mood2 135, 173, 201
  // mood3 176, 181, 179 //215, 219, 217
  // mood4 244, 222, 113 //249, 231, 134
  // mood5 123, 213, 188
  let heatmapConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => {
      // console.log(opacity);
      let tempOp = opacity;
      if (isNaN(tempOp)) tempOp = 0.4;
      return config + `, ${tempOp})`;
    },
    labelColor: () => colors.subtitle,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  let lineConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(255, 158, 177, ${opacity})`, // สีพื้นที่ใต้กราฟ
    labelColor: () => colors.subtitle,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0, // optional, defaults to 2dp
    propsForDots: {
      r: "2",
      strokeWidth: "8",
      stroke: colors.primary, // สีจุด
    },
  };

  //remove duplicate
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  let uniqueDate = haveDate.filter(onlyUnique);
  let uniqueMonth = month.filter(onlyUnique);

  let moodOfEachMonth = []; // arr of [mood ทั้งหมด ของเดือนเดียวกัน] => [ [obj], [obj], ...]
  let useAnnual = []; // arr สำหรับใช้ render กราฟเส้น
  const forAnnualGraph = () => {
    for (let i = 0; i < uniqueMonth.length; i++) {
      moodOfEachMonth.push(
        mood.filter(
          (item) =>
            dayjs(item.create_at.toDate()).format("YYYY-MM") == uniqueMonth[i]
        )
      );
    }
    for (let i = 0; i < moodOfEachMonth.length; i++) {
      let moodMonthlength = 0;
      let labels = "";
      let avgMonthValue = 0;
      let data = 0;
      moodOfEachMonth[i].map((item, index) => {
        moodMonthlength = moodOfEachMonth[i].length;
        labels = dayjs(item.create_at.toDate()).format("MMM");
        avgMonthValue += item.value;
      });
      data = avgMonthValue / moodMonthlength; // data สำหรับกราฟเส้น
      useAnnual.push({ labels, data });
      labels = "";
      avgMonthValue = 0;
      data = 0;
    }
  };
  forAnnualGraph();

  //for set annual graph data
  let annualData = {};
  let forLabel = [];
  let forData = [];
  useAnnual.map((item, index) => {
    forLabel.push(item.labels);
    forData.push(item.data);
  });
  annualData = {
    labels: forLabel,
    datasets: [
      {
        data: forData,
        color: (opacity = 1) => `rgba(255, 158, 177, ${opacity})`, //เส้นใน linechart
        strokeWidth: 2,
      },
    ],
  };

  let date = "";
  let count = 0;
  let filterDateMood = [];
  let useConGraph = [];
  const forContributeGraph = () => {
    for (let i = 0; i < uniqueDate.length; i++) {
      filterDateMood.push(
        mood.filter(
          (item) =>
            dayjs(item.create_at.toDate()).format("YYYY-MM-DD") ==
              uniqueDate[i] && item.emotion == emoodtion
        )
      );
    }
    filterDateMood.map((item, index) => {
      item.map((mood, index) => {
        date = dayjs(mood.create_at.toDate()).format("YYYY-MM-DD");
        count = item.length;
      });
      if (date != "" && count != 0) {
        useConGraph.push({ date, count });
      }
      date = "";
      count = 0;
    });
  };

  forContributeGraph();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* upper container for heatmap*/}
      <View style={{ width: 350, marginTop: 80 }}>
        <Card style={{ height: 305 }}>
          <View style={styles.moodIcon}>
            <TouchableOpacity
              onPress={() => {
                setIsMood1Click(true);
                setIsMood2Click(false);
                setIsMood3Click(false);
                setIsMood4Click(false);
                setIsMood5Click(false);
                setSelectedMood("Terrible Mood");
                setEmoodtion(1);
                setColorTitle(colors.mood1);
                setConfig(`rgba(148, 149, 153`);
              }}
            >
              <MaterialCommunityIcons
                name={isMood1Click ? "emoticon-dead" : "emoticon-dead-outline"}
                color={isMood1Click ? colors.mood1 : greyColor}
                size={38}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsMood1Click(false);
                setIsMood2Click(true);
                setIsMood3Click(false);
                setIsMood4Click(false);
                setIsMood5Click(false);
                setSelectedMood("Bad Mood");
                setEmoodtion(2);
                setColorTitle(colors.mood2);
                setConfig(`rgba(135, 173, 201`);
              }}
            >
              <MaterialCommunityIcons
                name={isMood2Click ? "emoticon-sad" : "emoticon-sad-outline"}
                color={isMood2Click ? colors.mood2 : greyColor}
                size={38}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsMood1Click(false);
                setIsMood2Click(false);
                setIsMood3Click(true);
                setIsMood4Click(false);
                setIsMood5Click(false);
                setSelectedMood("Neutral Mood");
                setEmoodtion(3);
                setColorTitle(colors.mood3);
                setConfig(`rgba(176, 181, 179`);
              }}
            >
              <MaterialCommunityIcons
                name={
                  isMood3Click ? "emoticon-neutral" : "emoticon-neutral-outline"
                }
                color={isMood3Click ? "#d7dbd9" : greyColor}
                size={38}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsMood1Click(false);
                setIsMood2Click(false);
                setIsMood3Click(false);
                setIsMood4Click(true);
                setIsMood5Click(false);
                setSelectedMood("Good Mood");
                setEmoodtion(4);
                setColorTitle(colors.mood4);
                setConfig(`rgba(244, 222, 113`);
              }}
            >
              <MaterialCommunityIcons
                name={
                  isMood4Click ? "emoticon-happy" : "emoticon-happy-outline"
                }
                color={isMood4Click ? colors.mood4 : greyColor}
                size={38}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsMood1Click(false);
                setIsMood2Click(false);
                setIsMood3Click(false);
                setIsMood4Click(false);
                setIsMood5Click(true);
                setSelectedMood("Happy Mood");
                setEmoodtion(5);
                setColorTitle(colors.mood5);
                setConfig(`rgba(123, 213, 188`);
              }}
            >
              <MaterialCommunityIcons
                name={isMood5Click ? "emoticon-cool" : "emoticon-cool-outline"}
                color={isMood5Click ? colors.mood5 : greyColor}
                size={38}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.selectedMoodArea}>
            <Text style={[styles.selectedMoodText, { color: colors.subtitle }]}>
              {selectedMood}
            </Text>
          </View>
          <ScrollView
            style={{ marginHorizontal: 15 }}
            horizontal={true}
            showsHorizontalScrollIndicator={true}
          >
            <ContributionGraph
              values={useConGraph}
              horizontal={true}
              numDays={uniqueMonth.length * 31}
              width={18 * ((uniqueMonth.length * 31) / 3.7)}
              squareSize={18}
              height={200}
              chartConfig={heatmapConfig}
            />
          </ScrollView>
        </Card>
      </View>
      {/* lower container for annual graph */}
      <View style={{ width: 350, marginTop: 15 }}>
        <Card style={{ height: 350 }}>
          <View style={styles.overallArea}>
            <Text style={[styles.overallText, { color: colors.subtitle }]}>
              overall
            </Text>
          </View>
          {mood.length != 0 ? (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              style={{ marginHorizontal: 10 }}
            >
              <LineChart
                style={{ marginTop: 15 }}
                data={annualData}
                width={350}
                height={275}
                chartConfig={lineConfig}
                bezier
              />
            </ScrollView>
          ) : null}
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  moodIcon: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginHorizontal: 15,
  },
  selectedMoodArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  selectedMoodText: {
    fontSize: 18,
    fontWeight: "600",
  },
  overallArea: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 15,
    marginLeft: 20,
  },
  overallText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ViewStatScreen;
