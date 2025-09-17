import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import uploadPhoto from "../services/uploadService";

interface UploadButtonProps {
  imageUri: string;
}

export default function UploadButton({ imageUri }: UploadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleUpload = async () => {
    if (!imageUri) return alert("No image selected!");
    setLoading(true);

    try {
      // Load token directly from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      const data = await uploadPhoto(imageUri, token || undefined);
      setResponse(data);
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Upload Image" onPress={handleUpload} disabled={loading} />
      {loading && <ActivityIndicator size="small" color="#0000ff" style={{ marginTop: 10 }} />}
      {response && (
        <View style={styles.responseBox}>
          <Text style={{ fontWeight: "bold" }}>Server Response:</Text>
          <Text>{JSON.stringify(response, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  responseBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
  },
});
