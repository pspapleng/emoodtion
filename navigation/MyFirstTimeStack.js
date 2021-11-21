import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MyMainBottomTab from "./MyMainBottomTab";
import FirstTimeScreen from "../screens/FirstTimeScreen";

const FirstTimeStack = createNativeStackNavigator();

export default function MyFirstTimeStack() {
  return (
    <FirstTimeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: "#FF9EB1",
        headerTransparent: true,
        headerTitle: "",
        headerBackTitleVisible: false,
      }}
      initialRouteName="FirstTime"
    >
      <FirstTimeStack.Screen
        name="FirstTime"
        component={FirstTimeScreen}
        options={{
          headerShown: false,
        }}
      />
      <FirstTimeStack.Screen
        name="Main"
        component={MyMainBottomTab}
        options={{
          headerShown: false,
        }}
      />
    </FirstTimeStack.Navigator>
  );
}
