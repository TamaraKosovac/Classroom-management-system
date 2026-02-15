import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.inner}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>

        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>UniSpace</Text>
        <Text style={styles.subtitle}>
          Reserve. Manage. Simplify.
        </Text>

        <View style={styles.form}>

          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />

            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color={showPassword ? "#4B5563" : "#9CA3AF"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don&apos;t have an account?{" "}
            </Text>

            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9ECEF",
  },
  inner: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4B5563",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 60,
  },
  form: {
    marginTop: 10,
  },
  label: {
    marginBottom: 6,
    color: "#4B5563",
    fontWeight: "500",
    marginLeft: 5,
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 15,
  },

  button: {
    backgroundColor: "#4B5563",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 60,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  registerText: {
    color: "#6B7280",
  },
  registerLink: {
    color: "#4B5563",
    fontWeight: "600",
  },
});