// Sign Up Screen - allows users to create a new account
// Provides user friendly interface for account creation

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";
import { RootStackParamList } from "../App";
import AppHeader from "../components/AppHeader";
import { api } from "../src/services/apiClient";

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  /**
   * Handles user registration by sending data to the API.
   * @returns A promise that resolves when the registration is complete.
   */
  const handleCreateAccount = async () => {
  if (!firstName || !surname || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }
  try {
    const fullName = `${firstName.trim()} ${surname.trim()}`;
    const username = `${firstName.trim().toLowerCase()}.${surname.trim().toLowerCase()}`; // Auto-generated

    const res = await api.registerUser(email.trim(), password.trim(), fullName);

    if (res?.status !== "success") {
      alert(res?.message || "Registration failed.");
      return;
    }

    alert("Account created successfully. Please log in.");
    navigation.navigate("Login");
  } catch (err: any) {
    alert(`Error: ${err.message || "Registration failed."}`);
  }
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
        <Text style={globalStyles.cardTitle}>Create account</Text>

        {/* Input Row */}
        <View style={globalStyles.inputRow}>
          <View style={globalStyles.inputContainer}>
            <Text>First Name</Text>
            <TextInput
              style={globalStyles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
            />
          </View>
          <View style={globalStyles.inputContainer}>
            <Text>Surname</Text>
            <TextInput
              style={globalStyles.input}
              value={surname}
              onChangeText={setSurname}
              placeholder="Surname"
            />
          </View>
        </View>

        <Text>Email</Text>
        <TextInput
          style={globalStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />

        <Text>Password</Text>
        <TextInput
          style={globalStyles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        {/* Action Buttons */}
        <View style={globalStyles.actionRow}>
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={globalStyles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, globalStyles.primaryButton]}
            onPress={handleCreateAccount}
          >
            <Text style={globalStyles.primaryButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* Login Option */}
        <Text style={globalStyles.loginPrompt}>
          Have an account? Log in using the button below.
        </Text>
        <TouchableOpacity
          style={[globalStyles.button, globalStyles.secondaryButton]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={globalStyles.secondaryButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={globalStyles.footer}>All rights reserved.</Text>
    </View>
  );
};

export default SignUpScreen;
