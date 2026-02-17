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
import { useEffect, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../lib/config";
import AddReservationModal from "../../components/AddReservationModal";
import EditReservationModal from "../../components/EditReservationModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  userId: number;
  classroomId: number;
  purpose?: string;
  classroom: {
    name: string;
  };
};

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [menuVisible, setMenuVisible] = useState<number | null>(null);
  const [addVisible, setAddVisible] = useState(false);

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [editVisible, setEditVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] =
  useState<Reservation | null>(null);

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [reservationToDelete, setReservationToDelete] =
  useState<number | null>(null);

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/reservations`);
      const data = await response.json();

      if (response.ok) {
        setReservations(data);
      }
    } catch (error) {
      console.log("Fetch reservations error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setUserRole(data.role);
        setCurrentUserId(data.id);
      }
    } catch (error) {
      console.log("Fetch profile error:", error);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
    fetchProfile();
  }, [fetchReservations, fetchProfile]);

  const handleDelete = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(`${API_URL}/api/reservations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchReservations();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

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
        <View style={{ flex: 1 }} />

        <View style={styles.headerIcons}>
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

      <FlatList
        data={filteredReservations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
          const isOwner = item.userId === currentUserId;

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
            <View style={{ position: "relative" }}>
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/reservations/[id]",
                    params: { id: item.id.toString() },
                  })
                }
              >
                <View style={styles.topRow}>
                  <Text style={styles.classroom}>
                    {item.classroom.name}
                  </Text>

                  {isOwner && (
                    <TouchableOpacity
                      onPress={() =>
                        setMenuVisible(
                          menuVisible === item.id ? null : item.id
                        )
                      }
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  )}
                </View>

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

              {menuVisible === item.id && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMenuVisible(null);
                      setSelectedReservation(item);
                      setEditVisible(true);
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={18}
                      color="#4B5563"
                      style={{ marginRight: 8 }}   
                    />
                    <Text style={styles.dropdownText}>Update</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMenuVisible(null);
                      setReservationToDelete(item.id);
                      setDeleteVisible(true);
                    }}
                  >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#4B5563"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.dropdownText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />

      {userRole === "NASTAVNIK" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setAddVisible(true)}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => {
                if (!startDate) {
                  setStartDate(day.dateString);
                } else if (!endDate) {
                  setEndDate(day.dateString);
                } else {
                  setStartDate(day.dateString);
                  setEndDate(null);
                }
              }}
              markedDates={{
                ...(startDate && {
                  [startDate]: { selected: true, selectedColor: "#4B5563" },
                }),
                ...(endDate && {
                  [endDate]: { selected: true, selectedColor: "#4B5563" },
                }),
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

      <AddReservationModal
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSuccess={async () => {
          await fetchReservations();
          setAddVisible(false);
        }}
      />
      <EditReservationModal
        visible={editVisible}
        reservation={selectedReservation}
        onClose={() => setEditVisible(false)}
        onSuccess={async () => {
          await fetchReservations();
          setEditVisible(false);
        }}
      />
      <ConfirmDeleteModal
        visible={deleteVisible}
        title="Delete reservation"
        message="Are you sure you want to delete this reservation?"
        onCancel={() => {
          setDeleteVisible(false);
          setReservationToDelete(null);
        }}
        onConfirm={async () => {
          if (reservationToDelete !== null) {
            await handleDelete(reservationToDelete);
          }
          setDeleteVisible(false);
          setReservationToDelete(null);
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  headerIcons: {
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    backgroundColor: "#4B5563",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: 120,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",  
    alignItems: "center",  
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: "#4B5563",
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