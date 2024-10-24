import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/FontAwesome";
import Screen from "../components/Screen";

import { AuthenticationContext } from "../services/authentication/authentication.context";
import { Formik, ErrorMessage } from "formik";
import {
  getStorage,
  uploadBytes,
  ref as sRef,
  getDownloadURL,
} from "firebase/storage";
import colors from "../styles/colors";
import { AppLoader } from "../components/AppLoader";
import { useIsFocused } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import * as ImagePicker from "expo-image-picker"; // Added import

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
  images: Yup.string().label("Image"),
});

function RegisterScreen({ navigation }) {
  const { onRegister, error, setError } = useContext(AuthenticationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState("");

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getInitialData();
    }
  }, [isFocused]);

  const getInitialData = async () => {
    setError(false);
  };

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

  const auth = getAuth();

  const upload = async (values) => {
    setIsLoading(true);
    const storage = getStorage();
    const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
    const StorageRef = sRef(storage, "users/" + filename);
    const img = await fetch(imageUri);
    const bytes = await img.blob();
    await uploadBytes(StorageRef, bytes);
    let URL = "";
    const DownloadRef = sRef(storage, "users/" + filename);
    await getDownloadURL(DownloadRef)
      .then((u) => {
        URL = u;
      })
      .catch((e) => {
        console.log("Error: " + e);
      });
    onRegister(values.email, values.password, values.name, URL);
    setIsLoading(false);
    Alert.alert(
      "Email Verification",
      "Email verification link has been sent to " + values.email,
      [
        { text: "Okay" },
        {
          text: "Login",
          onPress: () => {
            navigation.navigate("Login");
          },
        },
      ]
    );
  };

  return (
    <>
      <Screen style={styles.container}>
        <ScrollView>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.image}
          />
          <Text style={styles.text}>Join the Group</Text>
          <View>
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                images: "",
              }}
              onSubmit={(values) => {
                upload(values);
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
                  <View style={styles.imageContainer}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={selectImage}
                    >
                      <Icon
                        name="camera"
                        size={30}
                        color="black"
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} style={styles.image} />
                    ) : null}
                  </View>
                  <View style={styles.TextStyle}>
                    <TextInput
                      autoCorrect={false}
                      maxLength={225}
                      name="name"
                      placeholder="Name"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                    />
                  </View>
                  <ErrorMessage
                    name="name"
                    component={Text}
                    style={styles.errorText}
                  />
                  <View style={styles.TextStyle}>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={225}
                      name="email"
                      keyboardType="email-address"
                      placeholder="Email"
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      textContentType="emailAddress"
                    />
                  </View>
                  <ErrorMessage
                    name="email"
                    component={Text}
                    style={styles.errorText}
                  />
                  <View style={styles.TextStyle}>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
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
                    name="name"
                    component={Text}
                    style={styles.errorText}
                  />

                  {error ? (
                    <Text
                      style={{
                        color: "red",
                        marginLeft: 20,
                        fontWeight: "bold",
                      }}
                    >
                      User already registered
                    </Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.submit}
                    onPress={handleSubmit}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "16px",
                      }}
                    >
                      REGISTER
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </View>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Text>Already have an account? </Text>
            <Text
              onPress={() => {
                navigation.navigate("Login");
              }}
              style={{ color: colors.primary }}
            >
              Login
            </Text>
          </View>
        </ScrollView>
      </Screen>
      {isLoading ? <AppLoader /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 60,
    height: 100,
    borderRadius: 10,
    marginTop: 50,
    alignSelf: "center",
  },
  text: {
    padding: 20,
    fontSize: 57,
    fontWeight: "500",
    letterSpacing: 5,
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
  errorText: {
    color: "red",
    marginLeft: 20,
  },
  submit: {
    backgroundColor: "#16C79A",
    color: "white",
    width: "90%",
    alignItems: "center",
    alignSelf: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default RegisterScreen;
