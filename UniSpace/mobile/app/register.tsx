import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>

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

        <TouchableOpacity
          style={styles.imagePicker}
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-outline" size={22} color="#6B7280" />
          )}

          <View style={styles.plusIcon}>
            <Ionicons name="add" size={14} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.form}>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            placeholder="Enter your first name"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            placeholder="Enter your last name"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />

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
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
            </Text>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9ECEF",
  },
  inner: {
    padding: 25,
    paddingTop: 110,
  },
  backButton: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4B5563",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 25,
  },

  imagePicker: {
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  plusIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#4B5563",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    marginTop: 5,
  },

  label: {
    marginBottom: 6,
    color: "#4B5563",
    fontWeight: "500",
    marginLeft: 5,
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
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
    paddingHorizontal: 14,
    marginBottom: 18,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },

  button: {
    backgroundColor: "#4B5563",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  loginText: {
    color: "#6B7280",
  },
  loginLink: {
    color: "#4B5563",
    fontWeight: "600",
  },
});