import React, { useContext, useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  DevSettings,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import {
  getStorage,
  ref as Sref,
  deleteObject,
  listAll,
} from "firebase/storage";
import { useIsFocused } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { AppLoader } from "../components/AppLoader";

import Card from "../components/Card";
import Screen from "../components/Screen";
import colors from "../styles/colors";

function MyListingScreen({ navigation }) {
  const [listingDatas, setListingsData] = useState([]);
  var finished = [];
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const storage = getStorage();
  useEffect(() => {
    if (isFocused) {
      getInitialData();
      const reference = ref(db, "listing");
      onValue(reference, (snapshot) => {
        snapshot.forEach((data) => {
          let result = data.val();
          if (result.userId == user.uid) {
            result["key"] = data.key;
            finished.push(result);
          }
        });
        setListingsData(finished);
      });
    }
  }, [isFocused]);
  const getInitialData = async () => {};
  return (
    <>
      <Screen style={styles.screen}>
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
        <FlatList
          data={listingDatas}
          keyExtractor={(listing) => listing.key}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={item.LocationName}
              comments={item.comments}
              image={item.imageUrl}
              onPress={() => {
                Alert.alert(
                  "Manage Listing",
                  "Do you want to edit or delete this site?",
                  [
                    {
                      text: "Delete",
                      onPress: () => {
                        setIsLoading(true);
                        const filename = item.imageUrl.substring(
                          item.imageUrl.lastIndexOf("%2F") + 3,
                          item.imageUrl.lastIndexOf("?alt")
                        );
                        const desertRef = Sref(storage, "listing/" + filename);
                        console.log(desertRef);

                        deleteObject(desertRef)
                          .then(() => {
                            console.log("deleted");
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                        const deleteRef = ref(db, "listing/" + item.key);
                        remove(deleteRef);
                        const map = ref(db, "data/");

                        onValue(map, (snapshot) => {
                          snapshot.forEach((data) => {
                            let result = data.val();

                            if (
                              result.Location.replace(/ /g, "") ===
                              item.LocationName.replace(/ /g, "")
                            ) {
                              result["key"] = data.key;
                              const deletemap = ref(db, "data/" + result.key);

                              const folderRef = Sref(storage, result.key);
                              listAll(folderRef).then((res) => {
                                res.items.forEach((itemRef) => {
                                  deleteObject(itemRef);
                                });
                              });

                              remove(deletemap);
                            }
                          });
                        });
                        setIsLoading(false);
                        navigation.navigate("Account");
                      },
                    },
                    {
                      text: "Update",
                      onPress: () => {
                        navigation.navigate("Update Post", {
                          detail: { item },
                        });
                      },
                    },
                  ]
                );
              }}
            />
          )}
        />
      </Screen>
      {isLoading ? <AppLoader /> : null}
    </>
  );
}
const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default MyListingScreen;
