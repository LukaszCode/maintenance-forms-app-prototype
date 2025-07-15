import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";

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
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/75" }}
          style={globalStyles.logo}
        />
        <Text style={globalStyles.title}>Maintenance Forms App</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/50" }}
          style={globalStyles.userIcon}
        />
      </View>

      {/* Card */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>Create account</Text>

        {/* Input Row */}
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
        <Text style={styles.loginPrompt}>
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

const styles = StyleSheet.create({
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
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  loginPrompt: {
    textAlign: "center",
    marginVertical: 15,
  },
});

export default SignUpScreen;
