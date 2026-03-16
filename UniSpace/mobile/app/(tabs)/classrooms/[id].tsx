import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../../lib/config";

type Classroom = {
  id: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  image?: string | null;
  description?: string | null;
};

export default function ClassroomDetails() {
  const { id } = useLocalSearchParams();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await fetch(`${API_URL}/api/classrooms`);
        const data = await response.json();

        const found = data.find(
          (item: Classroom) => item.id.toString() === id
        );

        setClassroom(found);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  if (!classroom) {
    return (
      <View style={styles.loader}>
        <Text>Classroom not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#4B5563" />
      </TouchableOpacity>

      {classroom.image && (
        <Image
          source={{ uri: `${API_URL}${classroom.image}` }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.card}>
        <Text style={styles.name}>{classroom.name}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>{classroom.building}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="layers-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>Floor {classroom.floor}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>
            {classroom.capacity} seats
          </Text>
        </View>

        {classroom.description && (
          <View style={styles.infoRow}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color="#6B7280"
            />
            <Text style={styles.infoText}>
              {classroom.description}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9ECEF",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 220,
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 60,
    padding: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  infoText: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 10,
    flex: 1,
  },
});