// This screen contains the facilities check form

import React, { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  StyleSheet,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";

export type FormValues = {
  inspectionDate: Date;
  site: string;
  zone: string;
  itemType: string;
  itemName: string;
  comments: string;
  photoUri?: string | null;
}

const FacilitiesForm: React.FC<NativeStackScreenProps<RootStackParamList, "FacilitiesCheckForm">> = ({ navigation, route }) => {
  
