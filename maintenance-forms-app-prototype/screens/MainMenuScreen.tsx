import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "MainMenu">;

const MainMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/75" }}
          style={styles.logo}
        />
        <Text style={styles.title}>Maintenance Forms App</Text>
        <View style={styles.userSection}>
          <Text style={styles.userName}>{engineerName}</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.userIcon}
          />
        </View>
      </View>

      {/* Card with buttons */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Choose the test type</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#00b3b3" }]}
          onPress={() =>
            navigation.navigate("FacilitiesMenu", { engineerName })
          }
        >
          <Text style={styles.buttonText}>Facility Checks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#66cccc" }]}
          onPress={() => alert("Maintenance Routine Checks coming soon")}
        >
          <Text style={styles.buttonText}>Maintenance Routine Checks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.disabledButton]}
          onPress={() => alert("Add Check Type not implemented yet")}
        >
          <Text style={styles.disabledButtonText}>Add Check Type</Text>
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
    backgroundColor: "#2a9d9d",
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
    color: "#fff",
  },
  userSection: {
    alignItems: "center",
  },
  userName: {
    color: "#fff",
    marginBottom: 5,
  },
  userIcon: {
    width: 50,
    height: 50,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "#e6f2f2",
    borderWidth: 1,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  disabledButtonText: {
    color: "#333",
    fontSize: 16,
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
});

export default MainMenuScreen;
