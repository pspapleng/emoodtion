import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const ProfileStack = createNativeStackNavigator();

export default function MyProfileStack() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: "#FF9EB1",
        headerTransparent: true,
        headerTitle: "",
        headerBackTitleVisible: false,
      }}
      initialRouteName="ProfileScreen"
    >
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}
