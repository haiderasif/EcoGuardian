import React, { useContext, useState, useEffect } from "react";
import ListItem from "../components/ListingItem";
import Screen from "../components/Screen";
import Icon from "../components/Icons";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import { getAuth, signOut } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";

function AccountScreen({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const { setIsAuthenticated } = useContext(AuthenticationContext);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getInitialData();
    }
  }, [isFocused]);
  const getInitialData = async () => {};
  return (
    <Screen>
      <ListItem
        title={user.displayName}
        subTitle={user.email}
        image={user.photoURL}
        onPress={() => {
          navigation.navigate("Edit Profile");
        }}
      />
      <ListItem
        title={"My Listings"}
        IconComponent={
          <Icon name={"format-list-bulleted"} backgroundColor="#1E5631" />
        }
        onPress={() => {
          navigation.navigate("My Listing");
        }}
      />

      <ListItem
        title={"My Forest"}
        IconComponent={
          <Icon name={"format-list-bulleted"} backgroundColor="#1E5631" />
        }
        onPress={() => {
          navigation.navigate("MyForest");
        }}
      />
      <ListItem
        title={"Log Out"}
        IconComponent={<Icon name={"logout"} backgroundColor="#ffe66d" />}
        onPress={() => {
          signOut(auth).then(() => {
            setIsAuthenticated(false);
          });
        }}
      />
    </Screen>
  );
}

export default AccountScreen;
