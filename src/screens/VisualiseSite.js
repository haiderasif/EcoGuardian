import React, { useState, useEffect } from "react";
import {
  Image,
  Button,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

export const VisualiseSite = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [treePosition, setTreePosition] = useState({ x: 0, y: 0 });
  const [modalVisible, setModalVisible] = useState(true);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to take a picture");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const retakeImage = () => {
    setImage(null);
    pickImage();
  };

  const handleMoveLeft = () => {
    setTreePosition((prevPosition) => ({
      ...prevPosition,
      x: prevPosition.x - 10,
    }));
  };

  const handleMoveRight = () => {
    setTreePosition((prevPosition) => ({
      ...prevPosition,
      x: prevPosition.x + 10,
    }));
  };

  const handleMoveUp = () => {
    setTreePosition((prevPosition) => ({
      ...prevPosition,
      y: prevPosition.y - 10,
    }));
  };

  const handleMoveDown = () => {
    setTreePosition((prevPosition) => ({
      ...prevPosition,
      y: prevPosition.y + 10,
    }));
  };

  const handleContinue = () => {
    setModalVisible(false);
  };

  const handleSkip = () => {
    setModalVisible(false);
    navigation.navigate("TreePlantingStep1");
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              In this optional section you will be able to visualize a tree in
              your area. You will be able to move the tree around and see how it
              would look in your area.
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Continue" onPress={handleContinue} />
              <Button title="Skip" onPress={handleSkip} />
            </View>
          </View>
        </View>
      </Modal>
      {!image && !modalVisible && (
        <TouchableOpacity onPress={pickImage}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="camera-alt" size={50} color="#000" />
          </View>
        </TouchableOpacity>
      )}
      {image && (
        <>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={{
                  uri: image,
                }}
                style={styles.image}
              />
              <Image
                source={require("../../assets/tree.png")} // Replace with your image path
                style={{
                  ...styles.tree,
                  left: treePosition.x,
                  top: treePosition.y,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.controlsContainer}>
            <View style={styles.arrowControls}>
              <Button title="Left" onPress={handleMoveLeft} />
              <Button title="Right" onPress={handleMoveRight} />
              <Button title="Up" onPress={handleMoveUp} />
              <Button title="Down" onPress={handleMoveDown} />
            </View>
            <View style={styles.actionButtons}>
              <Button title="Retake Image" onPress={retakeImage} />
              <Button
                title="Continue"
                onPress={() => navigation.navigate("TreePlantingStep1")}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageContainer: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    flex: 1,
    width: 500,
    height: "auto",
  },
  tree: {
    width: 200,
    height: 200,
    position: "absolute",
  },
  controlsContainer: {
    width: "100%",
    alignItems: "center",
  },
  arrowControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
