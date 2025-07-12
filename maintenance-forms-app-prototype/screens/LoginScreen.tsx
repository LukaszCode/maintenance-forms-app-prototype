/*
This file is part of a Maintenance Forms Application Prototpype 
and is used to handle user login functionality.
It allows users to enter their username and password, and handles the login process.

The screen is usig NativeStackScreenProps 
to manage navigation and screen properties.

*/

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Define the type for the navigation parameters
type RootStackParamList = {
  Login: undefined;
  MainMenu: { engineerName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (name.trim() === "") {
      alert("Error: Please enter your name");
    } else {
      navigation.navigate("MainMenu", { engineerName: name });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Engineer Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 8,
  },
});

export default LoginScreen;
