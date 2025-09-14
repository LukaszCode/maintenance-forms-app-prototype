// AppHeader - displays the header for the app with the engineer's name and sign out button
// This component is used across multiple screens to provide a consistent header layout.

import React from "react";
import { View, Text, TouchableOpacity, Image, Alert} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { api } from "../src/services/apiClient";

interface AppHeaderProps {
  engineerName: string;
  onSignOut: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ engineerName, onSignOut }) => {
  const handleSignOut = async () => {
    if (engineerName === "Guest") {
      onSignOut();  //No logout API call for guest users is needed
      return;
    }
    try {
      await api.logout();
    } catch {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
    api.setToken(""); // Clear the token in the API client
    onSignOut();
  };

  return (
    <View style={globalStyles.header}>
      <View style={globalStyles.headerTopRow}>
        <TouchableOpacity
          style={globalStyles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={globalStyles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <View style={globalStyles.userSection}>
          <Text style={globalStyles.userName}>{engineerName}</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={globalStyles.userIcon}
          />
        </View>
      </View>
      <Text style={globalStyles.headerTitle}>Maintenance Forms App</Text>
    </View>
  );
};

export default AppHeader;
