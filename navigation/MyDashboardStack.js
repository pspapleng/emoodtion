import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import ViewStatScreen from "../screens/ViewStatScreen";

const ViewStatNavigator = createNativeStackNavigator();

export default function MyDashboardStack() {
  return (
    <ViewStatNavigator.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: "#FF9EB1",
        headerTransparent: true,
        headerBackTitleVisible: false,
      }}
      initialRouteName="Dashboard"
    >
      <ViewStatNavigator.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
        }}
      />
      <ViewStatNavigator.Screen
        name="ViewStat"
        component={ViewStatScreen}
        options={{
          title: "Statistics",
          shadowColor: "transparent",
        }}
      />
    </ViewStatNavigator.Navigator>
  );
}
