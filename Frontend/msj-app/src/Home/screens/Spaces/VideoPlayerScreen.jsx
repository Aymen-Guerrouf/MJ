import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const VideoPlayerScreen = ({ route, navigation }) => {
  const { lesson } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  // Convert YouTube URL to video ID
  const getVideoId = (url) => {
    let videoId = "";

    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }

    return videoId;
  };

  const videoId = getVideoId(lesson.videoUrl);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // Create HTML with embedded YouTube player for expo-av WebView
  const youtubeHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; }
          body { 
            background-color: #000;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          #player { 
            width: 100vw;
            height: 56.25vw; /* 16:9 aspect ratio */
            max-height: 100vh;
            max-width: 177.78vh; /* 16:9 aspect ratio */
          }
        </style>
      </head>
      <body>
        <div id="player"></div>
        <script>
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          var player;
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              videoId: '${videoId}',
              playerVars: {
                'playsinline': 1,
                'rel': 0,
                'modestbranding': 1,
                'controls': 1,
              },
              events: {
                'onReady': onPlayerReady,
              }
            });
          }

          function onPlayerReady(event) {
            window.ReactNativeWebView?.postMessage('ready');
          }
        </script>
      </body>
    </html>
  `;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lesson.title}
          </Text>
          <View style={styles.headerMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>
                {formatDuration(lesson.duration)}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="eye-outline" size={14} color="#64748b" />
              <Text style={styles.metaText}>{lesson.views} views</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* YouTube Video Player */}
        <View style={styles.videoContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
          <WebView
            ref={videoRef}
            style={styles.webview}
            source={{ html: youtubeHTML }}
            allowsFullscreenVideo={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scrollEnabled={false}
            onLoadEnd={() => setIsLoading(false)}
            onMessage={(event) => {
              if (event.nativeEvent.data === "ready") {
                setIsLoading(false);
              }
            }}
          />
        </View>

        {/* Video Info */}
        <View style={styles.infoContainer}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{lesson.category}</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor:
                    lesson.difficulty === "Beginner"
                      ? "#d1fae5"
                      : lesson.difficulty === "Intermediate"
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
                      lesson.difficulty === "Beginner"
                        ? "#10b981"
                        : lesson.difficulty === "Intermediate"
                        ? "#f59e0b"
                        : "#ef4444",
                  },
                ]}
              >
                {lesson.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.description}>{lesson.description}</Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {lesson.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Like ({lesson.likes})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bookmark-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={24} color="#6366f1" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  headerMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
  },
  content: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    height: (width * 9) / 16,
    backgroundColor: "#000",
    position: "relative",
  },
  webview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    zIndex: 10,
  },
  loadingText: {
    color: "white",
    marginTop: 12,
    fontSize: 14,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  playButtonLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  infoContainer: {
    backgroundColor: "white",
    padding: 16,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366f1",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  actionButton: {
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: "#6366f1",
    fontWeight: "600",
  },
});

export default VideoPlayerScreen;
