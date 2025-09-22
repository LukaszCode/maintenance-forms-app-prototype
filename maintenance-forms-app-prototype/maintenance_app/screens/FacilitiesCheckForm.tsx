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
type ItemType = { id:number; label:string; category:string; description?:string };
type ItemRow = { id: number; name: string; description?: string; zone_id: number; item_type: string };

const FacilitiesCheckForm: React.FC<Props> = ({ navigation, route }) => {
  const { engineerName } = route.params;

  // Basic fields
  const [dateString, setDateString] = useState(new Date().toISOString().slice(0,10));
  const [siteName, setSiteName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [itemTypeLabel, setItemTypeLabel] = useState("");
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");
  const [newCheckName, setNewCheckName] = useState("");


  //Dropdown data
  const [sites, setSites] = useState<Named[]>([]);
  const [zones, setZones] = useState<Named[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [subchecks, setSubchecks] = useState<SubcheckUI[]>([]);

 // Load sites and item types on mount
  useEffect(() => {
    api
      .sites()
      .then((r) => setSites(r.data ?? []))
      .catch(() => setSites([]));
    api
      .itemTypes("Facility")
      .then((r) => setItemTypes(r.data ?? []))
      .catch(() => setItemTypes([]));
  }, []);


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
   * Ensure the site exists in the list
   * Create the site on-the-fly if it does not exist.
   * This is called before saving the form.
   * 
   * @returns A promise that resolves when the site is ensured.
   */

  const ensureSiteExists = async () => {
    const name = siteName.trim();
    if (!name) {
      return null;
    }
    // Check if the site already exists - ignore case when comparing
    let site = sites.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!site) {
      const res = await api.ensureSite(name);
      if (res.status !== "success" ) 
        throw new Error(res.message ?? "Failed to create site.");
      // Add the new site to the list and select it
      const created = {id: res.data.id, name: res.data.name};
      setSites(prev => [...prev, created].sort((a,b) => a.name.localeCompare(b.name)));
      site = created;
    }
    return site;
  }


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
   *  When itemTypeLabel changes, find its id then load templates for that type.
   * If no itemTypeLabel is selected, reset subchecks.
   * @param itemTypeId - The ID of the selected item type.
   * @param itemType - The type of the selected item.
   * @returns A promise that resolves to the list of subcheck templates for the selected item type.
   */
  useEffect(() => {
    if(!itemTypeLabel) { setSubchecks([]);
      return;
    }
    const type = itemTypes.find(t => t.label === itemTypeLabel);
    if (!type) {
      setSubchecks([]); 
      return;
    }
    (async () => {
    try {
      const { data = [] } = await api.templatesByTypeId(type.id);
      setSubchecks(
        data.map((t: any, i: number) => ({
          id: i + 1,
          name: t.name,
          status: "pass" as const,
          meta: {
            description: t.description ?? "",
            valueType: t.valueType === "TEXT" ? "string" : (t.valueType as "boolean"|"number"|"string"),
            mandatory: !!t.mandatory,
            passCriteria: t.passCriteria ?? null,
          },
        }))
      );
    } catch {
      setSubchecks([]);
    }
  })();
}, [itemTypeLabel, itemTypes]);

/**
 * Add a new subcheck to the list.
 * This will add a new subcheck with the given name to the list of subchecks.
 * It will prevent adding duplicates (case-insensitive).
 * @param name - The name of the new subcheck to add.
 * @returns void
 */
const addSubcheck = () => {
  const name = newCheckName.trim();
  if (!name) {
    return Alert.alert("Missing name", "Enter a subcheck name.");
  }
  // prevent duplicates (case-insensitive)
  if (subchecks.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    return Alert.alert("Duplicate", "That subcheck already exists.");
  }
  setSubchecks(prev => [
    ...prev,
    {
      id: prev.length ? Math.max(...prev.map(p => p.id)) + 1 : 1,
      name,
      status: "pass",
      meta: {
        description: "",
        valueType: "boolean",
        mandatory: false,
        passCriteria: null,
      },
    },
  ]);
  setNewCheckName("");
};

  /**
   * Remove a subcheck from the list.
   * @param id - The ID of the subcheck to remove.
   * @returns void
   */
  const removeSubcheck = (id: number) =>
    setSubchecks(prev => prev.filter(s => s.id !== id));

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
      //1. Ensure the site exists (create if needed)
      const site = await ensureSiteExists();
      if (!site) {
        throw new Error("Site name is required.");
      }

      //2. Ensure the zone exists (create if needed)
      let zone = zones.find(z => z.name === zoneName.trim());
      if (!zone) {
        const res = await api.createZone(site.id, zoneName.trim());
        if (res.status !== "success") {
          throw new Error(res.message ?? "Failed to create zone.");
        }
        const createdZone = { id: res.data.id, name: res.data.name };
        setZones(prev => [...prev, createdZone].sort((a,b) => a.name.localeCompare(b.name)));
        zone = createdZone;
      }
      if (!zone) {
        throw new Error("Zone could not be determined.");
      }
      //3. Ensure the item exists (create if needed)
      let item = items.find(i =>
        i.name.toLowerCase() === itemName.trim().toLowerCase() &&
        i.zone_id === zone.id &&
        i.item_type === itemTypeLabel
      );
      let createdItem: ItemRow | null = null;
      if (!item) {
        const res = await api.createItem(zone.id, itemTypeLabel, itemName.trim());
        if (res.status !== "success") {
          throw new Error(res.message ?? "Failed to create item.");
        }
        const newItem: ItemRow = {
          id: res.data.id, 
          name: res.data.name, 
          item_type: itemTypeLabel,
          zone_id: zone.id, 
        };

        setItems(prev => [...prev, newItem]);
      }

      //4. Validate and build the payload
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
      {/* Shared Header */}
      <AppHeader
        engineerName={engineerName}
        onSignOut={() => navigation.navigate("Login")}
      />


      <TouchableOpacity
        style={[globalStyles.button, globalStyles.secondaryButton, globalStyles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={globalStyles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
        <View style={globalStyles.card}>
          <Text style={globalStyles.cardTitle}>Facility Check</Text>

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
            <Text style={globalStyles.formPaneTitle}>Subchecks</Text>

          {/* Add-new line (name only) */}
            <View style={globalStyles.inlineRow}>
              <TextInput
                style={[globalStyles.input, { flex: 1 }]}
                value={newCheckName}
                onChangeText={setNewCheckName}
                placeholder="Add a new subcheck name…"
                onSubmitEditing={addSubcheck}
                returnKeyType="done"
              />
              <TouchableOpacity style={[globalStyles.button, globalStyles.secondaryButton]} onPress={addSubcheck}>
                <Text style={globalStyles.secondaryButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {/* Existing subchecks */}
            {subchecks.map((s) => (
              <View key={s.id} style={globalStyles.subcheckRow}>
                <SubcheckToggleRow
                  name={s.name}
                  value={s.status}
                  onToggle={() => toggle(s.id)}
                  infoText={s.meta.description}
                  mandatory={s.meta.mandatory}
                  requireInfoFirst={false}
                />
                <TouchableOpacity onPress={() => removeSubcheck(s.id)} accessibilityLabel="Remove subcheck">
                  <Text style={globalStyles.removeLink}>Remove</Text>
                </TouchableOpacity>
              </View>
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
