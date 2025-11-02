import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user_data");
      const user = userJson ? JSON.parse(userJson) : null;
      console.log("Loaded user data:", user);
      setUserData(user);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const badges = [
    { id: 1, icon: "school", color: "#000000", name: "Education" },
    { id: 2, icon: "sparkles", color: "#FFD700", name: "Achievement" },
    { id: 3, icon: "ribbon", color: "#4169E1", name: "Award" },
    { id: 4, icon: "stop-circle", color: "#DC143C", name: "Special" },
  ];

  const enrolledEvents = [
    {
      id: 1,
      title: "Alpha ai",
      location: "Alger",
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Hack",
      location: "Blskra",
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "AI event",
      location: "Oran",
      imageUrl:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#6BAE97" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("SettingsScreen")}
        >
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <Ionicons name="person-outline" size={50} color="#6BAE97" />
          </View>
          <TouchableOpacity>
            <Text style={styles.changePhotoText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User Name</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>{userData?.name || "User"}</Text>
              <Ionicons name="checkmark" size={20} color="#6BAE97" />
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>
                {userData?.email || "No email"}
              </Text>
              <Ionicons name="checkmark" size={20} color="#6BAE97" />
            </View>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badgs</Text>
          <View style={styles.badgesContainer}>
            {badges.map((badge) => (
              <View key={badge.id} style={styles.badge}>
                <View
                  style={[styles.badgeCircle, { backgroundColor: badge.color }]}
                >
                  <Ionicons name={badge.icon} size={28} color="#FFF" />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Enrolled Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enrolled event</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.eventsScroll}
          >
            {enrolledEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Image
                  source={{ uri: event.imageUrl }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventLocationContainer}>
                  <Ionicons name="location-outline" size={14} color="#6BAE97" />
                  <Text style={styles.eventLocation}>{event.location}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  profilePictureContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E8F5F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  changePhotoText: {
    fontSize: 14,
    color: "#6BAE97",
    fontWeight: "500",
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    fontWeight: "500",
  },
  infoValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  infoValue: {
    fontSize: 15,
    color: "#6B7280",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
  },
  badge: {
    alignItems: "center",
  },
  badgeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  eventsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  eventCard: {
    width: 110,
    marginRight: 12,
  },
  eventImage: {
    width: 110,
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  eventLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eventLocation: {
    fontSize: 12,
    color: "#6B7280",
  },
});
