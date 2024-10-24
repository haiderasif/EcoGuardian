import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import axios from "axios";

const NewsListScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: "Trees AND UK",
          sortBy: "publishedAt",
          apiKey: "c4800febd1424825b525cfd3798ce670",
        },
      });
      // Filter out articles with the title "Removed"
      const filteredArticles = response.data.articles.filter(
        (article) => article.title !== "[Removed]"
      );
      setArticles(filteredArticles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleContainer}
      onPress={() => navigation.navigate("NewsDetail", { article: item })}
    >
      {item.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text numberOfLines={2} style={styles.description}>
          {item.description || "No description available"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  articleContainer: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  image: {
    width: 450,
    height: 200,
    borderRadius: 5,
    marginRight: 10, // Space between image and text
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1, // Allow the text to take up remaining space
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  titleContainer: {
    padding: 10,
  },
});

export default NewsListScreen;
