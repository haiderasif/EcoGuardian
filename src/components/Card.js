import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import colors from "../styles/colors";

function Card({
  startDate,
  startTime,
  title,
  subTitle,
  image,
  onPress,
  comments = {},
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text>Location: {subTitle}</Text>
          <Text>Comments: {Object.keys(comments).length}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 20,
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
    fontWeight: "bold",
  },
});
export default Card;
