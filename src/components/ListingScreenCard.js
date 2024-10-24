import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import colors from "../styles/colors";
import AppText from "./AppText";
import { getDatabase, ref, onValue } from "firebase/database";
import { useIsFocused } from "@react-navigation/native";

function ListingScreenCard({
  startDate,
  startTime,
  title,
  subTitle,
  image,
  onPress,
  comments = {},
  listingId,
}) {
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const userReference = ref(db, "User");
    let unsubscribe;

    if (isFocused) {
      unsubscribe = onValue(userReference, (snapshot) => {
        snapshot.forEach((data) => {
          let result = data.val();
          if (result.UserId === listingId) {
            setUser(result);
          }
          result["key"] = data.key;
        });
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isFocused]);

  if (!user) {
    return null; // Or you can return a loading indicator here
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.container}>
          {image && (
            <Image style={styles.profileimage} source={{ uri: user.Picture }} />
          )}
          <View style={styles.detailContainer}>
            <View>
              <Text style={styles.title} numberOfLines={1}>
                {user.Name} Posted a
              </Text>
              <Text style={styles.title}>new location</Text>
            </View>
          </View>
        </View>
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 10,
              marginTop: -20,
              fontWeight: 600,
            }}
          >
            {title}
          </Text>
          <Image source={{ uri: image }} style={styles.image} />
          {Object.keys(comments).length == 0 ? (
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                fontWeight: 500,
              }}
            >
              Be the first one to comment on this post
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                fontWeight: 500,
              }}
            >
              Comments: {Object.keys(comments).length}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  profileimage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 20,
    padding: 10,
    overflow: "hidden",
  },
  detailContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    marginBottom: 7,
    fontSize: 16,
  },
});

export default ListingScreenCard;
