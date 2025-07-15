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
import { globalStyles } from "../styles/globalStyles";

type RootStackParamList = {
  Login: undefined;
  MainMenu: { engineerName: string };
  FacilitiesMenu: { engineerName: string };
  EmergencyLightForm: { engineerName: string };
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
        <Text style={globalStyles.cardTitle}>Facility Check</Text>

        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.secondaryButton,
            styles.addButton,
          ]}
          onPress={() => alert("Add New Check feature coming soon")}
        >
          <Text style={globalStyles.secondaryButtonText}>Add New Check</Text>
        </TouchableOpacity>

        <ScrollView style={{ width: "100%" }}>
          {facilityChecks.map((check, index) => (
            <TouchableOpacity
              key={index}
              style={[globalStyles.button, globalStyles.primaryButton]}
              onPress={() => {
                if (check === "Emergency Lights Test") {
                  navigation.navigate("EmergencyLightForm", { engineerName });
                } else {
                  alert(`${check} form coming soon`);
                }
              }}
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
    marginBottom: 15,
    width: "100%",
  },
});

export default FacilitiesMenuScreen;
