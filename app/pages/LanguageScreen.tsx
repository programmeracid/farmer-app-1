import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button, StyleSheet, Text, View } from "react-native";

export default function LanguageScreen({ onLanguageSelected } : any) {
  const { i18n } = useTranslation();

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("appLanguage", lang);
    onLanguageSelected(); // go back to Index → login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🌐 Choose Language</Text>
      <Button title="English" onPress={() => changeLanguage("en")} />
      <Button title="हिंदी" onPress={() => changeLanguage("hi")} />
      <Button title="தமிழ்" onPress={() => changeLanguage("ta")} />
      <Button title="తెలుగు" onPress={() => changeLanguage("te")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  heading: { fontSize: 20, marginBottom: 20 },
});
