import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "flex-start", // Puts search bar on top
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  item: {
    fontSize: 20,
    marginVertical: 6,
  },
  swipeContainer: {
    marginVertical: 5,
    overflow: "hidden",
  },
  swipeItem: {
    backgroundColor: "gray",
    padding: 20,
    borderRadius: 10,
    width: 200,
  },
  swipeItemText: {
    color: "white",
    fontSize: 18,

    flexWrap: "wrap",
  },
  swipeBlank: {
    width: 200,
  },
});
