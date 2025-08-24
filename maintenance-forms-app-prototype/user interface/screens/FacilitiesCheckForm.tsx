// This screen contains the facilities check form

// screens/FacilitiesCheckFormScreen.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import AppHeader from "../components/AppHeader";
import { globalStyles } from "../styles/globalStyles";
import SubcheckToggleRow from "../components/SubcheckToggleRow";

type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesCheckForm">;
type SubcheckStatus = "pass" | "fail";

type SubcheckVM = {
  id: number;
  label: string;
  mandatory?: boolean;
  status: SubcheckStatus;
};

const FacilitiesCheckFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // Basic fields
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));
  const [siteName, setSiteName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [itemType, setItemType] = useState("Emergency Lighting");
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");

  // Subchecks (MVP static; later load from DB)
  const [subchecks, setSubchecks] = useState<SubcheckVM[]>(() => [
    {
      id: 1,
      label: "Function test – all luminaires illuminate",
      mandatory: true,
      status: "pass",
    },
    { id: 2, label: "Recharge indicator working", status: "pass" },
    { id: 3, label: "Labels/ID present and legible", status: "pass" },
    { id: 4, label: "No visible damage or faults", status: "pass" },
  ]);

  const overall: "pass" | "fail" = useMemo(
    () => (subchecks.every((s) => s.status === "pass") ? "pass" : "fail"),
    [subchecks]
  );

  const toggle = (id: number) =>
    setSubchecks((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "pass" ? "fail" : "pass" }
          : s
      )
    );

  const onSave = () => {
    if (overall === "fail" && !comment.trim()) {
      Alert.alert(
        "Comment required",
        "Please explain the failing checks before saving."
      );
      return;
    }

    // UI-only payload (names for now; later resolve to IDs + call API)
    const payload = {
      inspectionDate: dateStr,
      inspectionCategory: "Facility" as const,
      itemType,
      itemName,
      siteName,
      zoneName,
      inspectedByName: engineerName,
      subchecks: subchecks.map((s) => ({ label: s.label, status: s.status })),
      overall,
      comment: comment || null,
    };
    console.log("Facilities payload", payload);
    Alert.alert("Saved", `Overall: ${overall.toUpperCase()}`);
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <AppHeader
        engineerName={engineerName}
        onSignOut={() => navigation.navigate("Login")}
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

      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>
            Emergency Light Monthly Check
          </Text>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={globalStyles.input}
                value={dateStr}
                onChangeText={setDateStr}
              />
            </View>
            <View style={styles.col}>
              <Text>Location</Text>
              <TextInput
                style={globalStyles.input}
                value={siteName}
                onChangeText={setSiteName}
                placeholder="Select site…"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Zone</Text>
              <TextInput
                style={globalStyles.input}
                value={zoneName}
                onChangeText={setZoneName}
                placeholder="Select zone…"
              />
            </View>
            <View style={styles.col}>
              <Text>Item Type</Text>
              <TextInput
                style={globalStyles.input}
                value={itemType}
                onChangeText={setItemType}
                placeholder="Emergency Lighting"
              />
            </View>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text>Item Name</Text>
            <TextInput
              style={globalStyles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g. EL-01"
            />
          </View>

          {/* Subchecks */}
          <View style={styles.subPane}>
            <Text style={styles.subPaneTitle}>
              Choose completed safety tests
            </Text>
            {subchecks.map((s) => (
              <SubcheckToggleRow
                key={s.id}
                label={s.label}
                value={s.status}
                onToggle={() => toggle(s.id)}
                mandatory={s.mandatory}
              />
            ))}
          </View>

          {/* Overall + Comment */}
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>
            Overall:{" "}
            <Text style={{ color: overall === "pass" ? "#2a9d9d" : "#c0392b" }}>
              {overall.toUpperCase()}
            </Text>
          </Text>

          <Text>
            Comment{" "}
            {overall === "fail" ? (
              <Text style={{ color: "#b00020" }}>*</Text>
            ) : null}
          </Text>
          <TextInput
            style={[
              globalStyles.input,
              { height: 120, textAlignVertical: "top" },
            ]}
            value={comment}
            onChangeText={setComment}
            placeholder="Explain failing checks…"
            multiline
          />

          {/* Actions */}
          <View style={[globalStyles.actionRow, { marginTop: 8 }]}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.secondaryButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.primaryButton]}
              onPress={onSave}
            >
              <Text style={globalStyles.primaryButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={globalStyles.footer}>All rights reserved.</Text>
      </ScrollView>
    </View>
  );
};

export default FacilitiesCheckFormScreen;

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  col: { flex: 1 },
  subPane: {
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  subPaneTitle: { textAlign: "center", fontWeight: "600", marginBottom: 10 },
});
