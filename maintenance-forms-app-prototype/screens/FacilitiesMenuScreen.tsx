import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Login: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesMenu">;

const FacilitiesMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  const facilityChecks = [
    "Air Conditioning Check",
    "BIO Waste Treatment Plant Check",
    "Emergency Lights Test",
    "Fire Exits Inspection",
    "Fire Extinguisher Inspection",
    "Fire Test",
    "Ladder Log",
    "Legionella Check",
    "Pest Control Check",
    "Racking Inspection",
  ];

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

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Facility Check</Text>

        <TouchableOpacity
          style={[styles.addCheckButton]}
          onPress={() => alert("Add New Check not implemented yet")}
        >
          <Text style={styles.addCheckText}>Add New Check</Text>
        </TouchableOpacity>

        <ScrollView style={styles.checkList}>
          {facilityChecks.map((check, index) => (
            <TouchableOpacity
              key={index}
              style={styles.checkButton}
              onPress={() => {
                if (check === "Emergency Lights Test") {
                  alert("Navigate to Emergency Lights form soon!");
                } else {
                  alert(`${check} form coming soon`);
                }
              }}
            >
              <Text style={styles.checkButtonText}>{check}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  backButton: {
    backgroundColor: "#ccc",
    width: 80,
    padding: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  backButtonText: {
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    borderColor: "#e6f2f2",
    borderWidth: 1,
    alignItems: "center",
    maxHeight: 400,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addCheckButton: {
    borderWidth: 1,
    borderColor: "#333",
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  addCheckText: {
    fontWeight: "bold",
  },
  checkList: {
    width: "100%",
  },
  checkButton: {
    backgroundColor: "#00b3b3",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  checkButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
});

export default FacilitiesMenuScreen;
