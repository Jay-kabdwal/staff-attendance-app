// app/(admin)/staff-list.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        " http://10.98.226.183:8000/api/all-staff"
      );
      setStaff(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch staff list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registered Staff Members</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : staff.length === 0 ? (
        <Text>No staff registered yet.</Text>
      ) : (
        staff.map((s: any) => (
          <View key={s.id} style={styles.card}>
            <Text>Name: {s.name}</Text>
            <Text>ID: {s.id}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  error: { color: "red", fontSize: 16 },
  card: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginBottom: 10,
  },
});
