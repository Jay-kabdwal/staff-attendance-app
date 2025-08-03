// MarkAttendanceScreen.tsx
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { CameraCapturedPicture } from 'expo-camera';
import axios from 'axios';

export default function MarkAttendanceScreen() {
  const [staffId, setStaffId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const markAttendance = async () => {
    if (!staffId.trim()) {
      Alert.alert('Input Required', 'Please enter your Staff ID.');
      return;
    }

    if (!cameraRef.current) {
      Alert.alert('Camera Error', 'Camera is not ready.');
      return;
    }

    try {
      setIsLoading(true);
      const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({ quality: 0.5 });

      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        type: 'image/jpeg',
        name: 'attendance.jpg',
      } as any);

      const backendUrl = `http://192.168.29.221:8000/api/attendance/${staffId}/mark`;

      const response = await axios.post(backendUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', response.data.message || 'Attendance marked.');
      setStaffId('');
    } catch (error: any) {
      const message =
        error?.response?.data?.detail || 'Failed to mark attendance.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.message}>We need camera access to proceed.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Staff ID"
          placeholderTextColor="#666"
          value={staffId}
          onChangeText={setStaffId}
          keyboardType="number-pad"
          editable={!isLoading}
        />
      </View>

      <CameraView ref={cameraRef} style={styles.camera} facing="front" />

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Mark Attendance" onPress={markAttendance} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  camera: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    paddingTop: 50,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});
