import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { API_URL } from "../../lib/config";
import ClassroomFilterModal from "../../components/ClassroomFilterModal";

type Classroom = {
  id: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  image?: string | null;
  description?: string | null;
};

type Reservation = {
  classroomId: number;
  startTime: string;
  endTime: string;
};

export default function ClassroomsScreen() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [floorFilterVisible, setFloorFilterVisible] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroomsRes = await fetch(`${API_URL}/api/classrooms`);
        const classroomsData = await classroomsRes.json();

        const reservationsRes = await fetch(`${API_URL}/api/reservations`);
        const reservationsData = await reservationsRes.json();

        setClassrooms(classroomsData);
        setReservations(reservationsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueFloors = [...new Set(classrooms.map((c) => c.floor))].sort(
    (a, b) => a - b
  );

  const isClassroomAvailable = (classroomId: number) => {
    const selectedStart = new Date(date);
    selectedStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const selectedEnd = new Date(date);
    selectedEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    const classroomReservations = reservations.filter(
      (r) => r.classroomId === classroomId
    );

    for (const r of classroomReservations) {
      const rStart = new Date(r.startTime);
      const rEnd = new Date(r.endTime);

      if (selectedStart < rEnd && selectedEnd > rStart) {
        return false;
      }
    }

    return true;
  };

  const filteredClassrooms = classrooms
    .filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((item) =>
      selectedFloor !== null ? item.floor === selectedFloor : true
    )
    .filter((item) => isClassroomAvailable(item.id));

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
        <View style={{ flex: 1 }} />

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => setFloorFilterVisible(!floorFilterVisible)}
          >
            <Ionicons
              name="layers-outline"
              size={26}
              color={selectedFloor !== null ? "#111827" : "#4B5563"}
            />
          </TouchableOpacity>

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
      </View>

      {floorFilterVisible && (
        <View style={styles.overlay}>
          <View style={styles.floorFilterContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelectedFloor(null);
                setFloorFilterVisible(false);
              }}
            >
              <Text
                style={[
                  styles.floorOption,
                  selectedFloor === null && styles.floorActive,
                ]}
              >
                All floors
              </Text>
            </TouchableOpacity>

            {uniqueFloors.map((floor) => (
              <TouchableOpacity
                key={floor}
                onPress={() => {
                  setSelectedFloor(floor);
                  setFloorFilterVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.floorOption,
                    selectedFloor === floor && styles.floorActive,
                  ]}
                >
                  Floor {floor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <FlatList
        data={filteredClassrooms}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/classrooms/${item.id}`)}
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
                <Ionicons name="business-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>{item.building}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="layers-outline" size={16} color="#6B7280" />
                <Text style={styles.infoText}>Floor {item.floor}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <ClassroomFilterModal
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        date={date}
        startTime={startTime}
        endTime={endTime}
        setDate={setDate}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 220,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  overlay: {
    position: "absolute",
    top: 110,
    right: 16,
    zIndex: 999,
  },

  floorFilterContainer: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    width: 160,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  floorOption: {
    fontSize: 16,
    paddingVertical: 6,
    color: "#4B5563",
  },

  floorActive: {
    fontWeight: "bold",
    color: "#111827",
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