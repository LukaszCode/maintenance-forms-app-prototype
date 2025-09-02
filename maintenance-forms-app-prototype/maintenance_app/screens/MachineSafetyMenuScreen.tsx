// Machine Menu Screen - provides access to machine safety forms
// This screen allows users to navigate to various machine safety checks

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { globalStyles } from "../styles/globalStyles";
import AppHeader from "../components/AppHeader";

type Props = NativeStackScreenProps<RootStackParamList, "MachineSafetyMenu">;

const MachineSafetyMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // List of machine safety checks
  const machineSafetyChecks = [
    "Print Machine",
    "Die-Cut Machine",
    "Bespoke Finishing Machine",
    "Finishing Machine",
  ];

  const handleCheckPress = (check: string) => {
    if (check === "Print Machine") {
      alert("Navigate to Print Machine Form");
      // navigation.navigate("PrintMachine", { engineerName });
    } else {
      alert(`${check} form is not implemented yet.`);
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Shared header */}
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
      {/* Machine Safety Checks Card */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.cardTitle}> Machine Safety Checks</Text>

        <TouchableOpacity
          style={[
            globalStyles.button,
            globalStyles.secondaryButton,
            globalStyles.addButton,
          ]}
          onPress={() =>
            navigation.navigate("MachineSafetyCheckForm", { engineerName })
          }
        >
          <Text style={globalStyles.secondaryButtonText}>Add New Check</Text>
        </TouchableOpacity>

        {/* Scrollable Machine Safety Checks */}
        <ScrollView style={globalStyles.scrollContainer}>
          {machineSafetyChecks.map((check, index) => (
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

      <View>
        <Text style={globalStyles.footer}> All rights reserved. </Text>
      </View>
    </View>
  );
};

export default MachineSafetyMenuScreen;
