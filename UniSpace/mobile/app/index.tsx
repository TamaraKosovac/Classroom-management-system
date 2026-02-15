import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Welcome to <Text style={styles.uniText}>UniSpace</Text>
      </Text>

      <Text style={styles.subtitle}>
        Faculty classroom reservation system for students, teachers and administrators.
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => router.push("/login")}
      >
        <Text style={[styles.buttonText, styles.loginText]}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => router.push("/register")}
      >
        <Text style={[styles.buttonText, styles.registerText]}>
          Register
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9ECEF",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  uniText: {
    color: "#4B5563",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },

  loginButton: {
    backgroundColor: "#4B5563",
  },
  loginText: {
    color: "white",
  },

  registerButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  registerText: {
    color: "#4B5563",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});