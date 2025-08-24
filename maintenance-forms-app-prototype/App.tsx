// App.tsx
// This file serves as the main entry point for the application
// It interacts with all other components and screens

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Screens
import LoginScreen from "./user interface/screens/LoginScreen";
import SignUpScreen from "./user interface/screens/SignUpScreen";
import MainMenuScreen from "./user interface/screens/MainMenuScreen";
import FacilitiesMenuScreen from "./user interface/screens/FacilitiesMenuScreen";
import MachineSafetyMenuScreen from "./user interface/screens/MachineSafetyMenuScreen";
// import EmergencyLightsFormScreen from "./screens/EmergencyLightsFormScreen";
// import MachineSafetyFormScreen from "./screens/MachineSafetyFormScreen";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
  MachineSafetyMenu: { engineerName: string };
  FacilitiesCheckForm: { engineerName: string };
  EmergencyLightsForm: { engineerName: string };
  MachineSafetyForm: { engineerName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // We are using custom headers
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="FacilitiesMenu" component={FacilitiesMenuScreen} />
        <Stack.Screen
          name="MachineSafetyMenu"
          component={MachineSafetyMenuScreen}
        />
        {/* Add more screens as we build them */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
