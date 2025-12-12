import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function AddStaffScreen() {
  const [staffName, setStaffName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAddStaff = async () => {
    if (!staffName || !image) {
      Alert.alert("Error", "Please enter a name and select an image.");
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl = " http://10.98.226.183:8000"; // 🔁 Change to your IP

      // Step 1: Add the staff
      const staffFormData = new FormData();
      staffFormData.append("name", staffName);

      const staffRes = await axios.post(
        `${backendUrl}/api/staff`,
        staffFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const staffId = staffRes.data.id;

      // Step 2: Upload image
      const imageFormData = new FormData();
      imageFormData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "training.jpg",
      } as any);

      await axios.post(
        `${backendUrl}/api/staff/${staffId}/upload-image`,
        imageFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Alert.alert("Success", `Staff '${staffName}' added with ID: ${staffId}`);
      setStaffName("");
      setImage(null);
    } catch (error: any) {
      console.error(error);
      const detail =
        error?.response?.data?.detail || "An unexpected error occurred.";
      Alert.alert("Error", detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Staff</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Staff Name"
        value={staffName}
        onChangeText={setStaffName}
      />

      <Button title="Pick a Training Image" onPress={pickImage} />

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <Button
          title="Add Staff Member"
          onPress={handleAddStaff}
          disabled={!staffName || !image}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center",
    marginVertical: 20,
  },
  loader: {
    marginTop: 20,
  },
});
