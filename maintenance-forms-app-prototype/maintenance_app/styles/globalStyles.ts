import { StyleSheet, Platform, StatusBar } from "react-native";

export const globalStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#2a9d9d",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#2a9d9d",
    paddingHorizontal: 15,
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    borderRadius: 20,
    width: "100%",
    alignSelf: "center",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  loginPrompt: {
    textAlign: "center",
    marginVertical: 15,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  backButton: {
    alignSelf: "flex-start",
    marginVertical: 10,
    width: 80,
  },
  primaryButton: {
    backgroundColor: "#00b3b3",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#ccc",
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  addButton: {
    width: "50%",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: "#ccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  signOutButtonText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  userIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#66b2b2",
    width: "100%",
    alignSelf: "center",
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  subcheckToggleRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  subcheckToggleRowLabelContainer: {
    flex: 1,
    paddingRight: 10,
  },
  subcheckToggleRowLabel: {
    fontWeight: "600",
  },
  subcheckToggleRowToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subcheckToggleRowPill: {
    fontSize: 12,
    fontWeight: "700",
  },
  subcheckToggleRowPass: {
    color: "#2a9d9d",
  },
  subcheckToggleRowFail: {
    color: "#c0392b",
  },
  subcheckToggleRowDim: {
    color: "#999",
  },
  subcheckToggleRowMandatory: {
    color: "#b00020",
    marginLeft: 4,
    fontWeight: "700",
  },
  subcheckToggleRowInfoButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    textAlign: "center",
    lineHeight: 22,
    borderWidth: 1,
    borderColor: "#999",
    color: "#333",
    marginRight: 4,
  },

  scrollContainer: {
    maxHeight: 200, // Ensures scroll is visible when there are many buttons
    width: "100%",
  },
  formCol: {
    flex: 1,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  subcheckRow: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e2e2",
    paddingBottom: 10,
  },
  removeLink: {
    color: "#c0392b",
    textDecorationLine: "underline",
    marginTop: 5,
    fontSize: 12,
  },
  formPane: {
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  formPaneTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 10,
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
});
