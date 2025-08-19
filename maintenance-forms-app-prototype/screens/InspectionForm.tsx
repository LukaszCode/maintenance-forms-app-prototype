import React, { useMemo, useState } from "react";
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

export type PassFail = "pass" | "fail";

export type SubcheckConfig = {
  id: string;
  label: string;
};
