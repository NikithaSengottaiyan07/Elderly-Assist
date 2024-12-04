import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import CircularProgress from "react-native-circular-progress-indicator";
import { router } from "expo-router";
import BottomNav from "./Bottomnav";

const { width } = Dimensions.get("window");

const Vitals = () => {
  const healthVitals = [
    {
      title: "Pulse Rate",
      value: 75,
      unit: "bpm",
      safeRange: [60, 100],
      icon: "heartbeat",
      //description: "Normal resting heart rate",
    },
    {
      title: "Blood Pressure",
      systolic: 120,
      diastolic: 80,
      unit: "mmHg",
      icon: "tint",
      //description: "Optimal blood pressure",
      ranges: {
        optimal: { systolic: [0, 119], diastolic: [0, 79], color: "#4CAF50" },
        normal: { systolic: [120, 129], diastolic: [80, 84], color: "#8BC34A" },
        highNormal: {
          systolic: [130, 139],
          diastolic: [85, 89],
          color: "#FFC107",
        },
        stage1: { systolic: [130, 139], diastolic: [80, 89], color: "#FF9800" },
        stage2: {
          systolic: [140, Infinity],
          diastolic: [90, Infinity],
          color: "#F44336",
        },
      },
    },
    {
      title: "Oxygen Level",
      value: 98,
      unit: "%",
      safeRange: [95, 100],
      icon: "lungs",
      //description: "Excellent oxygen saturation",
    },
    {
      title: "Temperature",
      value: 97.9,
      unit: "°F",
      safeRange: [96, 99],
      icon: "thermometer-half",
      //description: "Normal body temperature",
    },
  ];

  const getCircleColor = (value: number, [min, max]: number[]) => {
    if (value >= min && value <= max) {
      return {
        color: "#4CAF50",
        gradient: ["#4CAF50", "#81C784"],
      };
    }
    return {
      color: "#F44336",
      gradient: ["#F44336", "#E57373"],
    };
  };

  const getBPColor = (systolic: number, diastolic: number, ranges: any) => {
    for (const key in ranges) {
      const range = ranges[key];
      if (
        systolic >= range.systolic[0] &&
        systolic <= range.systolic[1] &&
        diastolic >= range.diastolic[0] &&
        diastolic <= range.diastolic[1]
      ) {
        return range.color;
      }
    }
    return "#F44336";
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Health Dashboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello, User!</Text>
          <Text style={styles.pageDescription}>Take a look at your vitals</Text>
        </View>

        <View style={styles.grid}>
          {healthVitals.map((vital, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <FontAwesome5
                  name={vital.icon}
                  size={24}
                  color="#2c3e50"
                  style={styles.vitalIcon}
                />
                <Text style={styles.title}>{vital.title}</Text>
              </View>

              {vital.title === "Blood Pressure" ? (
                <CircularProgress
                  radius={width * 0.15}
                  activeStrokeWidth={15}
                  inActiveStrokeWidth={15}
                  value={vital.systolic ?? 0}
                  maxValue={150}
                  progressValueFontSize={24}
                  valueSuffix={vital.unit}
                  inActiveStrokeColor="#E0E0E0"
                  inActiveStrokeOpacity={0.2}
                  activeStrokeColor={getBPColor(
                    vital.systolic ?? 0,
                    vital.diastolic ?? 0,
                    vital.ranges
                  )}
                  progressValueColor="#2c3e50"
                  duration={1500}
                />
              ) : (
                <CircularProgress
                  radius={width * 0.15}
                  activeStrokeWidth={15}
                  inActiveStrokeWidth={15}
                  value={vital.value}
                  maxValue={vital.safeRange?.[1] || 100}
                  progressValueFontSize={24}
                  valueSuffix={vital.unit}
                  inActiveStrokeColor="#E0E0E0"
                  inActiveStrokeOpacity={0.2}
                  activeStrokeColor={
                    getCircleColor(vital.value, vital.safeRange || [0, 100])
                      .color
                  }
                  progressValueColor="#2c3e50"
                  duration={1500}
                />
              )}
              <Text style={styles.description}>{vital.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 5,
  },
  settingsButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    flex: 1,
    textAlign: "center",
  },
  welcomeSection: {
    marginBottom: 25,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  pageDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -5,
  },
  card: {
    width: width * 0.44,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 5,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  vitalIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 1,
  },
  bpValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 12,
    textAlign: "center",
  },
});

export default Vitals;