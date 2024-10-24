import { StyleSheet, Platform } from "react-native";
import { StatusBar } from "react-native";
const isAndroid = Platform.OS === "android";
export const styles = StyleSheet.create({
  safeArea: {
    marginTop: isAndroid ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    padding: 16,
    position: "absolute",
    width: "100%",
    top: 30,
    zIndex: 999,
  },
  mapContainer: {
    height: "100%",
    width: "100%",
  },
  RestrauntCard: {
    backgroundColor: "white",
    marginBottom: 20,
  },
  RestrauntCardCover: {
    padding: 20,
    backgroundColor: "white",
  },
  startTime: {
    fontSize: 12,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    padding: 16,
  },
  button: {
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  LocationReportContainer: {
    flex: 1,
  },
  LocationReportImage: {
    width: 400,
    height: 300,
    borderRadius: 10,
  },
  LocationReportText: {
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
  },
});
