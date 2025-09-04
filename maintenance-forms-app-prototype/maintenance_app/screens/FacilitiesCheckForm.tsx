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
import { validateAndBuildFormPayload, SubcheckUI } from "../business-logic/validation/formValidation";



type Props = NativeStackScreenProps<RootStackParamList, "FacilitiesCheckForm">;

type Named = { id: number; name: string };
type ItemName = { id: number; label: string; category: string; description?: string };
type ItemRow = { id: number; name: string; description?: string; zone_id: number; item_type: string };

const FacilitiesCheckForm: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // Basic fields
  const [dateString, setDateString] = useState(new Date().toISOString().slice(0,10));
  const [siteName, setSiteName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [itemTypeLabel, setItemTypeLabel] = useState("Emergency Lighting");
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");


  //Dropdown data
  const [sites, setSites] = useState<Named[]>([]);
  const [zones, setZones] = useState<Named[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [subchecks, setSubchecks] = useState<SubcheckUI[]>([]);

 

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
    api.sites().then(r => setSites(r.data ?? [])).catch(() => setSites([]));
    api.itemTypes("Facility").then(r => setItemTypes(r.data ?? [])).catch(() => setItemTypes([]));
  }, []);

  /**
   * Load zones for the selected site.
   * When the site changes, fetch the zones for that site.
   * @param - The ID of the selected site.
   * @returns A promise that resolves to the list of zones for the selected site.
   */
  useEffect(() => {
    const site = sites.find(s => s.name === siteName);
    if (!site) { setZones([]); return; }
    api.zones(site.id).then(r => setZones(r.data ?? [])).catch(() => setZones([]));
  }, [siteName, sites]);

  /**
   * Load items for the selected zone and item type.
   * When zone or itemType changes, load items for that zone (+ optional itemType text filter).
   * If no zone is selected, reset items and selected item.
   * @param zoneId - The ID of the selected zone.
   * @param itemType - The type of the selected item.
   * @returns A promise that resolves to the list of items for the selected zone and item type.
   */
  useEffect(() => {
    const zone = zones.find(z => z.name === zoneName);
    if (!zone || !itemTypeLabel.trim()) { setItems([]); return; }
    api.items(zone.id, itemTypeLabel).then(r => setItems(r.data ?? [])).catch(() => setItems([]));
  }, [zoneName, itemTypeLabel, zones]);
  
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
        const res = await api.templatesByTypeId(type.id);
        const rows = res.data ?? [];
        setSubchecks(
          rows.map((t: any, i: number) => ({
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
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "pass" ? "fail" : "pass" } : s))
    );

  const onSave = async () => {
    try {
      // 1) basic dropdown checks
      if (!selectedSiteId) {
        Alert.alert("Site required", "Please select a site before saving.");
        return;
      }
      if (!selectedZoneId) {
        Alert.alert("Zone required", "Please select a zone before saving.");
        return;
      }
      if (!selectedItemTypeLabel) {
        Alert.alert("Item Type required", "Please select an item type before saving.");
        return;
      }
      if (!selectedItemId) {
        Alert.alert("Item required", "Please select an item before saving.");
        return;
      }
      // 2) FE validation of subchecks
      const invalid = subchecks.filter((s) =>
        !validateSubcheck({
          subcheckId: 0,
          inspectionId: 0,
          subcheckName: s.name,
          subcheckDescription: s.meta.description ?? "",
          valueType: s.meta.valueType,
          passCriteria: s.meta.passCriteria ?? "",
          status: s.status,
        } as any)
      );
      if (invalid.length > 0) {
        return Alert.alert("Invalid subchecks", "Please complete all subcheck fields.");
      }
      const computedOverallStatus = calculateOverallStatus(
        subchecks.map((s) => ({ status: s.status } as any))
      );
      const commentRequired = requireCommentIfFailed(computedOverallStatus, comment);
      if (commentRequired.length > 0) {
        return Alert.alert("Comment required", commentRequired.join("\n"));
      }
      // 3) Build EXACT backend payload
      const payload = {
        inspectionDate: new Date(dateString).toISOString(),
        inspectionCategory: "Facility" as const,
        itemId: selectedItemId,
        engineerName, // backend resolves to users.full_name → engineer_id
        comment: comment || undefined,
        subchecks: subchecks.map((s) => ({
          subcheckName: s.name,
          subcheckDescription: s.meta.description ?? "",
          valueType: s.meta.valueType,
          passCriteria: s.meta.passCriteria ?? "",
          status: s.status, // 'pass' | 'fail'
        })),
      };

      const res = await api.createInspection(payload);
      if (res.status !== "success") {
        throw new Error(res.message ?? "Save failed");
      }

      Alert.alert("Saved", "Inspection saved successfully.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Could not save");
    }
  };

    return (
    <View style={globalStyles.container}>
      <AppHeader engineerName={engineerName} onSignOut={() => navigation.navigate("Login")} />

      <TouchableOpacity
        style={[globalStyles.button, globalStyles.secondaryButton, globalStyles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Inspection Check Form</Text>

          {/* Date */}
          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Date (YYYY-MM-DD)</Text>
              <TextInput style={globalStyles.input} value={dateString} onChangeText={setDateString} />
            </View>
          </View>

          {/* Site */}
          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Site</Text>
              <Picker
                selectedValue={selectedSiteId}
                onValueChange={(v) => setSelectedSiteId(v)}
                style={globalStyles.input}
              >
                <Picker.Item label="Select site…" value={null} />
                {sites.map((s) => (
                  <Picker.Item key={s.id} label={s.name} value={s.id} />
                ))}
              </Picker>
            </View>

            {/* Zone */}
            <View style={globalStyles.formCol}>
              <Text>Zone</Text>
              <Picker
                selectedValue={selectedZoneId}
                onValueChange={(v) => setSelectedZoneId(v)}
                enabled={!!selectedSiteId}
                style={globalStyles.input}
              >
                <Picker.Item label="Select zone…" value={null} />
                {zones.map((z) => (
                  <Picker.Item key={z.id} label={z.name} value={z.id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Item Type */}
          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Item Type</Text>
              <Picker
                selectedValue={selectedItemTypeLabel}
                onValueChange={(v) => setSelectedItemTypeLabel(v)}
                style={globalStyles.input}
              >
                <Picker.Item label="Select item type…" value="" />
                {itemTypes.map((t) => (
                  <Picker.Item key={t.id} label={t.label} value={t.label} />
                ))}
              </Picker>
            </View>

            {/* Item */}
            <View style={globalStyles.formCol}>
              <Text>Item</Text>
              <Picker
                selectedValue={selectedItemId}
                onValueChange={(v) => setSelectedItemId(v)}
                enabled={!!selectedZoneId}
                style={globalStyles.input}
              >
                <Picker.Item label="Select item…" value={null} />
                {items.map((it) => (
                  <Picker.Item key={it.id} label={it.name} value={it.id} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Subchecks */}
          <View style={globalStyles.formPane}>
            <Text style={globalStyles.formPaneTitle}>Choose completed safety tests</Text>
            {subchecks.map((s) => (
              <SubcheckToggleRow
                key={s.id}
                name={s.name}
                value={s.status}
                onToggle={() => toggle(s.id)}
                infoText={s.meta.description}
                mandatory={s.meta.mandatory}
                requireInfoFirst={false}
              />
            ))}
          </View>

          {/* Overall + Comment */}
          <Text style={{ fontWeight: "700", marginBottom: 8 }}>
            Overall: <Text style={{ color: overall === "pass" ? "#2a9d9d" : "#c0392b" }}>{overall.toUpperCase()}</Text>
          </Text>

          <Text>Comment {overall === "fail" ? <Text style={{ color: "#b00020" }}>*</Text> : null}</Text>
          <TextInput
            style={[globalStyles.input, { height: 120, textAlignVertical: "top" }]}
            value={comment}
            onChangeText={setComment}
            placeholder="Explain failing checks…"
            multiline
          />

          {/* Actions */}
          <View style={[globalStyles.actionRow, { marginTop: 8 }]}>
            <TouchableOpacity style={[globalStyles.button, globalStyles.secondaryButton]} onPress={() => navigation.goBack()}>
              <Text style={globalStyles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.button, globalStyles.primaryButton]} onPress={onSave}>
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
