import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start", // This puts the search bar on top
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "blue",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  item: {
    fontSize: 20,
    marginVertical: 6,
  },
});
