import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Dimensions } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoryScreen from "./HistoryScreen";
import DetailTicket from "../HomeScreens/DetailTicket/MainScreen";

const Stack = createNativeStackNavigator();

export default function MainHomeScreen({ route, navigation }) {
  const { userID, accessToken } = route.params;
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "rgb(45, 83, 129)",
      background: "#2d5381",
      card: "rgb(244, 245, 242)",
    },
  };
  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      <View style={styles.container}>
        <View style={styles.header}></View>
        <Stack.Navigator initialRouteName="history">
          <Stack.Screen
            initialParams={{ userID: userID, accessToken: accessToken }}
            options={{ headerShown: false }}
            name="history"
            component={HistoryScreen}
          />
          <Stack.Screen
            initialParams={{ userID: userID, accessToken: accessToken }}
            options={{ headerShown: false }}
            name="DetailTicket"
            component={DetailTicket}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  header: {
    backgroundColor: "#2d5381",
    width: "100%",
    height: "40%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    position: "absolute",
    top: 0,
  },
});
