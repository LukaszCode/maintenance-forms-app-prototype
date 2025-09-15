// Facilities Menu Screen - allows users to access various facility check forms
// User interface is designed for easy navigation and quick access to forms via a set of buttons

import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";
import { RootStackParamList } from "../App";
import AppHeader from "../components/AppHeader";
import { api } from "../src/services/apiClient";

type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesMenu">;

const FacilitiesMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // List of facility checks dynamically fetched from the API
  const [facilityChecks, setFacilityChecks] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchFacilityChecks = async () => {
      try {
        const res = await api.itemTypes("Facility");
        const labels = res.data?.map((types: { label: any }) => types.label) ?? [];
        setFacilityChecks(labels);
      } catch (error) {
        console.error("Failed to fetch facility checks:", error);
        setFacilityChecks([]);
      }
    };

    fetchFacilityChecks();
  }, []);

  /**
   * Opens the form corresponding to the selected facility check.
   * @param check - The facility check type to open
   * Currently, this function just shows an alert.
   * In a complete implementation, it would navigate to the corresponding form screen.
   */
  
  const openForm = (check: string) => {
    alert(`Navigate to ${check} Form`);
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
        <Text style={globalStyles.cardTitle}>Facility Checks</Text>

        {/* New Check Button */}
        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.secondaryButton,
            globalStyles.addButton,
          ]}
          onPress={() =>
            navigation.navigate("FacilitiesCheckForm", { engineerName })
          }
        >
          <Text style={globalStyles.secondaryButtonText}>New Check</Text>
        </TouchableOpacity>

        {/* Scrollable Facility Checks */}
        <ScrollView style={globalStyles.scrollContainer}>
          {facilityChecks.map((check, index) => (
            <TouchableOpacity
              key={index}
              style={[globalStyles.button, globalStyles.primaryButton]}
              onPress={() => openForm(check)}
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
