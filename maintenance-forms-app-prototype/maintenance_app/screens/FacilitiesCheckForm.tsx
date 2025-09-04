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
    if(!itemTypeLabel.trim()) { setSubchecks([]);
      return;
    }
    api.templatesByLabel(itemTypeLabel).then(r => {
      const subcheckRows = r.data ?? [];
      setSubchecks(subcheckRows.map((t: any, i: number): SubcheckUI => ({
        id: i + 1,
        name: t.name,
        status: "pass",
        meta: {
          description: t.description ?? "",
          valueType: (t.valueType === "TEXT" ? "string" : t.valueType === "string" ? "number" : "boolean"),
          mandatory: !!t.mandatory,
          passCriteria: t.passCriteria ?? null,
        },
      })));
    }).catch(() => setSubchecks([]));
  }, [itemTypeLabel]);

  /**
   * Toggle the status of a subcheck.
   * @param id - The ID of the subcheck to toggle.
   * @returns A promise that resolves when the toggle is complete.
   */
  const toggle = (id: number) =>
    setSubchecks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === "pass" ? "fail" : "pass" } : s))
    );

  /**
   * Get the overall status of the subchecks.
   * This will be "pass" if all subchecks are "pass", otherwise "fail".
   * @param subchecks - The list of subchecks to evaluate.
   * @returns The overall status of the subchecks.
   */
  const overall: "pass" | "fail" = useMemo(
    () => (subchecks.every((s) => s.status === "pass") ? "pass" : "fail"),
    [subchecks]
  );

  /**
   * Get suggestions for a given query and list.
   * @param q - The search query.
   * @param list - The list of items to search.
   * @returns A list of matching items.
   */
  const suggestions = (q: string, list: Named[]) =>
    q.trim().length ? list.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())).slice(0,5) : [];
  
  /** Save the form.
   * This will validate the form and submit it to the backend.
   * On success, navigate back. On failure, show an alert.
   * @param navigation - The navigation object.
   * @returns A promise that resolves when the save is complete.
   */

  const onSave = async () => {
    try {
      const { payload } = validateAndBuildFormPayload({
        dateString,
        engineerName,
        category: "Facility",
        siteName,
        zoneName,
        itemType: itemTypeLabel,
        itemName,
        comment,
        sites,
        zones,
        items,
        subchecksUi: subchecks,
      });

      const res = await api.createInspection(payload);
      if (res.status !== "success") {
        throw new Error(res.message ?? "Failed to save inspection.");
      }
      Alert.alert("Success", "Inspection saved successfully.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save inspection.");
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
          <Text style={globalStyles.cardTitle}>Facility Inspection</Text>

          {/* Date */}
          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Date (YYYY-MM-DD)</Text>
              <TextInput style={globalStyles.input} value={dateString} onChangeText={setDateString} />
            </View>
          </View>

          {/* Site (type or select) */}
          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Site</Text>
              <TextInput
                style={globalStyles.input}
                value={siteName}
                onChangeText={setSiteName}
                placeholder="Type or select…"
              />
              {suggestions(siteName, sites).map(s => (
                <TouchableOpacity key={s.id} onPress={() => setSiteName(s.name)}>
                  <Text>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Zone */}
            <View style={globalStyles.formCol}>
              <Text>Zone</Text>
              <TextInput
                style={globalStyles.input}
                value={zoneName}
                onChangeText={setZoneName}
                placeholder="Type or select…"
              />
              {suggestions(zoneName, zones).map(z => (
                <TouchableOpacity key={z.id} onPress={() => setZoneName(z.name)}>
                  <Text>{z.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Item Type (type or select) */}
          <View style={globalStyles.formRow}>
            <View style={globalStyles.formCol}>
              <Text>Item Type</Text>
              <TextInput
                style={globalStyles.input}
                value={itemTypeLabel}
                onChangeText={setItemTypeLabel}
                placeholder="Type or select…"
              />
              {itemTypes
                .filter(t => (t.label ?? "").toLowerCase().includes(itemTypeLabel.toLowerCase()))
                .slice(0,5)
                .map(t => (
                  <TouchableOpacity key={t.id} onPress={() => setItemTypeLabel(t.label)}>
                    <Text>{t.label}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            {/* Item (type or select) */}
            <View style={globalStyles.formCol}>
              <Text>Item</Text>
              <TextInput
                style={globalStyles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder= "Type or select..."
              />
              {itemName.trim().length ? items.filter(i => i.name.toLowerCase().includes(itemName.toLowerCase())).slice(0,5).map(i => (
                <TouchableOpacity key={i.id} onPress={() => setItemName(i.name)}>
                  <Text>{i.name}</Text>
                </TouchableOpacity>
              )) : null}
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
