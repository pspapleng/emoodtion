import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { whoSignin } from "../store/actions/userAction";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import {
  MyButton,
  MyTextInput,
  MyErrorMessage,
  MyIconButton,
  MyAvatar,
} from "../components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Firebase, { auth, db } from "../config/Firebase";

import { useTheme, RadioButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [error, setError] = useState("");
  const currentUser = auth.currentUser;
  const [email, setEmail] = useState(currentUser.email);
  const [name, setName] = useState(useSelector((state) => state.user.username));
  const [firstName, setFirstName] = useState(
    useSelector((state) => state.user.firstName)
  );
  const [lastName, setLastName] = useState(
    useSelector((state) => state.user.lastName)
  );
  const [gender, setGender] = useState(
    useSelector((state) => state.user.gender)
  );
  const [birthDate, setBirthDate] = useState(
    new Date(useSelector((state) => state.user.birthday))
  );
  const [showPicker, setShowPicker] = useState(false);
  const [avatar, setAvatar] = useState(
    useSelector((state) => state.user.avatarURL)
  );

  const doc_id = useSelector((state) => state.user.doc_id);
  const bookmarks = useSelector((state) => state.user.bookmarks);
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

  const onSave = () => {
    console.log();
    if (name != "" && firstName != "" && lastName != "" && gender != "") {
      currentUser
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          return db
            .collection("users")
            .doc(doc_id)
            .update({
              username: name,
              avatarURL: avatar,
              firstName: firstName,
              lastName: lastName,
              birthday: birthDate,
              gender: gender,
              bookmarks: bookmarks,
            })
            .then(() => {
              console.log("Document successfully updated!");
              dispatch(
                whoSignin(
                  doc_id,
                  currentUser.uid,
                  name,
                  avatar,
                  firstName,
                  lastName,
                  birthDate,
                  gender,
                  bookmarks
                )
              );
              navigation.navigate("Profile");
            })
            .catch((error) => {
              console.error("Error updating document: ", error);
            });
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      setError("Please fill up this form.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <View style={[styles.header, { color: colors.title }]}>
            <Text style={styles.subtitle}>Edit Profile </Text>
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
                width: "25%",
                borderColor: colors.background,
                borderWidth: 2,
              }}
            />
            <MyTextInput
              editable={false}
              inputStyle={{}}
              containerStyle={{
                backgroundColor: "#fff",
                opacity: 0.5,
                marginBottom: 20,
              }}
              placeholder=""
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
            />
            <MyTextInput
              inputStyle={{}}
              containerStyle={{
                marginBottom: 20,
              }}
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <MyTextInput
              inputStyle={{}}
              containerStyle={{
                marginBottom: 20,
              }}
              placeholder="FirstName"
              autoCapitalize="none"
              autoCorrect={false}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            <MyTextInput
              inputStyle={{}}
              containerStyle={{
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
              onPress={onSave}
              backgroundColor={colors.secondary}
              title="SAVE"
              color="#fff"
              titleSize={16}
              containerStyle={{
                marginBottom: 30,
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
    marginTop: 60,
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
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

export default EditProfileScreen;
