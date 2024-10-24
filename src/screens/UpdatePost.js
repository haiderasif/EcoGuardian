import React, { useContext, useEffect, useState } from "react";
import { Alert, StyleSheet, Modal, View, ScrollView } from "react-native";
import * as Yup from "yup";
import { Text, TextInput, Image, Button } from "react-native";
import SubmitButton from "../components/forms/SubmitButton";
import Screen from "../components/Screen";
import colors from "../styles/colors";
import * as ImagePicker from "expo-image-picker"; // Added import
import { getDatabase, ref, update, onValue } from "firebase/database";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import {
  getStorage,
  uploadBytes,
  ref as sRef,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapInput } from "../components/search.component";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { FirebaseContext } from "../services/FirebaseData";
import { useIsFocused } from "@react-navigation/native";
import { AppLoader } from "../components/AppLoader";
import Lottie from "lottie-react-native";
import { Formik, ErrorMessage } from "formik";
import { Dropdown } from "react-native-element-dropdown";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  description: Yup.string().label("DEscription"),
  UserLocation: Yup.string().label("Enter Location Name"),
  category: Yup.object().nullable().label("category"),
  images: Yup.string().label("Add image"),
});

function UpdatePost({ route }) {
  const { detail } = route.params;
  const auth = getAuth();
  const user = auth.currentUser;
  const { location } = useContext(AuthenticationContext);
  const { GetCampaign, campaignData } = useContext(FirebaseContext);
  const [focus, setFocus] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const customStyle = focus ? styles.TextStyleFocused : styles.TextStyle;
  const [isLoading, setIsLoading] = useState(false);
  const categories = [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ];

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
    if (values.images === detail.item.imageUrl) {
      setIsLoading(true);
      const db = getDatabase();
      const reference = ref(db, "listing/" + detail.item.key);
      if (values.category.label == null) {
        update(reference, {
          title: values.title,
          category: values.category,
          latitude: values.latitude,
          longitude: values.longitude,
          description: values.description,
          userId: user.uid,
          imageUrl: values.images,
          LocationName: values.UserLocation,
        });
      } else {
        update(reference, {
          title: values.title,
          category: values.category.label,
          latitude: values.latitude,
          longitude: values.longitude,
          description: values.description,
          userId: user.uid,
          imageUrl: values.images,
          LocationName: values.UserLocation,
        });
        const userRef = ref(db, "data");
        onValue(userRef, (snapshot) => {
          snapshot.forEach((data) => {
            let result = data.val();
            result["key"] = data.key;
            if (
              result.UserID == detail.item.userId &&
              result.Location == detail.item.LocationName
            ) {
              const updateref = ref(db, "data/" + result.key);
              update(updateref, {
                Category: values.category.label,
              });
            }
          });
        });
      }
    } else {
      console.log("In else");
      setIsLoading(true);
      const storage = getStorage();
      const filename = detail.item.imageUrl.substring(
        detail.item.imageUrl.lastIndexOf("F") + 1,
        detail.item.imageUrl.lastIndexOf("?alt")
      );
      const desertRef = sRef(storage, "listing/" + filename);
      deleteObject(desertRef);
      var image = "";
      const resizedImage = await manipulateAsync(
        values.images,
        [{ resize: { width: 400, height: 200 } }],
        { compress: 0.5, format: SaveFormat.PNG }
      );
      console.log(resizedImage.uri);
      image = resizedImage.uri.toString();
      var URL = "";
      const filename1 = image.substring(image.lastIndexOf("/"));
      const StorageRef = sRef(storage, "listing/" + filename1);
      const img = await fetch(image);
      const bytes = await img.blob();
      await uploadBytes(StorageRef, bytes);
      const DownloadRef = sRef(storage, "listing/" + filename1);
      await getDownloadURL(DownloadRef)
        .then((u) => {
          URL = u;
        })
        .catch((e) => {
          console.log(e);
        });
      const db = getDatabase();
      const reference = ref(db, "listing/" + detail.item.key);
      update(reference, {
        title: values.title,
        category: values.category.label,
        latitude: values.latitude,
        longitude: values.longitude,
        description: values.description,
        userId: user.uid,
        imageUrl: URL,
        LocationName: values.UserLocation,
      });
    }
    setIsLoading(false);
    Alert.alert("Data has been updated");
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
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getInitialData();
    }
  }, [isFocused]);
  const getInitialData = async () => {
    setError(false);
  };

  return (
    <>
      <ScrollView>
        <Screen style={styles.container}>
          {
            <Formik
              initialValues={{
                title: detail.item.title,
                latitude: region.latitude,
                longitude: region.longitude,
                description: detail.item.description,
                category: detail.item.category,
                images: detail.item.imageUrl,
                UserLocation: detail.item.LocationName,
              }}
              onSubmit={(values, { resetForm }) => {
                values.latitude = region.latitude;
                values.longitude = region.longitude;
                uploadSite(values);
                resetForm((values = ""));
              }}
              validationSchema={validationSchema}
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
                <View>
                  <Button title="Select Image" onPress={selectImage} />
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.image} />
                  ) : (
                    <Image
                      source={{ uri: values.images }}
                      style={styles.image}
                    />
                  )}

                  <View style={customStyle}>
                    <TextInput
                      maxLength={225}
                      name="title"
                      placeholder="Title"
                      onChangeText={handleChange("title")}
                      onBlur={handleBlur("title")}
                      value={values.title}
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
                      value={values.UserLocation}
                    />
                  </View>
                  <ErrorMessage
                    name="UserLocation"
                    component={Text}
                    style={styles.errorText}
                  />
                  <View style={customStyle}>
                    <TextInput
                      maxLength={225}
                      name="description"
                      numberOfLines={3}
                      onChangeText={handleChange("description")}
                      onBlur={handleBlur("description")}
                      placeholder="Description"
                      value={values.description}
                    />
                  </View>
                  <View style={styles.picker}>
                    <Dropdown
                      style={styles.dropdown}
                      data={categories}
                      labelField="label"
                      valueField="value"
                      placeholder={values.category}
                      value={values.category}
                      onChange={(item) => {
                        setFieldValue("category", item);
                      }}
                    />
                  </View>
                  <SubmitButton
                    title={"Update"}
                    width={"90%"}
                    bgcolor={"#16C79A"}
                  />
                </View>
              )}
            </Formik>
          }

          <Modal animationType="slide" visible={modalVisible}>
            <View>
              <View style={styles.modalView}>
                <MapInput notifyChange={(loc) => console.log(loc)} />
                <MapView
                  style={{ width: "100%", height: "100%" }}
                  region={region}
                  showsUserLocation={true}
                  onPress={(e) => {
                    setRegion({
                      latitude: e.nativeEvent.coordinate.latitude,
                      longitude: e.nativeEvent.coordinate.longitude,
                      latitudeDelta: 0.003,
                      longitudeDelta: 0.003,
                    });
                  }}
                >
                  <Marker coordinate={region} />
                </MapView>
              </View>
              <Button
                mode="contained"
                style={{
                  position: "absolute",
                  top: "90%", //for center align
                  alignSelf: "center",
                  width: "100%",
                  height: 40,
                }}
                onPress={() => setModalVisible(!modalVisible)}
              >
                Set Location
              </Button>
            </View>
          </Modal>
          {error ? (
            <Text>
              You have already started a campaign. Please try again later
            </Text>
          ) : null}
        </Screen>
        {isLoading ? <AppLoader /> : null}
      </ScrollView>
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
  picker: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderWidth: 1,
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
});
export default UpdatePost;
