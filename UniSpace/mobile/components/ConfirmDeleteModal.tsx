import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={onConfirm}>
              <Text style={styles.deleteText}>Yes</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: "center",
  },

  container: {
    backgroundColor: "#DADADA",
    width: "85%",
    borderRadius: 16,
    padding: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E3440",
    marginBottom: 12,
  },

  message: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 24,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    marginRight: 12,
  },

  cancelText: {
    color: "#4B5563",
    fontWeight: "600",
  },

  deleteBtn: {
    backgroundColor: "#3B4252",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  deleteText: {
    color: "white",
    fontWeight: "600",
  },
});