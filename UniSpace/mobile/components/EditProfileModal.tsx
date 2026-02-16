import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
  };
  onSuccess: () => void;
};

const API_URL = "http://192.168.1.3:3000";

export default function EditProfileModal({
  visible,
  onClose,
  user,
  onSuccess,
}: Props) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState<string | null>(
    user.image ? `${API_URL}${user.image}` : null
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);

      if (newPassword.trim()) {
        formData.append("password", newPassword);
      }

      if (image && !image.startsWith("http")) {
        const fileName = image.split("/").pop() || "profile.jpg";

        formData.append("image", {
          uri: image,
          name: fileName,
          type: "image/jpeg",
        } as any);
      }

      const response = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        Alert.alert("Error", err.error || "Update failed");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />

            <Text style={styles.label}>Last name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Current password</Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
              secureTextEntry
              placeholder="Leave empty if not changing"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>New password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
              secureTextEntry
              placeholder="Leave empty if not changing"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.label}>Profile image</Text>

            <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.preview} />
              ) : (
                <Ionicons name="camera-outline" size={40} color="#6B7280" />
              )}
            </TouchableOpacity>

            {image && (
              <TouchableOpacity onPress={() => setImage(null)}>
                <Text style={styles.removeText}>Remove image</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  imageBox: {
    marginTop: 10,
    height: 120,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  removeText: {
    textAlign: "center",
    marginTop: 8,
    color: "#6B7280",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#4B5563",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "600",
  },
});