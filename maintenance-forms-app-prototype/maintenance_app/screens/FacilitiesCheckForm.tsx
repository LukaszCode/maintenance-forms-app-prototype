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
import { Picker } from "@react-native-picker/picker";
import { RootStackParamList } from "../App";
import AppHeader from "../components/AppHeader";
import { globalStyles } from "../styles/globalStyles";
import SubcheckToggleRow from "../components/SubcheckToggleRow";
import { api } from "../src/services/apiClient";
import { validateAndBuildInspectionPayload, SubcheckUI } from "../business-logic/validation/formValidation";
import {
  validateSubcheck,
  calculateOverallStatus,
  requireCommentIfFailed,
} from "../business-logic/validation/subcheckValidation";

type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesCheckForm">;

type SiteOption = { id: number; name: string };
type ZoneOption = { id: number; name: string };
type ItemTypeOption = { id: number; label: string; category: string; description?: string };
type ItemOption = { id: number; name: string; description?: string; zone_id: number; item_type: string };

const FacilitiesCheckForm: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // Basic fields
  const [dateString, setDateString] = useState(new Date().toISOString().slice(0, 10));
  const [siteName, setSiteName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemName, setItemName] = useState("");

  const [comment, setComment] = useState("");

  /**
   * This is a placeholder for the item ID.
   * For simplicity, here we just use names and a single hardcoded ID
   */
  const [itemId, setItemId] = useState<number | null>(null);


  //Derived fields 
  const [sites, setSites] = useState<{ id: number; name: string }[]>([]);
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [items, setItems] = useState<{ id: number; name: string }[]>([]);
  const [subchecks, setSubchecks] = useState<{ id: number; name: string; subcheckDescription: string; valueType: string; passCriteria: string; status: "pass" | "fail"; }[]>([]);

  /**
   * Load all sites at mount.
   * This will be called when the component is first rendered.
    * @returns A promise that resolves to the list of sites.
   */
  useEffect(() => {
    // load all sites at mount
    api.sites().then((r) => setSites(r.data ?? [])).catch(() => setSites([]));
  }, []);

  /**
   * Load zones for the selected site.
   * This will be called whenever the siteName changes.
   * @param siteName - The name of the selected site.
   * @returns A promise that resolves to the list of zones for the selected site.
   */
  useEffect(() => {
    // when siteName changes, load zones for that site
    const site = sites.find((s) => s.name === siteName);
    if (!site) {
      setZones([]);
      return;
    }
    api.zones(site.id).then((r) => setZones(r.data ?? [])).catch(() => setZones([]));
  }, [siteName, sites]);

  /**
   * Load items for the selected zone and item type.
   * This will be called whenever the zoneName or itemType changes.
   * @param zoneName - The name of the selected zone.
   * @param itemType - The type of the selected item.
   * @returns A promise that resolves to the list of items for the selected zone and item type.
   */
  useEffect(() => {
    // when zoneName changes, load items for that zone
    const zone = zones.find(z => z.name === zoneName);
    if (!zone || !itemType.trim()) {
      setItems([]);
      return;
    }
    api.items(zone.id).then((r) => setItems(r.data ?? [])).catch(() => setItems([]));
  }, [zoneName, itemType, zones]);


  /**
   * Load subcheck templates for the selected item type.
   * This will be called whenever the itemType changes.
   * @param itemType - The type of the selected item.
   * @returns A promise that resolves to the list of subcheck templates for the selected item type.
   */
  useEffect(() => {
    if (!itemType.trim()) {
      return;
    }
    api.templatesByLabel(itemType).then((response) => {
      const rows = response.data ?? [];
      if (rows.length === 0) {
        return;
      }
      setSubchecks(rows.map((t: any, i: number) => ({
        id: i + 1,
        name: t.name,
        subcheckDescription: t.description,
        valueType: t.valueType,
        passCriteria: t.passCriteria,
        status: "pass",
      })));
    }).catch(() => {});
  }, [itemType]);

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
                name={s.name}
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
