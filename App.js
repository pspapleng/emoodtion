import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { StyleSheet, LogBox } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Routes from "./navigation/index";
import userReducer from "./store/reducers/userReducer";
import moodReducer from "./store/reducers/moodReducer";

const rootReducer = combineReducers({
  user: userReducer,
  mood: moodReducer,
});
const store = createStore(rootReducer);

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF9EB1",
    secondary: "#BCA7D5",
    title: "#020202",
    subtitle: "#30343F",
    error: "#E90404",
    background: "#FFFF",
    mood1: "#949599",
    mood2: "#87ADC9",
    mood3: "#ECEEED",
    mood4: "#F9E786",
    mood5: "#7BD5BC",
  },
};

export default function App() {
  // LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <Routes />
      </Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
