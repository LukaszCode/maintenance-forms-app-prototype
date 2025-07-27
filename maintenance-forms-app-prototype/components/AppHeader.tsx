import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { globalStyles } from "../styles/globalStyles";

interface AppHeaderProps {
  engineerName: string;
  onSignOut: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ engineerName, onSignOut }) => {
  return (
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
  );
};

export default AppHeader;
