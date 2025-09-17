import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Image, StyleSheet, View } from "react-native";
import UploadButton from "./UploadButton";

interface PreviewProps {
  photoUri: string;
  onRetake: () => void;
}

export default function Preview({ photoUri, onRetake }: PreviewProps) {
  
    const {t} = useTranslation();

    const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Optional: call backend logout endpoint
        await fetch("http://172.16.46.27:8000/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Remove token locally
      await AsyncStorage.removeItem("token");
      Alert.alert("Logged out", "You have been logged out.");
      // Optionally: reload app or navigate to login screen
    } catch (err) {
      Alert.alert("Logout failed", "Could not logout. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: photoUri }} style={styles.image} />
      <Button title={t("retake")} onPress={onRetake} />
      <UploadButton imageUri={photoUri} />
      <View style={{ marginTop: 10 }}>
        <Button title={t("logout")} color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 300, height: 400, borderRadius: 10, marginBottom: 10 },
});