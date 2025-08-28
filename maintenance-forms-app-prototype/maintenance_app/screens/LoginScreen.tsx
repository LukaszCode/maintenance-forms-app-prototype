// LoginScreen - contains UI for the login page
// This screen allows users to log in with their username and password

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";
import { RootStackParamList } from "../App";
import AppHeader from "../components/AppHeader";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter your username.");
      return;
    }
    navigation.navigate("MainMenu", { engineerName: username });
  };

  return (
    <View style={globalStyles.container}>
      {/* Shared Header */}
      <AppHeader
        engineerName={"Guest"}
        onSignOut={() => navigation.navigate("Login")}
      />

      {/* Card */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>Log in</Text>

        <Text>Username</Text>
        <TextInput
          style={globalStyles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
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
