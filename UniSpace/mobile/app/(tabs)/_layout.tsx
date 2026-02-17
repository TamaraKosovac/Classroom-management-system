import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4B5563",
        tabBarStyle: {
          backgroundColor: "white",
          height: 60,
          paddingBottom: 6,
        },
      }}
    >
      <Tabs.Screen
        name="classrooms"
        options={{
          title: "Classrooms",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="classrooms/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservations",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reservations/[id]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
