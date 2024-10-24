import React, { useEffect, useState, Suspense, useContext } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { Canvas } from "@react-three/fiber/native";
import Garden from "../components/Garden";
import useControls from "r3f-native-orbitcontrols";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FirebaseContext } from "../services/FirebaseData";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get("window");
export const MyForest = () => {
  const [OrbitControls, event] = useControls();
  const { GetTreesPlanted, treesPlanted } = useContext(FirebaseContext);
  const [stats, setStats] = useState({
    treeCount: 0,
    carbonReduction: 0,
    equivalentCars: 0,
    waterConserved: 0,
    pollutantsFiltered: 0,
  });

  useEffect(() => {
    GetTreesPlanted();
    calculateStats();
  }, []);

  const calculateStats = () => {
    const treeCount = treesPlanted;
    const carbonReduction = treeCount * 22.8; // Example: 22.8 lbs CO2 per tree per year
    const equivalentCars = (carbonReduction / 411.7).toFixed(2); // Example: Average car emits 411.7 lbs CO2/month
    const waterConserved = (treeCount * 100).toFixed(2); // Example: 100 gallons of water saved per tree per year
    const pollutantsFiltered = (treeCount * 10).toFixed(2); // Example: 10 lbs of pollutants filtered per tree per year

    setStats({
      treeCount,
      carbonReduction,
      equivalentCars,
      waterConserved,
      pollutantsFiltered,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Forest</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Icon name="nature" size={30} color="#2e7d32" />
            <Text style={styles.infoText}>
              Trees Planted: {stats.treeCount}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="eco" size={30} color="#2e7d32" />
            <Text style={styles.infoText}>
              Carbon Footprint Reduced: {stats.carbonReduction.toFixed(2)}{" "}
              lbs/year
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="directions-car" size={30} color="#2e7d32" />
            <Text style={styles.infoText}>
              Equivalent to removing {stats.equivalentCars} cars/month
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="opacity" size={30} color="#2e7d32" />
            <Text style={styles.infoText}>
              Water Conserved: {stats.waterConserved} gallons/year
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="local-florist" size={30} color="#2e7d32" />
            <Text style={styles.infoText}>
              Pollutants Filtered: {stats.pollutantsFiltered} lbs/year
            </Text>
          </View>
        </View>
        <View style={styles.modelContainer} {...event}>
          <Canvas>
            <OrbitControls enablePan={false} />
            <directionalLight position={[1, 0, 0]} args={["white", 1]} />
            <directionalLight position={[-1, 0, 0]} args={["white", 0.5]} />
            <directionalLight position={[0, 1, 0]} args={["white", 0.5]} />
            <directionalLight position={[0, -1, 0]} args={["white", 0.5]} />
            <directionalLight position={[0, 0, 1]} args={["white", 0.5]} />
            <directionalLight position={[0, 0, -1]} args={["white", 0.5]} />
            <Suspense fallback={null}>
              <Garden />
            </Suspense>
          </Canvas>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  infoContainer: {
    width: width - 20,
    padding: 10,
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  infoText: {
    fontSize: 18,
    color: "#2e7d32",
    marginLeft: 10,
  },
  modelContainer: {
    flex: 2,
    width: 500,
    height: 500,
  },
});
