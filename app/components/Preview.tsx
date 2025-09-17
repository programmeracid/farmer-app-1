import React from "react";
import { Button, Image, StyleSheet, View } from "react-native";

interface PreviewProps {
  photoUri: string;
  onRetake: () => void;
}

export default function Preview({ photoUri, onRetake }: PreviewProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.image} />
      <Button title="Retake" onPress={onRetake} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 300, height: 400, marginBottom: 20 },
});
