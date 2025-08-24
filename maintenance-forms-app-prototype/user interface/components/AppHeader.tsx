// AppHeader - displays the header for the app with the engineer's name and sign out button
// This component is used across multiple screens to provide a consistent header layout.

import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface AppHeaderProps {
  engineerName: string;
  onSignOut: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ engineerName, onSignOut }) => {
  return (
    <SafeAreaProvider style={globalStyles.safeContainer}>
      <View style={globalStyles.header}>
        <View style={globalStyles.headerTopRow}>
          <TouchableOpacity
            style={globalStyles.signOutButton}
            onPress={onSignOut}
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
    </SafeAreaProvider>
  );
};

export default AppHeader;
