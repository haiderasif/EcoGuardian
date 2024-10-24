import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Modal,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as Yup from "yup";
import { Text, TextInput, Button, Image } from "react-native";

import SubmitButton from "../components/forms/SubmitButton";
import Screen from "../components/Screen";

import colors from "../styles/colors";
import { Formik, ErrorMessage } from "formik";
import * as ImagePicker from "expo-image-picker";

import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import {
  getStorage,
  uploadBytes,
  ref as sRef,
  getDownloadURL,
  list,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapInput } from "../components/search.component";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { FirebaseContext } from "../services/FirebaseData";
import { useIsFocused } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { AppLoader } from "../components/AppLoader";
import * as Notification from "expo-notifications";
import * as Permission from "expo-permissions";

const categories = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
];
const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title Required"),
  description: Yup.string().label("Description"),
  UserLocation: Yup.string().required().label("Enter Location Name"),
  images: Yup.string().label("Add image"),
});
const d = new Date();
Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

function ListingEditScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const { location } = useContext(AuthenticationContext);
  const [focus, setFocus] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const customStyle = focus ? styles.TextStyleFocused : styles.TextStyle;
  const { GetListingCampaign, listingCampaignData } =
    useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(false);
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (error) {
      console.log("Error reading an image", error);
    }
  };

  const uploadSite = async (values) => {
    setIsLoading(true);
    const lat = values.latitude;
    const lng = values.longitude;
    const myLocation = values.UserLocation;

    fetch("http://192.168.0.251:5000/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: lat,
        lng: lng,
        myLocation: myLocation,
        UserId: user.uid,
        Category: values.category.label,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to upload data");
        }

        console.log(response.ok);
        setIsLoading(false);
        setServerError(false);
        var image = "";
        const resizedImage = await manipulateAsync(
          values.images,
          [{ resize: { width: 400, height: 200 } }],
          { compress: 0.5, format: SaveFormat.PNG }
        );
        image = resizedImage.uri.toString();
        const storage = getStorage();
        const filename = image.substring(image.lastIndexOf("/"));
        const StorageRef = sRef(storage, "listing/" + filename);
        const img = await fetch(image);
        const bytes = await img.blob();
        await uploadBytes(StorageRef, bytes);

        const DownloadRef = sRef(storage, "listing/" + filename);
        const URL = await getDownloadURL(DownloadRef);

        const db = getDatabase();
        const reference = ref(db, "listing/");
        console.log(reference);
        console.log(values.description);
        const dataToAdd = {
          title: values.title,
          category: values.category.label,
          latitude: values.latitude,
          longitude: values.longitude,
          description: values.description,
          userId: user.uid,
          imageUrl: URL,
          LocationName: values.UserLocation,
        };
        push(reference, dataToAdd);
      })
      .then(() => {
        // Success case after data push
        console.log("Data successfully pushed to database.");
      })
      .catch((error) => {
        // Catch any errors from fetch or promise chain
        setIsLoading(false);
        setServerError(true);
      });
  };
  const [welcomeModal, setWelcomeModal] = useState(true);
  const handleSkip = () => {
    setWelcomeModal(false);
  };
  const [region, setRegion] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const getCoordsFromName = (loc) => {
    setRegion({
      latitude: loc.lat,
      longitude: loc.lng,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    });
  };

  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    Permission.getAsync(Permission.NOTIFICATIONS)
      .then((response) => {
        if (response.status !== "granted") {
          return Permission.askAsync(Permission.NOTIFICATIONS);
        }
        return response;
      })
      .then((response) => {
        if (response.status !== "granted") {
          return;
        }
      });
  }, []);
  useEffect(() => {
    if (isFocused) {
      getInitialData();
    }
  }, [isFocused]);
  const getInitialData = async () => {
    setError(false);
    setServerError(false);
  };
  const dateobj = new Date();
  const month = dateobj.getMonth() + 1;
  const day = dateobj.getDate();
  const year = dateobj.getFullYear();
  const date = month + "/" + day + "/" + year;
  return (
    <>
      <ScrollView keyboardShouldPersistTaps="always">
        <Screen style={styles.container}>
          {
            <Formik
              initialValues={{
                title: "",
                latitude: region.latitude,
                longitude: region.longitude,
                description: "",
                category: categories[0],
                images: "",
                UserLocation: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                values.latitude = region.latitude;
                values.longitude = region.longitude;
                values.images = imageUri;
                uploadSite(values);
                resetForm((values = ""));
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <View style={styles.container}>
                  <Button title="Select Image" onPress={selectImage} />
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  ) : null}
                  <View style={customStyle}>
                    <TextInput
                      maxLength={225}
                      name="title"
                      placeholder="Title"
                      onChangeText={handleChange("title")}
                      onBlur={handleBlur("title")}
                    />
                  </View>
                  <ErrorMessage
                    name="title"
                    component={Text}
                    style={styles.errorText}
                  />
                  <View style={styles.Textcontainer}>
                    <Text style={{ alignSelf: "center" }}>
                      {region.latitude.toFixed(4) +
                        ", " +
                        region.longitude.toFixed(4)}
                    </Text>
                    <Text
                      style={{ paddingLeft: 90, color: "#16C79A" }}
                      title="Set Location"
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    >
                      {" "}
                      Set Location
                    </Text>
                  </View>
                  <View style={customStyle}>
                    <TextInput
                      maxLength={225}
                      name="UserLocation"
                      onChangeText={handleChange("UserLocation")}
                      onBlur={handleBlur("UserLocation")}
                      placeholder="Enter Location Name"
                    />
                  </View>
                  <ErrorMessage
                    name="UserLocation"
                    component={Text}
                    style={styles.errorText}
                  />
                  <View style={styles.picker}>
                    <Dropdown
                      style={styles.dropdown}
                      data={categories}
                      labelField="label"
                      valueField="value"
                      value={values.category}
                      onChange={(item) => {
                        setFieldValue("category", item);
                      }}
                    />
                  </View>
                  <View style={customStyle}>
                    <TextInput
                      maxLength={225}
                      name="description"
                      numberOfLines={3}
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      placeholder="Description"
                    />
                  </View>
                  <SubmitButton
                    title={"Post"}
                    width={"90%"}
                    bgcolor={"#16C79A"}
                  />
                </View>
              )}
            </Formik>
          }

          <Modal
            animationType="slide"
            visible={modalVisible}
            transparent={false}
          >
            <View style={styles.modalContainer}>
              <MapInput notifyChange={(loc) => getCoordsFromName(loc)} />
              <MapView
                style={styles.map}
                region={region}
                onPress={(e) => {
                  setRegion({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                    latitudeDelta: 0.3,
                    longitudeDelta: 0.3,
                  });
                }}
              >
                <Marker coordinate={region} />
              </MapView>
              <View style={styles.buttonContainer}>
                <Button
                  title="Set Location"
                  onPress={() => setModalVisible(!modalVisible)}
                  color="#841584" // Example color, adjust as needed
                />
              </View>
            </View>
          </Modal>
          {error ? (
            <Text style={{ color: "red", marginLeft: 20, fontWeight: "bold" }}>
              You have already started a campaign. Please try again later
            </Text>
          ) : null}
          {serverError ? (
            <Text style={{ color: "red", marginLeft: 20, fontWeight: "bold" }}>
              Please check your server and try again
            </Text>
          ) : null}
        </Screen>
        <Modal
          visible={welcomeModal}
          transparent={true}
          animationType="slide"
          onRequestClose={handleSkip}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 20 }}>
                Welcome to the plantation upload screen. This form lets you
                upload your own plantation location. Please note that you should
                only upload a plantation location that is be easily accessable
                for other users.
              </Text>
              <Button title="I Understand" onPress={handleSkip} />
            </View>
          </View>
        </Modal>
      </ScrollView>
      {isLoading ? <AppLoader /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
  },
  Textcontainer: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  Datecontainer: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
    flexDirection: "row",
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },
  datePickerStyle: {
    width: 230,
  },
  text: {
    textAlign: "left",
    width: 230,
    fontSize: 16,
    color: "#000",
  },
  TextStyle: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
  TextStyleFocused: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderColor: colors.primery,
    borderWidth: 2,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  picker: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderWidth: 1,
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
  errorText: {
    color: "red",
    marginLeft: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
});

export default ListingEditScreen;
