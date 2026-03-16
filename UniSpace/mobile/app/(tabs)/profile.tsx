import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import EditProfileModal from "../../components/EditProfileModal";
import { API_URL } from "../../lib/config";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: string | null;
  createdAt: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = () => {
    setEditVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    setLogoutVisible(false);
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loader}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {user.image && (
          <Image
            source={{ uri: `${API_URL}${user.image}` }}
            style={styles.avatar}
          />
        )}

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>{user.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>{user.role}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>
            Joined:{" "}
            {new Date(user.createdAt).toLocaleDateString("bs-BA")}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Ionicons
          name="pencil-outline"
          size={18}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setLogoutVisible(true)}
      >
        <Ionicons
          name="log-out-outline"
          size={18}
          color="#4B5563"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <ConfirmDeleteModal
        visible={logoutVisible}
        title="Logout confirmation"
        message="Are you sure you want to log out?"
        onCancel={() => setLogoutVisible(false)}
        onConfirm={confirmLogout}
      />

      <EditProfileModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        user={user}
        onSuccess={() => {
          setLoading(true);
          fetchUser();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9ECEF",
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 14,
    marginTop: 60,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  infoText: {
    fontSize: 16,
    color: "#4B5563",
    marginLeft: 10,
  },

  editButton: {
    backgroundColor: "#4B5563",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 12,
  },

  editButtonText: {
    color: "white",
    fontWeight: "600",
  },

  logoutButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#4B5563",
  },

  logoutButtonText: {
    color: "#4B5563",
    fontWeight: "600",
  },
});