import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";
import AppHeader from "../components/AppHeader";

type RootStackParamList = {
  Login: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
  MaintenanceChecks: { engineerName: string };
};

type Props = NativeStackScreenProps<RootStackParamList, "MainMenu">;

const MainMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

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

      {/* Card with Test Types */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}>Choose the test type</Text>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.primaryButton]}
          onPress={() =>
            navigation.navigate("FacilitiesMenu", { engineerName })
          }
        >
          <Text style={globalStyles.primaryButtonText}>Facility Checks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.primaryButton]}
          onPress={() =>
            navigation.navigate("MaintenanceChecks", { engineerName })
          }
        >
          <Text style={globalStyles.primaryButtonText}>
            Maintenance Routine Checks
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.button, globalStyles.secondaryButton]}
          onPress={() => alert("Add Check Type coming soon")}
        >
          <Text style={globalStyles.secondaryButtonText}>Add Check Type</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={globalStyles.footer}>All rights reserved.</Text>
    </View>
  );
};

export default MainMenuScreen;
