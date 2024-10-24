import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import Screen from "../components/Screen";

import { AuthenticationContext } from "../services/authentication/authentication.context";
import colors from "../styles/colors";
import { AppLoader } from "../components/AppLoader";
import { Formik, ErrorMessage } from "formik";
import { useIsFocused } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen({ navigation }) {
  const { onLogin, isLoading, error, setError, verified, setVerified } =
    useContext(AuthenticationContext);
  const initialvalues = {
    email: "haiderasif70@gmail.com",
    password: "Locallogin123",
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getInitialData();
    }
  }, [isFocused]);
  const getInitialData = async () => {
    setError(false);
    setVerified(true);
  };
  return (
    <>
      <Screen style={styles.container}>
        <Image source={require("../../assets/logo.png")} style={styles.image} />
        <View style={{ paddingTop: 60 }}>
          <Formik
            initialValues={initialvalues}
            onSubmit={(values) => {
              onLogin(values.email, values.password);
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
                    value={values.email}
                  />
                </View>
                <ErrorMessage
                  name="email"
                  component={Text}
                  style={styles.errorText}
                />
                <View style={styles.TextStyle}>
                  <TextInput
                    maxLength={225}
                    name="Password"
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    textContentType="password"
                    value={values.password}
                  />
                </View>
                <ErrorMessage
                  name="Password"
                  component={Text}
                  style={styles.errorText}
                />
                {error ? (
                  <Text
                    style={{ color: "red", marginLeft: 20, fontWeight: "bold" }}
                  >
                    Wrong email/password
                  </Text>
                ) : null}
                {!verified ? (
                  <Text
                    style={{ color: "red", marginLeft: 20, fontWeight: "bold" }}
                  >
                    Please verify your email and try again
                  </Text>
                ) : null}
                <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    LOGIN
                  </Text>
                </TouchableOpacity>
                <View style={{ marginLeft: 20 }}>
                  <Text
                    onPress={() => {
                      navigation.navigate("ForgetPassword");
                    }}
                    style={{ color: colors.primery }}
                  >
                    Forgot your password?
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </Screen>
      {isLoading ? <AppLoader /> : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
  },
  text: {
    fontSize: 45,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 50,
  },
  image: {
    width: 60,
    height: 100,
    borderRadius: 10,
    marginTop: 50,
    alignSelf: "center",
    marginBottom: 50,
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

export default LoginScreen;
