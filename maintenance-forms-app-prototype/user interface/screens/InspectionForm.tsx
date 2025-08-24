import React, { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
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

const onSubmit = () => {
  // Handle form submission
  console.log("Form submitted");
};
