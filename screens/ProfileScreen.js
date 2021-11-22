import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { whoSignin } from "../store/actions/userAction";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { MyButton, MyTextInput, MyAvatar } from "../components";

import Firebase, { auth, db } from "../config/Firebase";

import { useTheme, FAB } from "react-native-paper";
import dayjs from "dayjs";

const ProfileScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;
  const [email, setEmail] = useState(currentUser.email);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [genderIcon, setGenderIcon] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [birthDateText, setBirthDateText] = useState("");
  const [avatar, setAvatar] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .where("auth_id", "==", currentUser.uid)
      .onSnapshot(
        {
          includeMetadataChanges: true,
        },
        (querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            users.push({ ...doc.data(), doc_id: doc.id });
          });
          let who = users[0];
          setName(who.username);
          setAvatar(who.avatarURL);
          setFirstName(who.firstName);
          setLastName(who.lastName);
          if (who.gender == 1) {
            setGender("male");
            setGenderIcon("face");
          } else if (who.gender == 2) {
            setGender("female");
            setGenderIcon("face-woman");
          } else {
            setGender("none");
            setGenderIcon("incognito");
          }
          if (who.birthday != null) {
            setBirthDate(who.birthday.toDate());
            setBirthDateText(dayjs(who.birthday.toDate()).format("D MMM YYYY"));
            dispatch(
              whoSignin(
                who.doc_id,
                who.auth_id,
                who.username,
                who.avatarURL,
                who.firstName,
                who.lastName,
                who.birthday.toDate(),
                who.gender,
                who.bookmarks
              )
            );
          }
          setIsLoading(false);
        }
      );
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut().then(() => {
        return dispatch(
          whoSignin(null, null, null, null, null, null, null, null, null)
        );
      });
    } catch (error) {
      console.log(error);
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
    <View style={styles.screen}>
      <FAB
        style={[styles.fab, { backgroundColor: "transparent" }]}
        icon="account-edit"
        color={colors.subtitle}
        onPress={() => {
          navigation.navigate("EditProfile");
        }}
      />
      <MyAvatar height={110} width={110} color={"#FFF"} uri={avatar} />
      <MyTextInput
        editable={false}
        label="E-mail"
        inputStyle={{}}
        containerStyle={{}}
        placeholder=""
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
      />
      <MyTextInput
        editable={false}
        label="Username"
        inputStyle={{}}
        containerStyle={{}}
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <MyTextInput
        editable={false}
        label="Firstname"
        inputStyle={{}}
        containerStyle={{}}
        placeholder=""
        autoCapitalize="none"
        autoCorrect={false}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <MyTextInput
        editable={false}
        label="Lastname"
        inputStyle={{}}
        containerStyle={{}}
        placeholder=""
        autoCapitalize="none"
        autoCorrect={false}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      <MyTextInput
        editable={false}
        label="Gender"
        inputStyle={{}}
        containerStyle={{}}
        leftIcon={genderIcon}
        placeholder=""
        autoCapitalize="none"
        autoCorrect={false}
        value={gender}
        onChangeText={(text) => setLastName(text)}
      />
      <MyTextInput
        editable={false}
        label="Birthday"
        inputStyle={{}}
        containerStyle={{}}
        placeholder=""
        autoCapitalize="none"
        autoCorrect={false}
        value={birthDateText}
        onChangeText={(text) => setLastName(text)}
      />
      <MyButton
        onPress={handleSignOut}
        backgroundColor={colors.subtitle}
        title="LOGOUT"
        color="#fff"
        titleSize={16}
        containerStyle={{
          marginVertical: 5,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "15%",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    top: -30,
  },
});

export default ProfileScreen;
