import React, { useContext, useState } from "react";
import { StyleSheet, Text, ScrollView, TextInput, View } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";

import SubmitButton from "../components/forms/SubmitButton";
import { AuthenticationContext } from "../services/authentication/authentication.context";

import { getDatabase, ref, onValue, remove } from "firebase/database";
import { getStorage, ref as Sref, deleteObject } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { AppLoader } from "../components/AppLoader";
import { Formik, ErrorMessage } from "formik";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});
function DeleteUser({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const { setIsAuthenticated } = useContext(AuthenticationContext);
  const [Error, setError] = useState(false);
  const db = getDatabase();
  const storage = getStorage();
  const [isLoading, setIsLoading] = useState(false);
  const deleteuser = async (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((u) => {
        setIsLoading(true);
        setError(false);
        const listingRef = ref(db, "listing/");
        onValue(listingRef, (snapshot) => {
          snapshot.forEach((data) => {
            let result = data.val();
            if (result.userId == u.user.uid) {
              result["key"] = data.key;
              const filename = result.imageUrl.substring(
                result.imageUrl.lastIndexOf("%2F") + 3,
                result.imageUrl.lastIndexOf("?alt")
              );
              const desertRef = Sref(storage, "listing/" + filename);
              deleteObject(desertRef);
              const deletelisting = ref(db, "listing/" + result.key);
              remove(deletelisting);
            }
          });
        });
        const userRef = ref(db, "User/");
        onValue(userRef, (snapshot) => {
          snapshot.forEach((data) => {
            let result = data.val();
            if (result.UserId == u.user.uid) {
              result["key"] = data.key;
              const filename = result.Picture.substring(
                result.Picture.lastIndexOf("%2F") + 3,
                result.Picture.lastIndexOf("?alt")
              );
              const desertRef = Sref(storage, "users/" + filename);
              deleteObject(desertRef);
              const deleteuser = ref(db, "User/" + result.key);
              remove(deleteuser);
              deleteUser(user);
            }
          });
        });
        setIsLoading(false);
        deleteuser(u.user).then(() => {
          setIsAuthenticated(false);
        });
      })
      .catch((e) => {
        console.log(e);
        setError(true);
        setIsLoading(false);
      });
  };
  return (
    <>
      <ScrollView>
        <Screen style={styles.container}>
          <Text style={{ marginLeft: 20, fontSize: 25, paddingBottom: 10 }}>
            Delete User?
          </Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => {
              deleteuser(values);
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
                <View style={styles.TextStyle}>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={225}
                    name="email"
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
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
                  name="password"
                  component={Text}
                  style={styles.errorText}
                />
                <SubmitButton title="Delete" width={"90%"} bgcolor={"red"} />
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
      {isLoading ? <AppLoader /> : null}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  TextStyle: {
    backgroundColor: "#F8F1F1",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
});

export default DeleteUser;
