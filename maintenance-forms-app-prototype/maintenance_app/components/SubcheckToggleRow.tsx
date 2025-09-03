/**
 * This component renders a row with a label and a toggle switch for pass/fail status.
 * It also supports displaying additional information in an alert dialog.
 *
 * Original file displayed a simple toggle switch without additional context.
 * 
 * Changes: Added support for displaying additional information in an alert dialog.
 * This addition makes the component more informative and user-friendly without cluttering the UI.
 * 
 * @prop name - The label for the toggle row.
 * @prop value - The current value of the toggle (pass or fail).
 * @prop onToggle - Callback function to handle toggle changes.
 * @prop infoText - Optional additional information to display in the alert dialog.
 * @prop mandatory - Indicates if the toggle is mandatory.
 * @prop requireInfoFirst - If true, requires the user to acknowledge infoText before toggling.
 */

import React from "react";
import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
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
      <View style={globalStyles.subcheckToggleRowLabelContainer}>
        <Text style={globalStyles.subcheckToggleRowLabel}>
          {name}
          {mandatory ? <Text style={globalStyles.subcheckToggleRowMandatory}>*</Text> : null}
        </Text>
      </View>

      {!!infoText && (
        <TouchableOpacity onPress={showInfo} accessibilityLabel="More info">
          <Text style={globalStyles.subcheckToggleRowInfoButton}>i</Text>
        </TouchableOpacity>
      )}
      <View style={globalStyles.subcheckToggleRowToggle}>
        <Text style={[globalStyles.subcheckToggleRowPill, isPass ? globalStyles.subcheckToggleRowPass : globalStyles.subcheckToggleRowDim]}>
          Pass
        </Text>
        <Switch value={isPass} onValueChange={handleToggle} />
        <Text style={[globalStyles.subcheckToggleRowPill, !isPass ? globalStyles.subcheckToggleRowFail : globalStyles.subcheckToggleRowDim]}>
          Fail
        </Text>
      </View>
    </View>
  );
};

export default SubcheckToggleRow;
