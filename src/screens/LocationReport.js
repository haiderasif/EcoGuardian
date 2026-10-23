import React, { useState, useRef } from "react";
import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import { styles } from "../styles/styles";
import Slideshow from "react-native-image-slider-show";
import { demoAnalysisImage } from "../config/demoImages";
export const LocationReport = ({ route }) => {
  console.log(route.params.x.GeneratedMessage);
  return (
    <>
      <ScrollView>
        <SafeAreaView style={styles.SafeAreaView}>
          <View style={styles.LocationReportContainer}>
            <Slideshow
              titleStyle={{ fontSize: 20, color: "white" }}
              overlay={false}
              height={400}
              dataSource={[
                {
                  title: "Current NDVI view (illustrative)",
                  url: demoAnalysisImage("currentNdvi", route.params.x.NewNDVIUrl),
                },
                {
                  title: "Historical NDVI view (illustrative)",
                  url: demoAnalysisImage("historicalNdvi", route.params.x.OldNDVIurl),
                },
              ]}
            />
            <Text style={styles.LocationReportText}>
              {route.params.x.GeneratedMessage}{" "}
            </Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};
