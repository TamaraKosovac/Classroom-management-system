import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { API_URL } from "../../lib/config";


type Classroom = {
  id: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  image?: string | null;
  description?: string | null;
};


export default function ClassroomsScreen() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/classrooms`);
        const data = await response.json();
        setClassrooms(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classrooms}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingTop: 60,
          paddingBottom: 20,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push(`/classrooms/${item.id}`)  
            }
          >
            {item.image && (
              <Image
                source={{ uri: `${API_URL}${item.image}` }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>

              <View style={styles.infoRow}>
                <Ionicons
                  name="business-outline"
                  size={16}
                  color="#6B7280"
                />
                <Text style={styles.infoText}>
                  {item.building}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="layers-outline"
                  size={16}
                  color="#6B7280"
                />
                <Text style={styles.infoText}>
                  Floor {item.floor}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9ECEF",
    paddingHorizontal: 16,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 150,
  },

  cardContent: {
    padding: 16,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
});