// This screen contains the facilities check form

import React, { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { globalStyles } from "../styles/globalStyles";

import {
  Inspection,
  Subcheck as InspectionSubcheck,
  Result as InspectionResult,
} from "../../types/models";

export type FacilitiesCheckFormProps = {
  inspection: Inspection;
  onSubmit: (data: Inspection) => void;
};

type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesCheckForm">;

const FacilitiesCheckForm: React.FC<Props> = ({ navigation, route }) => {
  const { inspection, onSubmit } = route.params;

  return (
    <View style={globalStyles.container}>
      <AppHeader title="Facilities Check Form" />
      <ScrollView>
        <TextInput
          placeholder="Inspection Item"
          value={inspection.inspectionItem}
          onChangeText={(text) =>
            onSubmit({ ...inspection, inspectionItem: text })
          }
        />
        {/* Render other form fields based on the inspection object */}
        <TouchableOpacity onPress={() => onSubmit(inspection)}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
