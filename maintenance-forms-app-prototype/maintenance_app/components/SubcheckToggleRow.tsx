// SubcheckToggleRow.tsx
// This component renders a row with a label and a toggle switch for pass/fail status.

import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { globalStyles } from "@styles/globalStyles";

interface SubcheckToggleProps {
  name: string;
  value: "pass" | "fail";
  onToggle: () => void;
  infoText?: string;
  mandatory?: boolean;
  requireInfoFirst?: boolean;
}

const SubcheckToggleRow: React.FC<SubcheckToggleProps> = ({
  name,
  value,
  onToggle,
  infoText,
  mandatory,
  requireInfoFirst,
}) => {
  const [seenInfo, setSeenInfo] = useState(!requireInfoFirst);
  const isPass = value === "pass";

  const showInfo = () => {
    Alert.alert("Info", infoText || "No additional details.");
    setSeenInfo(true);
  };

  const handleToggle = () => {
    if (requireInfoFirst && !seenInfo) {
      showInfo();
      return;
    }
    onToggle();
  };

  return (
    <View style={globalStyles.subcheckToggleRow}>
      <Text style={globalStyles.subcheckToggleRowLabel}>
        {name}
        {mandatory ? <Text style={globalStyles.subcheckToggleRowMandatory}>*</Text> : null}
      </Text>
      <View style={globalStyles.subcheckToggleRowToggle}>
        <Text style={[globalStyles.subcheckToggleRowPill, isPass ? globalStyles.subcheckToggleRowPass : globalStyles.subcheckToggleRowDim]}>
          Pass
        </Text>
        <Switch value={isPass} onValueChange={onToggle} />
        <Text style={[globalStyles.subcheckToggleRowPill, !isPass ? globalStyles.subcheckToggleRowFail : globalStyles.subcheckToggleRowDim]}>
          Fail
        </Text>
        {mandatory && <Text style={globalStyles.subcheckToggleRowMandatory}>Mandatory</Text>}
      </View>
    </View>
  );
};

export default SubcheckToggleRow;
