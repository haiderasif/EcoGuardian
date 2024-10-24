import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";

const NewsDetailScreen = ({ route }) => {
  const { article } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>
      {article.urlToImage && (
        <Image source={{ uri: article.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.author}>{article.author}</Text>
      <Text style={styles.publishedAt}>
        {new Date(article.publishedAt).toLocaleDateString()}
      </Text>
      <Text style={styles.content}>{article.content}</Text>
      <TouchableOpacity
        style={styles.link}
        onPress={() => Linking.openURL(article.url)}
      >
        <Text style={{ color: "white" }}>
          Click here to read the full article
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 5,
  },
  publishedAt: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  image: {
    width: 400,
    height: 300,
    marginBottom: 10,
  },
  link: {
    margin: 20,
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
    width: 300,
    alignSelf: "center",
    borderRadius: 10,
  },
});

export default NewsDetailScreen;
