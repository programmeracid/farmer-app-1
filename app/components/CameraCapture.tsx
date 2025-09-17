import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import uploadPhoto from "../services/uploadService";

interface CameraCaptureProps {
  onPhotoTaken: (uri: string) => void;
}

export default function CameraCapture({ onPhotoTaken }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) return null;

  // 📌 Handle when permission not granted
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "white", marginBottom: 10 }}>
          We need camera access to continue
        </Text>
        <Button
          title="Grant Camera Permission"
          onPress={async () => {
            const result = await requestPermission();
            console.log("Camera permission:", result);
          }}
        />
      </View>
    );
  }

  // 📷 Take a photo
  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onPhotoTaken(photo.uri);
      await uploadPhoto(photo.uri);
    }
  };

  // 🖼 Pick from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      onPhotoTaken(uri);
      await uploadPhoto(uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <Button title="Take Photo" onPress={takePhoto} />
        <Button title="Pick from Gallery" onPress={pickImage} />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: "flex-end" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
