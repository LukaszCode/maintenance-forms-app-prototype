import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { globalStyles } from "../styles/globalStyles";

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
      {/* Header */}
      <View style={globalStyles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/75" }}
          style={globalStyles.logo}
        />
        <Text style={globalStyles.title}>Maintenance Forms App</Text>
        <View style={globalStyles.userSection}>
          <TouchableOpacity
            style={[
              globalStyles.button,
              globalStyles.secondaryButton,
              { padding: 6 },
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ fontSize: 12 }}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={globalStyles.userName}>{engineerName}</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={globalStyles.userIcon}
          />
        </View>
      </View>

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

      {/* Card */}
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
          onPress={() => alert("Add Check Type feature coming soon")}
        >
          <Text style={globalStyles.secondaryButtonText}>Add Check Type</Text>
        </TouchableOpacity>
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
});

export default MainMenuScreen;
