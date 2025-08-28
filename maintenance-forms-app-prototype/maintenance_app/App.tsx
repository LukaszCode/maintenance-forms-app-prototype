// App.tsx
// This file serves as the main entry point for the application
// It interacts with all other components and screens

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

// Screens
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
import FacilitiesMenuScreen from "./screens/FacilitiesMenuScreen";
import MachineSafetyMenuScreen from "./screens/MachineSafetyMenuScreen";
import FacilitiesCheckForm from "./screens/FacilitiesCheckForm";
import MachineSafetyCheckForm from "./screens/MachineSafetyCheckForm";
import { globalStyles } from "./styles/globalStyles";
import { SafeAreaProvider } from "react-native-safe-area-context";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
  MachineSafetyMenu: { engineerName: string };
  FacilitiesCheckForm: { engineerName: string };
  MachineSafetyCheckForm: { engineerName: string };
  EmergencyLightsForm: { engineerName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider style={globalStyles.safeContainer}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false, // Custom headers are used
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen
            name="FacilitiesMenu"
            component={FacilitiesMenuScreen}
          />
          <Stack.Screen
            name="MachineSafetyMenu"
            component={MachineSafetyMenuScreen}
          />
          <Stack.Screen
            name="FacilitiesCheckForm"
            component={FacilitiesCheckForm}
          />
          <Stack.Screen
            name="MachineSafetyCheckForm"
            component={MachineSafetyCheckForm}
          />
          {/* Add more screens as we build them */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
