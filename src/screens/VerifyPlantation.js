import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";
import LottieView from "lottie-react-native";
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { async } from "@firebase/util";

export const VerifyPlantation = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [isTree, setIsTree] = useState(null);
  const [treesPlanted, setTreesPlanted] = useState(0); // State to store TreesPlanted value
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const db = getDatabase();
  const userRef = ref(db, "User");
  const user = getAuth().currentUser;

  useEffect(() => {
    (async () => {
      try {
        console.log("Initializing TensorFlow...");
        await tf.ready();
        console.log("TensorFlow initialized.");

        console.log("Loading the model...");
        const modelJson = require("../../web_model/model.json");
        const modelWeights = require("../../web_model/group1-shard1of1.bin");

        if (!modelJson || !modelWeights) {
          throw new Error("Model files not found. Please check the paths.");
        }

        const loadModel = async () => {
          return await tf.loadLayersModel(
            bundleResourceIO(modelJson, modelWeights)
          );
        };

        const loadedModel = await loadModel();
        setModel(loadedModel);
        setLoading(false);
        console.log("Model loaded successfully.");
      } catch (error) {
        console.error("Error loading the model:", error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchUserData = () => {
      onValue(
        userRef,
        (snapshot) => {
          snapshot.forEach((data) => {
            let result = data.val();
            result["key"] = data.key;
            if (result.UserId == user.uid) {
              setTreesPlanted(result.TreesPlanted);
            }
          });
        },
        { onlyOnce: true }
      );
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("Updated treesPlanted value:", treesPlanted);
  }, [treesPlanted]);

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
      console.log("Image picked:", result.assets[0].uri);
      setImage(result.assets[0].uri);
      classifyImage(result.assets[0].uri);
    }
  };

  const preprocessImage = async (uri) => {
    const imgB64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, "base64").buffer;
    const raw = new Uint8Array(imgBuffer);
    const imageTensor = decodeJpeg(raw);
    const resizedImage = tf.image
      .resizeBilinear(imageTensor, [64, 64]) // Resize to the expected shape
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255.0));
    return resizedImage;
  };

  const computeReconstructionError = (original, reconstructed) => {
    return original.sub(reconstructed).abs().mean().arraySync();
  };

  const classifyImage = async (uri) => {
    setLoading(true);
    if (!model) {
      console.error("Model is not loaded yet.");
      return;
    }

    try {
      console.log("Processing image...");
      const imageTensor = await preprocessImage(uri);
      const reconstructedImg = model.predict(imageTensor);

      const original = imageTensor.squeeze(); // Remove batch dimension for comparison
      const reconstructed = reconstructedImg.squeeze();

      const error = computeReconstructionError(original, reconstructed);
      console.log(`Reconstruction Error: ${error}`);

      const threshold = 0.06;
      setIsTree(error > threshold);

      if (error > threshold) {
        console.log("Tree detected. Incrementing tree count...");
        const newTreesPlanted = treesPlanted + 1;
        setTreesPlanted(newTreesPlanted);
        await updateTreeCount(newTreesPlanted);
      }

      console.log("Prediction made successfully.");
    } catch (error) {
      console.error("Error processing image:", error);
    }
    setLoading(false);
  };

  const updateTreeCount = async (newTreesPlanted) => {
    try {
      console.log("Updating tree count in the database...");
      onValue(
        userRef,
        (snapshot) => {
          snapshot.forEach((data) => {
            let result = data.val();
            result["key"] = data.key;
            if (result.UserId == user.uid) {
              const updateref = ref(db, `User/${result.key}`);
              update(updateref, {
                TreesPlanted: newTreesPlanted,
              });
            }
          });
        },
        { onlyOnce: true }
      );

      console.log("Tree count updated successfully.");
    } catch (error) {
      console.error("Error updating tree count:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {!image && <Button title="Take Picture" onPress={pickImage} />}
          {!image && (
            <Text style={styles.text}>
              Please take a picture of your plant for verification
            </Text>
          )}

          {image && (
            <>
              {isTree === null ? (
                <LottieView
                  source={require("../../assets/appLoader.json")}
                  autoPlay
                  style={{ width: 300, height: 300 }}
                />
              ) : isTree ? (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <LottieView
                    source={require("../../assets/confetti.json")}
                    autoPlay
                    style={{ width: 300, height: 300 }}
                  />
                  <Text style={styles.resultText}>
                    Congratulations you have planted a tree! Total Trees
                    Planted: {treesPlanted}
                  </Text>
                  <Button
                    title="Home Screen"
                    onPress={() => {
                      navigation.navigate("map");
                    }}
                  />
                </View>
              ) : (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <Text style={styles.resultText}>
                    A tree has not been detected in this image. Please retake
                    the image to continue.
                  </Text>
                  <Button title="Retake Image" onPress={pickImage} />
                </View>
              )}
            </>
          )}
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
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    paddingTop: 10,
    fontSize: 16,
  },
});

export default VerifyPlantation;
