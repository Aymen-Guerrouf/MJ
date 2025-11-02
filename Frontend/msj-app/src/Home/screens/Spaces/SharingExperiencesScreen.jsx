import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import mockData from "../../../data/mockSpacesData.json";

const { width } = Dimensions.get("window");

const SharingExperiencesScreen = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { sharingExperiences } = mockData;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getDaysUntil = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };

  const renderUpcomingSeance = (seance) => (
    <View key={seance.id} style={styles.seanceCard}>
      <View style={styles.seanceHeader}>
        <View style={styles.dateTag}>
          <Ionicons name="calendar-outline" size={14} color="#6366f1" />
          <Text style={styles.dateText}>
            {getDaysUntil(seance.scheduledDate)}
          </Text>
        </View>
        <View style={styles.spotsTag}>
          <Ionicons name="people-outline" size={14} color="#10b981" />
          <Text style={styles.spotsText}>
            {seance.maxAttendees - seance.currentAttendees} spots left
          </Text>
        </View>
      </View>

      <Text style={styles.seanceTitle}>{seance.title}</Text>
      <Text style={styles.seanceDescription}>{seance.description}</Text>

      <View style={styles.speakerContainer}>
        <Image
          source={{ uri: seance.speakerImage }}
          style={styles.speakerImage}
        />
        <View style={styles.speakerInfo}>
          <Text style={styles.speakerName}>{seance.speaker}</Text>
          <Text style={styles.speakerBio} numberOfLines={2}>
            {seance.speakerBio}
          </Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{seance.location}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>{seance.duration} min</Text>
        </View>
      </View>

      <View style={styles.seanceFooter}>
        <Text style={styles.topicTag}>{seance.topic}</Text>
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderArchivedSeance = (seance) => (
    <TouchableOpacity key={seance.id} style={styles.archiveCard}>
      <View style={styles.archiveHeader}>
        <View style={styles.playButton}>
          <Ionicons name="play-circle" size={40} color="#6366f1" />
        </View>
        <View style={styles.archiveInfo}>
          <Text style={styles.archiveTitle} numberOfLines={2}>
            {seance.title}
          </Text>
          <Text style={styles.archiveSpeaker}>{seance.speaker}</Text>
          <Text style={styles.archiveDate}>
            {formatDate(seance.scheduledDate)}
          </Text>
        </View>
        <View style={styles.viewsContainer}>
          <Ionicons name="eye-outline" size={16} color="#64748b" />
          <Text style={styles.viewsText}>{seance.views}</Text>
        </View>
      </View>

      <Text style={styles.archiveSummary} numberOfLines={3}>
        {seance.summary}
      </Text>

      <View style={styles.tagsContainer}>
        {seance.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sharing Experiences</Text>
        <Text style={styles.headerSubtitle}>
          Learn from others' journeys and experiences
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={activeTab === "upcoming" ? "#6366f1" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming Seances
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {sharingExperiences.upcoming.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "archive" && styles.activeTab]}
          onPress={() => setActiveTab("archive")}
        >
          <Ionicons
            name="archive"
            size={20}
            color={activeTab === "archive" ? "#6366f1" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "archive" && styles.activeTabText,
            ]}
          >
            Archive
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {sharingExperiences.archive.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "upcoming"
          ? sharingExperiences.upcoming.map(renderUpcomingSeance)
          : sharingExperiences.archive.map(renderArchivedSeance)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "white",
    padding: 24,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#eff6ff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#6366f1",
  },
  badge: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  seanceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  seanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
  },
  spotsTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  spotsText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10b981",
  },
  seanceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  seanceDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  speakerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  speakerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  speakerInfo: {
    flex: 1,
  },
  speakerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  speakerBio: {
    fontSize: 12,
    color: "#64748b",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: "#64748b",
  },
  seanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topicTag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8b5cf6",
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  archiveCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  archiveHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  playButton: {
    marginRight: 12,
  },
  archiveInfo: {
    flex: 1,
  },
  archiveTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  archiveSpeaker: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "600",
    marginBottom: 2,
  },
  archiveDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  viewsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: "#64748b",
  },
  archiveSummary: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
});

export default SharingExperiencesScreen;
