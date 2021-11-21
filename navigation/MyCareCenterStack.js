import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CareCenterScreen from "../screens/CareCenterScreen";
import CareDetailScreen from "../screens/CareDetailScreen";

const CareCenterStack = createNativeStackNavigator();

export default function MyCareCenterStack() {
  return (
    <CareCenterStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: "#FF9EB1",
        headerTransparent: true,
        headerTitle: "",
        headerBackTitleVisible: false,
      }}
      initialRouteName="CareCenter"
    >
      <CareCenterStack.Screen
        name="CareCenter"
        component={CareCenterScreen}
        options={{
          headerShown: false,
        }}
      />
      <CareCenterStack.Screen name="Detail" component={CareDetailScreen} />
    </CareCenterStack.Navigator>
  );
}
