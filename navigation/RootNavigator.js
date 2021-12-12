import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";
import Firebase, { auth } from "../config/Firebase";
import { AuthenticatedUserContext } from "./AuthenticatedUserProvider";
import MyFirstTimeStack from "./MyFirstTimeStack";
import MyAuthStack from "./MyAuthStack";
import MyMainBottomTab from "./MyMainBottomTab";

export default function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(
      async (authenticatedUser) => {
        try {
          await (authenticatedUser
            ? setUser(authenticatedUser)
            : setUser(null));
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    );
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      {user ? (
        user.providerData[0].displayName == null ? (
          <MyFirstTimeStack />
        ) : (
          <MyMainBottomTab />
        )
      ) : (
        <MyAuthStack />
      )}
    </NavigationContainer>
  );
}
