import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import LoginScreen from "./screens/LoginScreen";
import MainMenuScreen from "./screens/MainMenuScreen";
// We'll add FacilitiesMenu soon

// Define navigation parameter types for all screens
export type RootStackParamList = {
  Login: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Hide default header, since you have custom headers in your UI
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        {/* We will add FacilitiesMenu screen after we build it */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
