import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

export default function AdminLoginScreen() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Please enter the admin password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        " http://10.98.226.183:8000/api/admin/login", // ✅ updated IP here
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        router.replace("/(admin)/dashboard");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to connect to server";
      Alert.alert("Login Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Admin Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Login"
          onPress={handleLogin}
          disabled={!password.trim()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
});
