import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

type AttendanceRecord = {
  id: number;
  staff_id: number;
  name: string;
  timestamp: string;
};

export default function ViewReportScreen() {
  const [staffId, setStaffId] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchAttendanceData = async () => {
    if (!staffId.trim()) {
      Alert.alert('Invalid Input', 'Please enter your Staff ID.');
      return;
    }

    try {
      setLoading(true);
      const backendUrl = `http://192.168.29.221:8000/api/attendance/${staffId}`;
 // Replace with your IP
      const response = await axios.get(backendUrl);
      setAttendanceData(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch attendance records.');
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your Staff ID"
        value={staffId}
        onChangeText={setStaffId}
        keyboardType="number-pad"
        editable={!loading}
      />
      <Button title="View Report" onPress={fetchAttendanceData} disabled={loading} />

      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}

      {submitted && (
        <FlatList
          data={attendanceData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.recordItem}>
              <Text style={styles.recordText}>Name: {item.name}</Text>
              <Text style={styles.recordText}>Staff ID: {item.staff_id}</Text>
              <Text style={styles.recordText}>Time: {formatTimestamp(item.timestamp)}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No attendance records found for this ID.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  recordItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    elevation: 2,
  },
  recordText: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#888' },
});
