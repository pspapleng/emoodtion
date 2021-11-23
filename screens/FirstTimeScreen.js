import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { whoSignin } from "../store/actions/userAction";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
} from "react-native";
import { MyButton, MyTextInput, MyErrorMessage, MyAvatar } from "../components";
import Firebase, { auth, db } from "../config/Firebase";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const FirstTimeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useContext(AuthenticatedUserContext);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [avatar, setAvatar] = useState(
    "https://avatars.dicebear.com/api/micah/:seed.svg"
  );

  const dispatch = useDispatch();

  const random = () => {
    setAvatar(
      `https://avatars.dicebear.com/api/micah/${new Date().getTime()}.svg`
    );
  };

  const onSelect = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowPicker(Platform.OS === "ios");
    setBirthDate(currentDate);
  };

  const currentUser = auth.currentUser;

  const onDone = () => {
    if (name != "" && firstName != "" && lastName != "" && gender != "") {
      currentUser
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          // Update successful
          // ...
        })
        .catch((error) => {
          setError(error);
        });
      db.collection("users")
        .add({
          auth_id: currentUser.uid,
          username: name,
          avatarURL: avatar,
          firstName: firstName,
          lastName: lastName,
          birthday: birthDate,
          gender: gender,
          bookmarks: [],
        })
        .then((result) => {
          dispatch(
            whoSignin(
              result.id,
              currentUser.uid,
              name,
              avatar,
              firstName,
              lastName,
              birthDate,
              gender,
              []
            )
          );
          console.log(result.id);
        });
      navigation.navigate("Main");
    } else {
      setError("Please fill up this form.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={["#D1D9E5", "#F0E4EB", "#E8B7D4"]}
        style={styles.background}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <View style={[styles.header, { color: colors.title }]}>
            <Text style={styles.title}>Welcome </Text>
            <Text style={styles.subtitle}>Good to see you here :)</Text>
          </View>
          <View style={styles.body}>
            {error ? <MyErrorMessage error={error} visible={true} /> : null}
            <MyAvatar height={110} width={110} color={"#FFF"} uri={avatar} />
            <MyButton
              onPress={random}
              backgroundColor="transparent"
              title="random"
              tileColor={colors.primary}
              titleSize={16}
              containerStyle={{
                marginBottom: 15,
                width: "25%",
                borderColor: colors.background,
                borderWidth: 2,
              }}
            />
            <MyTextInput
              editable={false}
              inputStyle={{
                fontSize: 16,
              }}
              containerStyle={{
                backgroundColor: "#fff",
                marginBottom: 20,
              }}
              placeholder=""
              autoCapitalize="none"
              autoCorrect={false}
              value={user.email}
            />
            <MyTextInput
              inputStyle={{
                fontSize: 16,
              }}
              containerStyle={{
                backgroundColor: "#fff",
                marginBottom: 20,
              }}
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <MyTextInput
              inputStyle={{
                fontSize: 16,
              }}
              containerStyle={{
                backgroundColor: "#fff",
                marginBottom: 20,
              }}
              placeholder="FirstName"
              autoCapitalize="none"
              autoCorrect={false}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <MyTextInput
              inputStyle={{
                fontSize: 16,
              }}
              containerStyle={{
                backgroundColor: "#fff",
                marginBottom: 20,
              }}
              placeholder="LastName"
              autoCapitalize="none"
              autoCorrect={false}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
            <View style={styles.inputarea}>
              <Text style={styles.intputtitle}>gender</Text>
              <RadioButton
                value="1"
                status={gender === "1" ? "checked" : "unchecked"}
                onPress={() => setGender("1")}
                color={colors.title}
              />
              <Pressable onPress={() => setGender("1")}>
                <MaterialCommunityIcons name="face" color="black" size={30} />
              </Pressable>
              <RadioButton
                value="2"
                status={gender === "2" ? "checked" : "unchecked"}
                onPress={() => setGender("2")}
                color={colors.title}
              />
              <Pressable onPress={() => setGender("2")}>
                <MaterialCommunityIcons
                  name="face-woman"
                  color="black"
                  size={30}
                />
              </Pressable>
              <RadioButton
                value="3"
                status={gender === "3" ? "checked" : "unchecked"}
                onPress={() => setGender("3")}
                color={colors.title}
              />
              <Pressable onPress={() => setGender("3")}>
                <MaterialCommunityIcons
                  name="incognito"
                  color="black"
                  size={30}
                />
              </Pressable>
            </View>
            <View style={styles.inputarea}>
              <Text style={styles.intputtitle}>birthday</Text>
              <DateTimePicker
                style={styles.datepicker}
                testID="dateTimePicker"
                value={birthDate}
                mode="date"
                is24Hour={true}
                display="default"
                maximumDate={new Date()}
                onChange={onSelect}
              />
            </View>
            <MyButton
              onPress={onDone}
              backgroundColor={colors.primary}
              title="DONE"
              color="#fff"
              titleSize={16}
              containerStyle={{
                marginBottom: 60,
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
    justifyContent: "space-around",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  inputarea: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    marginBottom: 20,
  },
  intputtitle: {
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 10,
    paddingRight: 30,
  },
  datepicker: {
    width: 130,
    flex: 1,
    marginLeft: 10,
  },
});

export default FirstTimeScreen;
