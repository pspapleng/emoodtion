import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

import DashboardScreen from "../screens/DashboardScreen";
import CareCenterScreen from "../screens/CareCenterScreen";
import ProfileScreen from "../screens/ProfileScreen";

import MyTrackMoodStack from "./MyTrackMoodStack";
import MyProfileStack from "./MyProfileStack";

const MainBottomTab = createMaterialBottomTabNavigator();

export default function MyMainBottomTab() {
  const { colors } = useTheme();

  return (
    <MainBottomTab.Navigator
      initialRouteName="MyMood"
      activeColor="#FFFFFF"
      inactiveColor="#FFDEED"
      barStyle={{ backgroundColor: colors.primary }}
    >
      <MainBottomTab.Screen
        name="MyMood"
        component={MyTrackMoodStack}
        options={{
          tabBarLabel: "Mood",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="emoticon-happy-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <MainBottomTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chart-timeline-variant"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <MainBottomTab.Screen
        name="CareCenter"
        component={CareCenterScreen}
        options={{
          tabBarLabel: "Care Center",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="heart-half-full"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <MainBottomTab.Screen
        name="MyProfile"
        component={MyProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </MainBottomTab.Navigator>
  );
}
