// This screen contains the facilities check form

import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import AppHeader from "../components/AppHeader";
import { globalStyles } from "../styles/globalStyles";
import {
  User,
  Inspection,
  Site,
  Zone,
  Item,
  Subcheck,
  SubcheckTemplate,
  Result,
  Reading,
  Attachment,
} from "../data-types/models";
import SubcheckToggleRow from "../components/SubcheckToggleRow";
import { api } from "../src/services/apiClient";

type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesCheckForm">;
type SubcheckStatus = "pass" | "fail";

const FacilitiesCheckForm: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // Basic fields
  const [dateString, setDateString] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Basic fields
  const [zoneName, setZoneName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [comment, setComment] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("");
  const [sites, setSites] = useState<{ id: number; name: string }[]>([]);
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // load all sites at mount
    api
      .sites()
      .then((r) => setSites(r.data ?? []))
      .catch(() => setSites([]));
  }, []);

  useEffect(() => {
    // when siteName changes, load zones for that site
    const site = sites.find((s) => s.name === siteName);
    if (!site) {
      setZones([]);
      return;
    }
    api
      .zones(site.id)
      .then((r) => setZones(r.data ?? []))
      .catch(() => setZones([]));
  }, [siteName, sites]);

  useEffect(() => {
    // when zoneName changes, load items for that zone
    const zone = zones.find(z => z.name === zoneName);
    if (!zone || !itemType.trim()) {
      setItems([]);
      return;
    }
    api.items(zone.id).then((r) => setItems(r.data ?? [])).catch(() => setItems([]));
  }, [zoneName, itemType, zones]);

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

  const onSave = async () => {
    if (overall === "fail" && !comment.trim()) {
      Alert.alert(
        "Comment required",
        "Please explain the failing checks before saving."
      );
      return;
    }

    // UI-only payload (names for now; later resolve to IDs + call API)
    const payload = {
      inspectionDate: new Date(dateString).toISOString(),
      inspectionCategory: "Facility" as const,
      itemType,
      itemName,
      siteName,
      zoneName,
      inspectedByName: engineerName,
      subchecks: subchecks.map((s) => ({
        name: s.name,
        subcheckDescription: s.subcheckDescription,
        valueType: s.valueType,
        passCriteria: s.passCriteria,
        status: s.status,
      })),
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
          <Text style={globalStyles.cardTitle}>Inspection Check Form</Text>

          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={globalStyles.input}
                value={dateString}
                onChangeText={setDateString}
              />
            </View>
            <View style={globalStyles.formCol}>
              <Text>Location</Text>
              <TextInput
                style={globalStyles.input}
                value={siteName}
                onChangeText={setSiteName}
                placeholder="Select site…"
              />
            </View>
          </View>

          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Zone</Text>
              <TextInput
                style={globalStyles.input}
                value={zoneName}
                onChangeText={setZoneName}
                placeholder="Select zone…"
              />
            </View>
            <View style={globalStyles.formCol}>
              <Text>Item Type</Text>
              <TextInput
                style={globalStyles.input}
                value={itemType}
                onChangeText={setItemType}
                placeholder="Select item type…"
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
          <View style={globalStyles.formPane}>
            <Text style={globalStyles.formPaneTitle}>
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

export default FacilitiesCheckForm;
