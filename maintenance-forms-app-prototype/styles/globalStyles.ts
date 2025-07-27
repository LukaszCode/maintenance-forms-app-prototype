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
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#66b2b2",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
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
  footer: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 10,
  },
});
