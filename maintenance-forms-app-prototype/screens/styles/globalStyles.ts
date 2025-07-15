import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2a9d9d", // consistent teal background
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  logo: {
    width: 75,
    height: 75,
  },
  title: {
    fontSize: 18,
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
    width: 50,
    height: 50,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#66b2b2",
    alignSelf: "center",
    width: "90%",
  },
  cardTitle: {
    fontSize: 22,
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
