import React, { useContext, useState, useEffect } from "react";
import ListItem from "../components/ListingItem";
import Screen from "../components/Screen";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import colors from "../styles/colors";
import Icon from "../components/Icons";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import { getAuth, signOut } from "firebase/auth";
import { useIsFocused } from "@react-navigation/native";
import { getDatabase, ref, onValue } from "firebase/database";
import Card from "../components/Card";

function UserAccountScreen({ route }) {
  const { user } = route.params;
  const [listingDatas, setListingsData] = useState([]);
  var finished = [];
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isFocused) {
      getInitialData();
      const db = getDatabase();
      const reference = ref(db, "listing");
      onValue(reference, (snapshot) => {
        snapshot.forEach((data) => {
          let result = data.val();
          if (result.userId == user.user.UserId) {
            result["key"] = data.key;
            finished.push(result);
          }
        });
        setListingsData(finished);
      });
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  }, [isFocused]);
  const getInitialData = async () => {};

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.user.Name}
          subTitle={user.user.Email}
          image={user.user.Picture}
        />
      </View>
      <View style={{ position: "absolute", top: "50%", left: "50%" }}>
        {isLoading && (
          <ActivityIndicator
            size={50}
            style={{ marginLeft: -25 }}
            animating={true}
            color="#0000ff"
          />
        )}
      </View>
      <View style={{ padding: 20 }}>
        <FlatList
          data={listingDatas}
          keyExtractor={(listing) => listing.key}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={item.LocationName}
              comments={item.comments}
              image={item.imageUrl}
            />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.light,
  },
});

export default UserAccountScreen;
