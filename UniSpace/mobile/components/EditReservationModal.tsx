import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../lib/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

type Classroom = {
  id: number;
  name: string;
};

type Reservation = {
  id: number;
  classroomId: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose?: string;
};

type Props = {
  visible: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditReservationModal({
  visible,
  reservation,
  onClose,
  onSuccess,
}: Props) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [purpose, setPurpose] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (reservation) {
      setSelectedClassroom(reservation.classroomId);
      setDate(new Date(reservation.date));
      setStartTime(new Date(reservation.startTime));
      setEndTime(new Date(reservation.endTime));
      setPurpose(reservation.purpose ?? "");
    }
  }, [reservation]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(`${API_URL}/api/classrooms`);
        const data: Classroom[] = await response.json();
        setClassrooms(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClassrooms();
  }, []);

  const handleUpdate = async () => {
    if (!reservation) return;

    try {
      const token = await AsyncStorage.getItem("token");

      const finalStart = new Date(date);
      finalStart.setHours(
        startTime.getHours(),
        startTime.getMinutes(),
        0,
        0
      );

      const finalEnd = new Date(date);
      finalEnd.setHours(
        endTime.getHours(),
        endTime.getMinutes(),
        0,
        0
      );

      const response = await fetch(
        `${API_URL}/api/reservations/${reservation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            classroomId: selectedClassroom,
            date: finalStart.toISOString(),
            startTime: finalStart.toISOString(),
            endTime: finalEnd.toISOString(),
            purpose,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to update reservation");
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.log("Update reservation error:", error);
      Alert.alert("Error", "Failed to update reservation");
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Reservation</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Classroom</Text>

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text>
                {selectedClassroom
                  ? classrooms.find((c) => c.id === selectedClassroom)?.name
                  : ""}
              </Text>
              <Ionicons
                name={dropdownOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>

            {dropdownOpen && (
              <View style={styles.dropdownList}>
                <ScrollView nestedScrollEnabled>
                  {classrooms.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedClassroom(c.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <Text>{c.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={18} color="#6B7280" />
              <Text style={styles.inputText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(e, selected) => {
                  setShowDatePicker(false);
                  if (selected) setDate(selected);
                }}
              />
            )}

            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowStartPicker(true)}
            >
              <Ionicons name="time-outline" size={18} color="#6B7280" />
              <Text style={styles.inputText}>
                {startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>

            {showStartPicker && (
              <DateTimePicker
                value={startTime}
                mode="time"
                display="default"
                onChange={(e, selected) => {
                  setShowStartPicker(false);
                  if (selected) setStartTime(selected);
                }}
              />
            )}

            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowEndPicker(true)}
            >
              <Ionicons name="time-outline" size={18} color="#6B7280" />
              <Text style={styles.inputText}>
                {endTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>

            {showEndPicker && (
              <DateTimePicker
                value={endTime}
                mode="time"
                display="default"
                onChange={(e, selected) => {
                  setShowEndPicker(false);
                  if (selected) setEndTime(selected);
                }}
              />
            )}

            <Text style={styles.label}>Purpose</Text>
            <TextInput
              value={purpose}
              onChangeText={setPurpose}
              style={styles.input}
              placeholder="Optional"
              placeholderTextColor="#9CA3AF"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.saveText}>Update</Text>
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
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  inputText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#374151",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 150,
    backgroundColor: "white",
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
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