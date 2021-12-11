import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { MyButton, MyTextInput, MyErrorMessage } from "../components";

import firebase from "firebase";
import Firebase, { auth, db } from "../config/Firebase";
import Constants from "expo-constants";
import * as Google from "expo-google-app-auth";

import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const SignInScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("test1234@test.com");
  const [password, setPassword] = useState("test1234");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState("eye");
  const [signinError, setSigninError] = useState("");

  const dispatch = useDispatch();

  const handlePasswordVisibility = () => {
    if (rightIcon === "eye") {
      setRightIcon("eye-off");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off") {
      setRightIcon("eye");
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const setWhoSignin = (
    doc_id,
    auth_id,
    username,
    avatarURL,
    firstName,
    lastName,
    birthday,
    gender,
    bookmarks
  ) => {
    dispatch(
      whoSignin(
        doc_id,
        auth_id,
        username,
        avatarURL,
        firstName,
        lastName,
        birthday,
        gender,
        bookmarks
      )
    );
  };

  const onSignin = async () => {
    try {
      if (email !== "" && password !== "") {
        await auth
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            const currentUser = auth.currentUser;
            return db
              .collection("users")
              .where("auth_id", "==", currentUser.uid)
              .limit(1)
              .get()
              .then((findUserResult) => {
                const docList = findUserResult.docs.map((e) => ({
                  ...e.data(),
                  doc_id: e.id,
                }));
                if (docList.length === 0) {
                  console.log("No such document!");
                } else {
                  console.log("have document!");
                  let who = docList[0];
                  setWhoSignin(
                    who.doc_id,
                    who.auth_id,
                    who.username,
                    who.avatarURL,
                    who.firstName,
                    who.lastName,
                    who.birthday.toDate(),
                    who.gender,
                    who.bookmarks
                  );
                }
              });
          })
          .catch((error) => {
            // console.log(error);
            if (
              error.message ===
              "There is no user record corresponding to this identifier. The user may have been deleted."
            ) {
              setSigninError(
                "Don't have record. Please check your email and password or Sign Up first."
              );
            } else {
              setSigninError(error.message);
            }
          });
      } else {
        setSigninError("Please fill up this form.");
      }
    } catch (error) {
      setSigninError(error.message);
    }
  };

  const onGoogleSignin = async () => {
    try {
      //await GoogleSignIn.askForPlayServicesAsync();
      const result = await Google.logInAsync({
        //return an object with result token and user
        iosClientId: Constants.manifest.extra.IOS_KEY, //From app.json
        // androidClientId: Constants.manifest.extra.ANDROIUD_KEY, //From app.json
      });
      if (result.type === "success") {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          //Set the tokens to Firebase
          result.idToken,
          result.accessToken
        );
        return auth
          .signInWithCredential(credential) //Login to Firebase
          .then(() => {
            setIsLoading(true);
            const currentUser = auth.currentUser;
            return db
              .collection("users")
              .where("auth_id", "==", currentUser.uid)
              .limit(1)
              .get()
              .then((findUserResult) => {
                const docList = findUserResult.docs.map((e) => ({
                  ...e.data(),
                  doc_id: e.id,
                }));
                if (docList.length === 0) {
                  console.log("No such document!");
                  return db
                    .collection("users")
                    .add({
                      auth_id: currentUser.uid,
                      username: result.user.name,
                      avatarURL: `https://avatars.dicebear.com/api/micah/${new Date().getTime()}.svg`,
                      bookmarks: [],
                      firstName: "",
                      lastName: "",
                      gender: 3,
                      birthday: null,
                    })
                    .then((docRef) => {
                      // console.log(docRef.id);
                      setWhoSignin(
                        docRef.id,
                        currentUser.uid,
                        result.user.name,
                        `https://avatars.dicebear.com/api/micah/${new Date().getTime()}.svg`,
                        "",
                        "",
                        null,
                        null,
                        []
                      );
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  console.log("have document!");
                  let who = docList[0];
                  if (who.birthday === null) {
                    setWhoSignin(
                      who.doc_id,
                      who.auth_id,
                      who.username,
                      who.avatarURL,
                      who.firstName,
                      who.lastName,
                      null,
                      who.gender,
                      who.bookmarks
                    );
                  } else {
                    setWhoSignin(
                      who.doc_id,
                      who.auth_id,
                      who.username,
                      who.avatarURL,
                      who.firstName,
                      who.lastName,
                      who.birthday.toDate(),
                      who.gender,
                      who.bookmarks
                    );
                  }
                }
              });
          });
      }
    } catch (error) {
      setSigninError(error.message);
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
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>you've been missed !</Text>
          </View>
          <View style={styles.body}>
            {signinError ? (
              <MyErrorMessage error={signinError} visible={true} />
            ) : null}
            <MyTextInput
              inputStyle={{}}
              containerStyle={{
                marginBottom: 20,
              }}
              leftIcon="email"
              placeholder="Enter email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoFocus={false}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <MyTextInput
              inputStyle={{}}
              containerStyle={{
                marginBottom: 20,
              }}
              leftIcon="lock"
              placeholder="Enter password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={passwordVisibility}
              textContentType="password"
              rightIcon={rightIcon}
              value={password}
              onChangeText={(text) => setPassword(text)}
              handlePasswordVisibility={handlePasswordVisibility}
            />
            <MyButton
              onPress={onSignin}
              backgroundColor={colors.primary}
              title="Sign In"
              color="#fff"
              titleSize={16}
              containerStyle={{}}
            />
            <View style={styles.line} />
            <MyButton
              onPress={onGoogleSignin}
              backgroundColor={colors.secondary}
              title="Sign In With Google"
              color="#fff"
              titleSize={16}
              containerStyle={{}}
            />
          </View>
          <View style={styles.footer}>
            <Text style={[styles.footertitle, { color: colors.title }]}>
              Don’t have an account?{" "}
              <Text
                onPress={() => {
                  navigation.navigate("SignUp");
                }}
                style={[styles.signup, { color: colors.secondary }]}
              >
                Sign up
              </Text>
            </Text>
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
    justifyContent: "space-between",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  header: {
    paddingHorizontal: 55,
    marginTop: 100,
    marginBottom: 50,
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 150,
  },
  footer: {
    bottom: 0,
    height: 65,
    backgroundColor: "#FFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 5,
  },
  subtitle: {
    fontWeight: "600",
    fontSize: 20,
    textAlign: "left",
  },
  footertitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  forgot: {
    alignSelf: "flex-end",
    fontSize: 14,
    marginRight: 55,
    marginBottom: 20,
  },
  signup: {
    fontWeight: "600",
  },
  line: {
    height: 2,
    backgroundColor: "#fff",
    width: "75%",
    marginBottom: 15,
  },
});

export default SignInScreen;
