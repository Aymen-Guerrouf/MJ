import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import mockData from "../../../data/mockSpacesData.json";

const { width } = Dimensions.get("window");

const StartupHubScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { startupHub } = mockData;

  const filters = [
    "All",
    "Guides",
    "Funding",
    "Templates",
    "Case Studies",
    "Competitions",
  ];

  const getFilteredResources = () => {
    return startupHub.filter((resource) => {
      const matchesFilter =
        selectedFilter === "All" ||
        (selectedFilter === "Guides" && resource.resourceType === "Guide") ||
        (selectedFilter === "Funding" &&
          resource.resourceType === "Funding Opportunity") ||
        (selectedFilter === "Templates" &&
          resource.resourceType === "Template") ||
        (selectedFilter === "Case Studies" &&
          resource.resourceType === "Case Study") ||
        (selectedFilter === "Competitions" &&
          resource.resourceType === "Competition");

      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case "Guide":
        return "book-outline";
      case "Funding Opportunity":
        return "cash-outline";
      case "Template":
        return "document-text-outline";
      case "Case Study":
        return "newspaper-outline";
      case "Competition":
        return "trophy-outline";
      case "Article":
        return "reader-outline";
      default:
        return "document-outline";
    }
  };

  const getResourceColor = (type) => {
    switch (type) {
      case "Guide":
        return "#6366f1";
      case "Funding Opportunity":
        return "#10b981";
      case "Template":
        return "#f59e0b";
      case "Case Study":
        return "#8b5cf6";
      case "Competition":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const renderResourceCard = (resource) => {
    const iconColor = getResourceColor(resource.resourceType);

    return (
      <TouchableOpacity key={resource.id} style={styles.resourceCard}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: iconColor + "15" },
            ]}
          >
            <Ionicons
              name={getResourceIcon(resource.resourceType)}
              size={24}
              color={iconColor}
            />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.typeBadge}>
              <Text style={[styles.typeText, { color: iconColor }]}>
                {resource.resourceType}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={14} color="#64748b" />
                <Text style={styles.statText}>{resource.views}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="bookmark-outline" size={14} color="#64748b" />
                <Text style={styles.statText}>{resource.saves}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.resourceTitle}>{resource.title}</Text>
        <Text style={styles.resourceDescription} numberOfLines={3}>
          {resource.description}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.categoryTag}>
            <Ionicons name="folder-outline" size={12} color="#6366f1" />
            <Text style={styles.categoryTagText}>{resource.category}</Text>
          </View>
          {resource.estimatedTime && (
            <View style={styles.timeTag}>
              <Ionicons name="time-outline" size={12} color="#64748b" />
              <Text style={styles.timeText}>{resource.estimatedTime}</Text>
            </View>
          )}
        </View>

        <View style={styles.tagsRow}>
          {resource.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFooter}>
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor:
                  resource.difficulty === "Beginner"
                    ? "#d1fae5"
                    : resource.difficulty === "Intermediate"
                    ? "#fef3c7"
                    : "#fecaca",
              },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                {
                  color:
                    resource.difficulty === "Beginner"
                      ? "#10b981"
                      : resource.difficulty === "Intermediate"
                      ? "#f59e0b"
                      : "#ef4444",
                },
              ]}
            >
              {resource.difficulty}
            </Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Resource</Text>
            <Ionicons name="arrow-forward" size={16} color="#6366f1" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredResources = getFilteredResources();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Startup Hub</Text>
        <Text style={styles.headerSubtitle}>
          Resources and opportunities for entrepreneurs
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.activeFilterChip,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.activeFilterChipText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.infoBar}>
        <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
        <Text style={styles.infoText}>
          Discover tools, funding, and knowledge to launch your startup
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredResources.length}{" "}
            {filteredResources.length === 1 ? "resource" : "resources"}
          </Text>
        </View>

        {filteredResources.map(renderResourceCard)}
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
  searchContainer: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  filtersContainer: {
    backgroundColor: "white",
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeFilterChip: {
    backgroundColor: "#f59e0b",
    borderColor: "#f59e0b",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeFilterChipText: {
    color: "white",
  },
  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fef3c7",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#92400e",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  resourceCard: {
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
  cardHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  typeBadge: {
    alignSelf: "flex-start",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
  },
  timeTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#64748b",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "700",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
});

export default StartupHubScreen;
