// Machine Menu Screen - provides access to machine safety forms
// This screen allows users to navigate to various machine safety checks

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { globalStyles } from "../styles/globalStyles";
import AppHeader from "../components/AppHeader";
import { api } from "../src/services/apiClient";
import { useEffect } from "react";

type Props = NativeStackScreenProps<RootStackParamList, "MachineSafetyMenu">;

const MachineSafetyMenuScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // List of facility checks dynamically fetched from the API
  const [machineSafetyChecks, setMachineSafetyChecks] = React.useState<string[]>([]);

  useEffect(() => {
    const fetchMachineSafetyChecks = async () =>{
      try {
        const res = await api.itemTypes("Machine Safety");
        const labels = res.data?.map((types: { label: any }) => types.label) ?? [];
        setMachineSafetyChecks(labels);
      } catch (error) {
        console.error("Failed to fetch machine safety checks:", error);
        setMachineSafetyChecks([]);
      }
    };

    fetchMachineSafetyChecks();
  }, []);

  /**
   * Opens the form corresponding to the selected machine safety check.
   * @param check - The machine safety check type to open
   * Currently, this function just shows an alert.
   * In a complete implementation, it would navigate to the corresponding form screen.
   */
  
  const openForm = (check: string) => {
    alert(`Navigate to ${check} Form`);
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
              onPress={() => openForm(check)}
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
