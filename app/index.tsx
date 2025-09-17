import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import CameraCapture from "./components/CameraCapture";
import LanguageScreen from "./pages/LanguageScreen"; // new page
import { login } from "./services/authService";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [langChosen, setLangChosen] = useState(false);
  const { t, i18n } = useTranslation();

  // Load token + language when app starts
  useEffect(() => {
    const init = async () => {
      const savedToken = await AsyncStorage.getItem("token");
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedToken) setToken(savedToken);
      if (savedLang) {
        await i18n.changeLanguage(savedLang);
        setLangChosen(true);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
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

  if (loading) return null; // splash screen placeholder

  // 🔹 Step 1: No language chosen → show language screen
  if (!langChosen) {
    return <LanguageScreen onLanguageSelected={() => setLangChosen(true)} />;
  }

  // 🔹 Step 2: Language chosen but no token → show login form
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
        <Button title={t("login")} onPress={handleLogin} />
      </View>
    );
  }

  // 🔹 Step 3: Logged in → show camera
  // 🔹 Step 3: Logged in → show camera with logout + change language
    return (
    <View style={{ flex: 1 }}>
        <CameraCapture />
        <View style={{ padding: 20 }}>
        <Button title={t("logout")} onPress={handleLogout} />
        <Button title={t("change_language")} onPress={() => setLangChosen(false)} />
        </View>
    </View>
    );
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
