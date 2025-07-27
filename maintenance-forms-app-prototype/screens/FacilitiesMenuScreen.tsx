import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";
import AppHeader from "../components/AppHeader";

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

  const handleCheckPress = (check: string) => {
    if (check === "Emergency Lights Test") {
      alert("Navigate to Emergency Lights Form");
      // navigation.navigate("EmergencyLights", { engineerName });
    } else {
      alert(`${check} form is not implemented yet.`);
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Shared Header */}
      <AppHeader
        engineerName={engineerName}
        onSignOut={() => navigation.navigate("Login")}
      />

      {/* Back Button */}
      <TouchableOpacity
        style={[
          globalStyles.button,
          globalStyles.secondaryButton,
          styles.backButton,
        ]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Facility Check Card */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>Facility Check</Text>

        {/* Add New Check Button */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.secondaryButton,
            styles.addButton,
          ]}
          onPress={() => alert("Add New Check coming soon")}
        >
          <Text style={globalStyles.secondaryButtonText}>Add New Check</Text>
        </TouchableOpacity>

        {/* Scrollable Facility Checks */}
        <ScrollView style={styles.checkList}>
          {facilityChecks.map((check, index) => (
            <TouchableOpacity
              key={index}
              style={[globalStyles.button, globalStyles.primaryButton]}
              onPress={() => handleCheckPress(check)}
            >
              <Text style={globalStyles.primaryButtonText}>{check}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Footer */}
      <Text style={globalStyles.footer}>All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    marginVertical: 10,
    width: 80,
  },
  addButton: {
    width: "50%",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  checkList: {
    maxHeight: 200, // Ensures scroll is visible when there are many buttons
    width: "100%",
  },
});

export default FacilitiesMenuScreen;
