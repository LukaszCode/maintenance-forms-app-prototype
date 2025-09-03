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
  const [comment, setComment] = useState("");

  //Dropdown data
  const [sites, setSites] = useState<SiteOption[]>([]);
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemTypeOption[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);

  //Current selections (attach IDs/labels to query dropdowns)
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [selectedItemTypeLabel, setSelectedItemTypeLabel] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  /**
   * This is a placeholder for the item ID.
   * For simplicity, here we just use names and a single hardcoded ID
   */
  const [itemId, setItemId] = useState<number | null>(null);

  const [subchecks, setSubchecks] = useState<SubcheckUI[]>([]);
  /**
   * Load all sites, item types per category at mount.
   * This will fetch the initial data needed for the form.
   * @returns A promise that resolves to the list of sites.
   */
  useEffect(() => {
    (async () => {
      try {
        const sitesRes = await api.sites();
        setSites(sitesRes.data ?? []);
      } catch {
        setSites([]);
      }
      try {
        const typesRes = await api.itemTypes("Facility");
        // API returns: { id, label, category, description }
        setItemTypes(typesRes.data ?? []);
      } catch {
        setItemTypes([]);
      }
    })();
  }, []);

  /**
   * Load zones for the selected site.
   * When the site changes, fetch the zones for that site.
   * @param - The ID of the selected site.
   * @returns A promise that resolves to the list of zones for the selected site.
   */
  useEffect(() => {
    if (!selectedSiteId) {
      setZones([]);
      setSelectedZoneId(null);
      return;
    }
    (async () => {
      try {
        const zonesRes = await api.zones(selectedSiteId);
        setZones(zonesRes.data ?? []);
      } catch {
        setZones([]);
      }
      // changing site resets downstream selections
      setSelectedZoneId(null);
      setItems([]);
      setSelectedItemId(null);
    })();
  }, [selectedSiteId]);

  /**
   * Load items for the selected zone and item type.
   * When zone or itemType changes, load items for that zone (+ optional itemType text filter).
   * If no zone is selected, reset items and selected item.
   * @param zoneId - The ID of the selected zone.
   * @param itemType - The type of the selected item.
   * @returns A promise that resolves to the list of items for the selected zone and item type.
   */
  useEffect(() => {
    if (!selectedZoneId) {
      setItems([]);
      setSelectedItemId(null);
      return;
    }
    (async () => {
      try {
        const itemsRes = await api.items(selectedZoneId, selectedItemTypeLabel || undefined);
        setItems(itemsRes.data ?? []);
      } catch {
        setItems([]);
      }
      setSelectedItemId(null);
    })();
  }, [selectedZoneId, selectedItemTypeLabel]);

  /**
   * Load subcheck templates for the selected item type.
   * When itemType changes, load subcheck templates for that item type (by id)
   * @param itemType - The type of the selected item.
   * @returns A promise that resolves to the list of subcheck templates for the selected item type.
   */
    useEffect(() => {
    if (!selectedItemTypeLabel) {
      setSubchecks([]);
      return;
    }
    const type = itemTypes.find((t) => t.label === selectedItemTypeLabel);
    if (!type) {
      setSubchecks([]);
      return;
    }
    (async () => {
      try {
        const subchecksRes = await api.templatesByTypeId(type.id);
        const subcheckRows = subchecksRes.data ?? [];
        setSubchecks(
          subcheckRows.map((t: any, i: number) => ({
            id: i + 1,
            name: t.name,
            subcheckDescription: t.description ?? "",
            valueType: t.valueType === "TEXT" ? "string" : (t.valueType as "boolean" | "number" | "string"),
            passCriteria: t.passCriteria ?? "",
            mandatory: !!t.mandatory,
            status: "pass",
          }))
        );
      } catch {
        setSubchecks([]);
      }
    })();
  }, [selectedItemTypeLabel, itemTypes]);
  
  /**
   * Get the overall status of the subchecks.
   * This will be "pass" if all subchecks are "pass", otherwise "fail".
   * 
   */
  const overall: "pass" | "fail" = useMemo(
    () => (subchecks.every((s) => s.status === "pass") ? "pass" : "fail"),
    [subchecks]
  );
  /**
   * Toggle the status of a subcheck.
   * @param id - The ID of the subcheck to toggle.
   * @returns A promise that resolves when the toggle is complete.
   */
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

    const toggle = (id: number) =>
    setSubchecks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "pass" ? "fail" : "pass" } : s))
    );

    const onSave = async () => {
      try {

      }
    }

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
