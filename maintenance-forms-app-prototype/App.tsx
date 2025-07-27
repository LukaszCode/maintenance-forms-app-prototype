import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import all screens
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
import FacilitiesMenuScreen from "./screens/FacilitiesMenuScreen";
// We will add MaintenanceChecksScreen & EmergencyLightsScreen later

// Define navigation parameter types
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
  MaintenanceChecks: { engineerName: string }; // future use
  EmergencyLights: { engineerName: string }; // future use
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
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
        {/* Add more screens as we build them */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
