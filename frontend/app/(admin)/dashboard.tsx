// app/(admin)/dashboard.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Link href="/(admin)/add-staff" asChild>
        <Button title="Add New Staff Member" />
      </Link>
      <Link href="/(admin)/staff-list" asChild>
        <Button title="View Registered Staff Members" />
      </Link>
      <Link href="/(admin)/attendance-records" asChild>
        <Button title="View Attendance Records" />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
});
