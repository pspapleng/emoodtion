import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MoodScreen from "../screens/MoodScreen";
import TrackMoodScreen from "../screens/TrackMoodScreen";
import TrackDetailScreen from "../screens/TrackDetailScreen";

const TrackMoodStack = createNativeStackNavigator();

export default function MyTrackMoodStack() {
  return (
    <TrackMoodStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: "#FF9EB1",
        headerTransparent: true,
        headerTitle: "",
        headerBackTitleVisible: false,
      }}
      initialRouteName="MoodScreen"
    >
      <TrackMoodStack.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          headerShown: false,
        }}
      />
      <TrackMoodStack.Screen name="TrackMood" component={TrackMoodScreen} />
      <TrackMoodStack.Screen name="Detail" component={TrackDetailScreen} />
    </TrackMoodStack.Navigator>
  );
}
