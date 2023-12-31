import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Dimensions } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingScreen from "./SettingScreen";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useEffect } from "react";
import {
  requestUserPermission,
  NotificationListener,
} from "../../../../utils/pushnotification_helper";
import { useIsFocused } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function MainHomeScreen({ route, navigation, checkLogin }) {
  const { userID, accessToken } = route.params;
  const isFocused = useIsFocused();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "rgb(45, 83, 129)",
      background: "#2d5381",
      card: "rgb(244, 245, 242)",
    },
  };
  useEffect(() => {
    requestUserPermission();
    // NotificationListener();
  }, []);

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],

    androidClientId:
      "307189795157-ffu87084ubfoge5rvuooedl206hho8qk.apps.googleusercontent.com",
    iosClientId:
      "307189795157-o2k4dt8m0fvfacgv69s9n3ra2i6nm4jt.apps.googleusercontent.com",
  });

  return (
    <NavigationContainer theme={MyTheme} independent={true}>
      {isFocused ? (
        <View style={styles.container}>
          <View style={styles.header}></View>
          <Stack.Navigator initialRouteName="history">
            <Stack.Screen
              initialParams={{
                userID: userID,
                accessToken: accessToken,
              }}
              options={{ headerShown: false }}
              name="history"
            >
              {(props) => (
                <SettingScreen
                  {...props}
                  checkLogin={checkLogin}
                ></SettingScreen>
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </View>
      ) : null}
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
