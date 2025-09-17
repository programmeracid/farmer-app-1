import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import CameraCapture from "./components/CameraCapture";
import { login } from "./services/authService"; // your login service

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from storage when app starts
  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) setToken(savedToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
       // call your auth service
      setToken(data.token);
      await AsyncStorage.setItem("token", data.token);
    } catch (err: any) {
      Alert.alert("Login failed", err.message);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
  };

  if (loading) return null; // or a splash/loading screen

  // Show login form if no token
  if (!token) {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  // Logged in → show camera
  return <CameraCapture />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
