import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import ListItem from "../components/LisingItem";
import AppButton from "../components/AppButton";
import { useIsFocused } from "@react-navigation/native";

function ListingDetailsScreen({ route, navigation }) {
  const listing = route.params;
  const [x, setX] = useState([]);
  const [user, setUser] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const auth = getAuth();
  const Curuser = auth.currentUser;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getInitialData();
      const db = getDatabase();
      const reference = ref(db, "data");
      const userReference = ref(db, "User");
      const commentsReference = ref(db, `listing/${listing.key}/comments`);

      onValue(reference, (snapshot) => {
        let result;
        snapshot.forEach((data) => {
          result = data.val();
          if (
            result.Location.replace(/ /g, "") ===
            listing.LocationName.replace(/ /g, "")
          ) {
            setX(result);
          }
          result["key"] = data.key;
        });
      });

      onValue(userReference, (snapshot) => {
        snapshot.forEach((data) => {
          let result = data.val();
          if (result.UserId === listing.userId) {
            setUser(result);
          }
          result["key"] = data.key;
        });
      });

      onValue(commentsReference, (snapshot) => {
        let commentsList = [];
        snapshot.forEach((data) => {
          let comment = data.val();
          comment["key"] = data.key;
          commentsList.push(comment);
        });
        setComments(commentsList);
      });
    }
  }, [isFocused]);

  const handleAddComment = () => {
    const db = getDatabase();
    const commentsReference = ref(db, `listing/${listing.key}/comments`);
    push(commentsReference, {
      userId: Curuser.uid,
      userName: Curuser.displayName,
      userPicture: Curuser.photoURL,
      text: newComment,
      timestamp: Date.now(),
    }).then(() => {
      setNewComment("");
    });
  };

  const handleEditComment = (commentId, commentText) => {
    setEditCommentId(commentId);
    setEditCommentText(commentText);
  };

  const handleSaveEditComment = () => {
    const db = getDatabase();
    const commentReference = ref(
      db,
      `listing/${listing.key}/comments/${editCommentId}`
    );
    update(commentReference, {
      text: editCommentText,
      timestamp: Date.now(),
    }).then(() => {
      setEditCommentId(null);
      setEditCommentText("");
    });
  };

  const handleDeleteComment = (commentId) => {
    const db = getDatabase();
    const commentReference = ref(
      db,
      `listing/${listing.key}/comments/${commentId}`
    );
    remove(commentReference);
  };

  const getInitialData = async () => {};

  return (
    <ScrollView>
      <View>
        <Image style={styles.image} source={{ uri: listing.imageUrl }} />
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.loc}>Location: {listing.LocationName}</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>
        <View style={styles.userContainer}>
          <View style={{ paddingTop: 20 }}>
            {x.length == 0 ? (
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Data is being uploaded. Please try again in few minutes
              </Text>
            ) : (
              <AppButton
                width="90%"
                title="Go to location"
                bgcolor="#16C79A"
                onPress={() => {
                  navigation.navigate("MapDetailed", {
                    detail: { x },
                  });
                }}
              />
            )}
          </View>
        </View>
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(comment) => comment.key}
            renderItem={({ item }) => (
              <View style={styles.comment}>
                <Text style={styles.commentText}>
                  <Text style={styles.commentAuthor}>{item.userName}: </Text>
                  {item.text}
                </Text>
                {item.userId === Curuser.uid && (
                  <View style={styles.commentActions}>
                    <TouchableOpacity
                      onPress={() => handleEditComment(item.key, item.text)}
                    >
                      <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(item.key)}
                    >
                      <Text style={styles.deleteButton}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
          {editCommentId ? (
            <View style={styles.editCommentForm}>
              <TextInput
                style={styles.input}
                placeholder="Edit your comment..."
                value={editCommentText}
                onChangeText={setEditCommentText}
              />
              <Button title="Save" onPress={handleSaveEditComment} />
              <Button
                title="Cancel"
                onPress={() => {
                  setEditCommentId(null);
                  setEditCommentText("");
                }}
              />
            </View>
          ) : (
            <View style={styles.commentForm}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <Button title="Submit" onPress={handleAddComment} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
  },
  detailContainer: {
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    alignSelf: "center",
    paddingBottom: 50,
  },
  userContainer: {
    marginVertical: 20,
  },
  description: {
    fontSize: 15,
    paddingBottom: 10,
  },
  loc: {
    fontWeight: "500",
  },
  commentsContainer: {
    padding: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  comment: {
    marginVertical: 10,
  },
  commentText: {
    fontSize: 16,
  },
  commentAuthor: {
    fontWeight: "600",
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    color: "blue",
    marginRight: 10,
  },
  deleteButton: {
    color: "red",
  },
  commentForm: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  editCommentForm: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ListingDetailsScreen;
