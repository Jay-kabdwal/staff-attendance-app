import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerBackVisible: false }}>
      <Stack.Screen name="index" options={{ title: 'Admin Login' }} />
      <Stack.Screen name="dashboard" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="staff-list" options={{ title: 'Staff List' }} />
      <Stack.Screen name="registered-staff" options={{ title: 'Registered Staff' }} />
      <Stack.Screen name="attendance-records" options={{ title: 'Attendance Records' }} />
    </Stack>
  );
}
