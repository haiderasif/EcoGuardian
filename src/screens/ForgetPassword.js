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
import { SubmitButton } from "../components/forms/index";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import { AppLoader } from "../components/AppLoader";
import { useIsFocused } from "@react-navigation/native";
import { Formik, ErrorMessage } from "formik";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

function ForgetPassword({ navigation }) {
  const { forgetPassord, isLoading, error, setError } = useContext(
    AuthenticationContext
  );
  const initialvalues = {
    email: "",
  };
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
      <Screen style={styles.container}>
        <View style={{ paddingTop: 60 }}>
          <Formik
            initialValues={initialvalues}
            onSubmit={(values) => {
              forgetPassord(values.email);
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
                <Text
                  style={{ marginLeft: 20, fontSize: 25, paddingBottom: 10 }}
                >
                  Forgot Password?
                </Text>
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
                {error ? (
                  <Text
                    style={{ color: "red", marginLeft: 20, fontWeight: "bold" }}
                  >
                    User not found
                  </Text>
                ) : null}
                <SubmitButton
                  title={"Send email"}
                  width={"90%"}
                  bgcolor={"#16C79A"}
                />
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
    backgroundColor: "#F8F1F1",
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

export default ForgetPassword;
