import React from "react";
import { Text,View,Image,Platform} from "react-native";
import { WebView } from 'react-native-webview';
export const MapCallout = (props) => {
    return (
        <View style= {{padding: 10, maxWidth: 120, alignItems: 'center'}}>
        <Text>{props.x.Location}</Text>
        </View>
    )

}