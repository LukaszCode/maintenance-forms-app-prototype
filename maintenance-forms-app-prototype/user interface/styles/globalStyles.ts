import { StyleSheet, Platform, StatusBar } from "react-native";

export const globalStyles = StyleSheet.create({
  safeContainer: {
    flex: 0.25,
    backgroundColor: "#2a9d9d",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#2a9d9d",
    paddingHorizontal: 20,
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
    marginBottom: 5,
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
  checkList: {
    maxHeight: 200, // Ensures scroll is visible when there are many buttons
    width: "100%",
  },
  footer: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
});
