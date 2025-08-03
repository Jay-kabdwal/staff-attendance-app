import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Mark Attendance' }} />
      <Tabs.Screen name="report" options={{ title: 'View Report' }} />
    </Tabs>
  );
}