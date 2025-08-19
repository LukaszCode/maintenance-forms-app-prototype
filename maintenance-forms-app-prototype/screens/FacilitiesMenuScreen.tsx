// Facilities Menu Screen - allows users to access various facility check forms
// User interface is designed for easy navigation and quick access to forms via a set of buttons

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
import { RootStackParamList } from "../App";
import AppHeader from "../components/AppHeader";

type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesMenu">;

const FacilitiesMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // List of facility checks
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
          globalStyles.backButton,
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
            globalStyles.addButton,
          ]}
          onPress={() => alert("Add New Check coming soon")}
        >
          <Text style={globalStyles.secondaryButtonText}>Add New Check</Text>
        </TouchableOpacity>

        {/* Scrollable Facility Checks */}
        <ScrollView style={globalStyles.checkList}>
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

export default FacilitiesMenuScreen;
