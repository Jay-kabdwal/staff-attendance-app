import { View, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Link href="/(tabs)" asChild>
          <Button title="I am a Staff Member" />
        </Link>
      </View>
      <View style={styles.buttonContainer}>
        <Link href="/(admin)" asChild>
          <Button title="I am an Admin" />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonContainer: { marginVertical: 10, width: '80%' },
});