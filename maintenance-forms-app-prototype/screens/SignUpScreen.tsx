import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "SignUp">;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = () => {
    if (!firstName || !surname || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }
    alert(`Account created for ${firstName} ${surname}`);
    navigation.navigate("Login");
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

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create account</Text>

        {/* Input Fields */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text>Surname</Text>
            <TextInput
              style={styles.input}
              value={surname}
              onChangeText={setSurname}
              placeholder="Surname"
            />
          </View>
        </View>

        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@company.co.uk"
          keyboardType="email-address"
        />

        <Text>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateAccount}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* Login Option */}
        <Text style={styles.loginPrompt}>
          Have an account? Log in using the button below.
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Log in</Text>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 75,
    height: 75,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userIcon: {
    width: 50,
    height: 50,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "#66b2b2",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#ccc",
  },
  createButton: {
    backgroundColor: "#00b3b3",
  },
  backButtonText: {
    fontWeight: "bold",
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loginPrompt: {
    textAlign: "center",
    marginVertical: 15,
  },
  loginButton: {
    backgroundColor: "#ccc",
    alignSelf: "center",
  },
  loginButtonText: {
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },
});

export default SignUpScreen;
