import React, { useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ImageInput from "./ImageInput";

function ImageInputList({ imageUris , onAddImage }) {
  const scrollView = useRef();

  return (
    <View>
      <ScrollView
        ref={scrollView}
        horizontal
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        <View style={styles.container}>
            <View key={imageUris} style={styles.image}>
              <ImageInput
                imageUri={imageUris}
                onChangeImage={(uri) => {
                  onAddImage(uri)
                }}
              />
            </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flexDirection: "row",
    borderColor: 'black',
    marginLeft: 120,
    marginBottom: 20
  },
  image: {
    marginRight: 10,
  },
});
export default ImageInputList;
