import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function AttendanceRecordsScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          " http://10.98.226.183:8000/api/attendance"
        );
        setRecords(res.data);
      } catch (err: any) {
        setError("Failed to fetch attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Back to Dashboard" onPress={() => router.back()} />
      <Text style={styles.title}>Attendance Records</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : records.length === 0 ? (
        <Text>No attendance records found.</Text>
      ) : (
        records.map((record: any, index) => (
          <View key={index} style={styles.record}>
            <Text>Name: {record.name}</Text>
            <Text>Staff ID: {record.staff_id}</Text>
            <Text>Time: {new Date(record.timestamp).toLocaleString()}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  record: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
  },
});
