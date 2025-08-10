import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { globalStyles } from "../styles/globalStyles";
import AppHeader from "../components/AppHeader";

type Props = NativeStackScreenProps<RootStackParamList, "MachineSafetyMenu">;

const MachineSafetyMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;
  return (
    <View style={globalStyles.container}>
      <AppHeader
        engineerName={engineerName}
        onSignOut={() => {
          navigation.navigate("Login");
        }}
      />
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

      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}> Machine Safety Checks</Text>
        <Text> Coming soon.</Text>
      </View>

      <View>
        <Text style={globalStyles.footer}> All rights reserved. </Text>
      </View>
    </View>
  );
};

export default MachineSafetyMenuScreen;
