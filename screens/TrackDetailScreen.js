import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import {
  MyButton,
  MyLeftTextBubble,
  MyRightTextBubble,
  MyTextArea,
} from "../components";

import Firebase, { auth, db } from "../config/Firebase";
import { ARR_QUOTE } from "../data/moodData";

import { useTheme, Dialog, Portal } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const TrackDetailScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [moodQuote, setMoodQuote] = useState("");
  const [textarea, setTextarea] = useState("");
  const [visible, setVisible] = useState(false);

  const username = useSelector((state) => state.user.username);
  const auth_id = useSelector((state) => state.user.auth_id);
  const moodQues = useSelector((state) => state.mood.moodQues);
  const moodAns = useSelector((state) => state.mood.moodAns);
  const moodColor = useSelector((state) => state.mood.moodColor);
  const textColor = useSelector((state) => state.mood.textColor);
  const value = useSelector((state) => state.mood.value);
  const emotion = useSelector((state) => state.mood.emotion);

  useEffect(() => {
    const quote = randomItem(ARR_QUOTE);
    setMoodQuote(quote);
  }, []);

  const randomItem = (items) => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const hideDialog = () => {
    if (auth_id) {
      setVisible(false);
      return db
        .collection("mood")
        .add({
          auth_id: auth_id,
          create_at: new Date(),
          emotion: emotion,
          value: value,
          note: textarea,
        })
        .then(() => {
          navigation.navigate("Mood");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error adding document: ", error);
        });
    } else {
      console.log("error: don't have auth_id");
    }
  };
  const onSave = () => {
    setVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <LinearGradient
            colors={["#FFDEED", "#DAC6F1", "#CAD7EA"]}
            style={styles.background}
          />
          <Dialog.Content>
            <Text style={styles.dialog_text}>{moodQuote}</Text>
          </Dialog.Content>
        </Dialog>
      </Portal>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <MyLeftTextBubble
            backgroundColor={colors.secondary}
            textColor={"white"}
            title={"Hi, " + username}
          />
          <MyLeftTextBubble
            backgroundColor={colors.secondary}
            textColor={"white"}
            title={moodQues}
          />
          <MyRightTextBubble
            backgroundColor={moodColor}
            textColor={textColor}
            title={moodAns}
          />
          <MyLeftTextBubble
            backgroundColor={colors.secondary}
            textColor={"white"}
            title={"What happened, you can tell me"}
          />
          <MyRightTextBubble
            backgroundColor={moodColor}
            textColor={textColor}
            title={". . ."}
          />
          <View style={styles.text_area}>
            <MyTextArea
              onChangeText={(text) => {
                setTextarea(text);
              }}
              defaultValue={textarea}
              maxLength={200}
              placeholder={"Type here . . ."}
              textareaStyle={{ height: 200, margin: 0 }}
              textareaContainerStyle={{
                height: 200,
                borderRadius: 5,
              }}
            />
            <MyButton
              onPress={onSave}
              backgroundColor={colors.secondary}
              title="SAVE"
              color="#fff"
              titleSize={16}
              containerStyle={{
                marginTop: 25,
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    marginTop: 45,
  },
  text_area: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  dialog: {
    height: 240,
    borderRadius: 30,
    justifyContent: "center",
  },
  dialog_text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    margin: 15,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderRadius: 30,
  },
});

export default TrackDetailScreen;
