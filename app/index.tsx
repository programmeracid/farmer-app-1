import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import CameraCapture from "./components/CameraCapture";
import Preview from "./components/Preview";

export default function Index() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {!photoUri ? (
        <CameraCapture onPhotoTaken={setPhotoUri} />
      ) : (
        <Preview photoUri={photoUri} onRetake={() => setPhotoUri(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
});
