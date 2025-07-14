import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainMenu: { engineerName: string };
};

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/75" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Maintenance Forms App</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={styles.userIcon}
        />
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.loginTitle}>Log in</Text>

        <Text>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
        />

        <Text>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />

        <Button title="Log in" onPress={handleLogin} />

        <Text style={styles.signupText}>
          No account? Sign Up using the button below.
        </Text>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f2f2",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 75,
    height: 75,
  },
  userIcon: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderColor: "#66b2b2",
    borderWidth: 1,
    borderRadius: 10,
  },
  loginTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#00b3b3",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
  },
  signupButton: {
    backgroundColor: "#ccc",
  },
  signupButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },
});

export default LoginScreen;
