import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  classroom: {
    name: string;
  };
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
};

const API_URL = "http://192.168.1.3:3000";

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reservations`);
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
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
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 20 }}
        renderItem={({ item }) => {
          const dateObj = new Date(item.date);

          const formattedDate = `${dateObj
            .getDate()
            .toString()
            .padStart(2, "0")}.${(dateObj.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${dateObj.getFullYear()}`;
          const start = new Date(item.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          const end = new Date(item.endTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <View style={styles.card}>
              <Text style={styles.classroom}>
                {item.classroom.name}
              </Text>

              <View style={styles.row}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.text}>{formattedDate}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.text}>
                  {start} - {end}
                </Text>
              </View>

              <View style={styles.row}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.text}>
                  {item.user.firstName} {item.user.lastName}
                </Text>
              </View>

              {item.purpose && (
                <View style={styles.row}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#6B7280"
                  />
                  <Text style={styles.text}>
                    {item.purpose}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
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
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  classroom: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5563",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  text: {
    fontSize: 16,
    color: "#6B7280",
    marginLeft: 10,
  },
});