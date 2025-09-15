/**LoginScreen - contains UI for the login page
 * 
 * This screen allows users to log in with their username and password
 * and handles authentication via the API client.
 * 
 * This file is used for user authentication and navigation to the main menu upon successful login.
 * It provides a simple and user-friendly interface for users to enter their credentials.
 * It also includes navigation to the Sign Up screen for new users.
 * 
 * author: Lukasz Brzozowski
 * 
 */

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";
import { RootStackParamList } from "../App";
import AppHeader from "../components/AppHeader";
import { api } from "../src/services/apiClient";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const engineerName = "Guest"; // Default name for header when not logged in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * Handles user login by sending credentials to the API.
   * On success, navigates to the Main Menu screen.
   * @returns A promise that resolves when the login is complete.
   */
  
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await api.login(email, password);
      api.setToken(res.token); // <-- store token in API client

      navigation.navigate("MainMenu", {
        engineerName: res.fullName,
      });
    } catch (error: any) {
      alert(error.message || "Login failed.");
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Shared Header */}
      <AppHeader
        engineerName={engineerName}
        onSignOut={async () => navigation.navigate("Login")}
      />


      {/* Card */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>Log in</Text>

        <Text>Email</Text>
        <TextInput
          style={globalStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
        />

        <Text>Password</Text>
        <TextInput
          style={globalStyles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.primaryButton]}
          onPress={handleLogin}
        >
          <Text style={globalStyles.primaryButtonText}>Log in</Text>
        </TouchableOpacity>

        <Text style={globalStyles.signupText}>
          No account? Sign Up using the button below.
        </Text>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.secondaryButton]}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={globalStyles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={globalStyles.footer}>All rights reserved.</Text>
    </View>
  );
};

export default LoginScreen;
