import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Button,
  View,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Added import
import * as Yup from "yup";

import Screen from "../components/Screen";

import SubmitButton from "../components/forms/SubmitButton";
import { AuthenticationContext } from "../services/authentication/authentication.context";

import {
  getStorage,
  uploadBytes,
  ref as sRef,
  getDownloadURL,
} from "firebase/storage";
import {
  getAuth,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import AppButton from "../components/AppButton";

import { Formik, ErrorMessage } from "formik";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  images: Yup.string().required().label("Image"),
});
function EditProfile({ navigation }) {
  const auth = getAuth();
  const [imageUri, setImageUri] = useState("");
  const user = auth.currentUser;
  const { setIsAuthenticated } = useContext(AuthenticationContext);
  const [Error, setError] = useState(false);
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
  return (
    <>
      <ScrollView>
        <Screen style={styles.container}>
          <Formik
            initialValues={{
              name: user.displayName,
              email: user.email,
              password: user.password,
              images: user.photoURL,
            }}
            onSubmit={(values) => {
              signInWithEmailAndPassword(auth, user.email, values.password)
                .then((u) => {
                  setError(false);
                  updateEmail(u.user, values.email);
                  updateProfile(u.user, {
                    displayName: values.name,
                  });
                  alert("Updated");
                })
                .catch(() => {
                  setError(true);
                });
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
                  <Image source={{ uri: values.images }} style={styles.image} />
                )}
                <View style={styles.TextStyle}>
                  <TextInput
                    maxLength={225}
                    name="name"
                    placeholder="Name"
                    onChangeText={handleChange("name")}
                    onBlur={handleBlur("name")}
                    value={values.name}
                  />
                </View>
                <ErrorMessage
                  name="title"
                  component={Text}
                  style={styles.errorText}
                />
                <View style={styles.TextStyle}>
                  <TextInput
                    maxLength={225}
                    name="email"
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    value={values.email}
                  />
                </View>
                <ErrorMessage
                  name="title"
                  component={Text}
                  style={styles.errorText}
                />
                <View style={styles.TextStyle}>
                  <TextInput
                    maxLength={225}
                    name="password"
                    placeholder="Password"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    secureTextEntry
                    textContentType="password"
                  />
                </View>
                <ErrorMessage
                  name="title"
                  component={Text}
                  style={styles.errorText}
                />
                <SubmitButton
                  title="Update"
                  width={"90%"}
                  bgcolor={"#16C79A"}
                />
                <AppButton
                  width="90%"
                  title="Delete User"
                  bgcolor="red"
                  textcol="white"
                  onPress={() => navigation.navigate("Delete User")}
                />
              </View>
            )}
          </Formik>
          {Error ? (
            <Text style={{ marginLeft: 20, color: "red", fontWeight: "bold" }}>
              Wrong Email/Password
            </Text>
          ) : null}
        </Screen>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  TextStyle: {
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
  errorText: {
    color: "red",
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

export default EditProfile;
