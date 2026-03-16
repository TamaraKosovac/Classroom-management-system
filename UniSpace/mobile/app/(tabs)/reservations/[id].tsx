import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../../lib/config";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  classroom: {
    name: string;
    image?: string | null;
  };
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
};

export default function ReservationDetails() {
  const { id } = useLocalSearchParams();
  const [reservation, setReservation] =
    useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reservations`);
        const data = await response.json();

        const found = data.find(
          (item: Reservation) =>
            item.id.toString() === id
        );

        setReservation(found);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  if (!reservation) {
    return (
      <View style={styles.loader}>
        <Text>Reservation not found.</Text>
      </View>
    );
  }

  const dateObj = new Date(reservation.date);

  const formattedDate = `${dateObj
    .getDate()
    .toString()
    .padStart(2, "0")}.${(dateObj.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${dateObj.getFullYear()}`;

  const start = new Date(reservation.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const end = new Date(reservation.endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#4B5563" />
        </TouchableOpacity>

        {reservation.classroom.image && (
          <TouchableOpacity onPress={() => setImageVisible(true)}>
            <Image
              source={{
                uri: `${API_URL}${reservation.classroom.image}`,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <Text style={styles.title}>
            {reservation.classroom.name}
          </Text>

          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
            <Text style={styles.text}>{formattedDate}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="time-outline" size={18} color="#6B7280" />
            <Text style={styles.text}>
              {start} - {end}
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="person-outline" size={18} color="#6B7280" />
            <Text style={styles.text}>
              {reservation.user.firstName} {reservation.user.lastName}
            </Text>
          </View>

          {reservation.purpose && (
            <View style={styles.row}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#6B7280"
              />
              <Text style={styles.text}>
                {reservation.purpose}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={imageVisible} transparent>
        <TouchableOpacity
          style={styles.imageModal}
          onPress={() => setImageVisible(false)}
        >
          <Image
            source={{
              uri: `${API_URL}${reservation.classroom.image}`,
            }}
            style={styles.fullImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </>
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

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  text: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 10,
    flex: 1,
  },

  imageModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "95%",
    height: "80%",
  },
});