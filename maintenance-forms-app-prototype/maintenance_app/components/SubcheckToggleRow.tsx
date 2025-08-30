// SubcheckToggleRow.tsx
// This component renders a row with a label and a toggle switch for pass/fail status.

import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

interface SubcheckToggleProps {
  label: string;
  value: "pass" | "fail";
  onToggle: () => void;
  mandatory?: boolean;
}

const SubcheckToggleRow: React.FC<SubcheckToggleProps> = ({
  label,
  value,
  onToggle,
  mandatory,
}) => {
  const isPass = value === "pass";
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
        {mandatory ? <Text style={styles.mandatory}>*</Text> : null}
      </Text>
      <View style={styles.toggle}>
        <Text style={[styles.pill, isPass ? styles.pass : styles.dim]}>
          Pass
        </Text>
        <Switch value={isPass} onValueChange={onToggle} />
        <Text style={[styles.pill, !isPass ? styles.fail : styles.dim]}>
          Fail
        </Text>
        {mandatory && <Text style={styles.mandatory}>Mandatory</Text>}
      </View>
    </View>
  );
};

export default SubcheckToggleRow;

const styles = StyleSheet.create({
  row: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: { flex: 1, paddingRight: 10, fontWeight: "600" },
  toggle: { flexDirection: "row", alignItems: "center", gap: 8 },
  pill: { fontSize: 12, fontWeight: "700" },
  pass: { color: "#2a9d9d" },
  fail: { color: "#c0392b" },
  dim: { color: "#999" },
  mandatory: { color: "#b00020", marginLeft: 4, fontWeight: "700" },
});
