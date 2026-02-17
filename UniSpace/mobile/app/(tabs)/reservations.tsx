import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";
import { API_URL } from "../../lib/config";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  classroom: {
    name: string;
  };
};

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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

  const filteredReservations = reservations
    .filter((item) =>
      item.classroom.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
    )
    .filter((item) => {
      if (!startDate || !endDate) return true;

      const resDate = new Date(item.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      return resDate >= start && resDate <= end;
    });

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4B5563" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setCalendarVisible(true)}>
          <Ionicons name="calendar-outline" size={26} color="#4B5563" />
        </TouchableOpacity>

        {searchVisible ? (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search classroom..."
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setSearchVisible(false);
                setSearchText("");
              }}
            >
              <Ionicons name="close" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setSearchVisible(true)}>
            <Ionicons name="search-outline" size={26} color="#4B5563" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredReservations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
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
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/reservations/[id]",
                  params: { id: item.id.toString() },
                })
              }
            >
              <Text style={styles.classroom}>
                {item.classroom.name}
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
            </TouchableOpacity>
          );
        }}
      />

      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => {
                if (!startDate) setStartDate(day.dateString);
                else if (!endDate) setEndDate(day.dateString);
                else {
                  setStartDate(day.dateString);
                  setEndDate(null);
                }
              }}
            />

            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCalendarVisible(false)}
              >
                <Text style={{ color: "white" }}>Apply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.closeButton, { marginLeft: 10 }]}
                onPress={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setCalendarVisible(false);
                }}
              >
                <Text style={{ color: "white" }}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9ECEF",
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 16,
    padding: 20,
  },
  closeButton: {
    backgroundColor: "#4B5563",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
});
