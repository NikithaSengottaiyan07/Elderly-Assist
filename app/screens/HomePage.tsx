import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import BottomNav from "./Bottomnav";
import { LinearGradient } from 'expo-linear-gradient';

const HomePage = () => {
  const features = [
    {
      title: "Voice Assistant",
      description: "Interact seamlessly using voice commands for better assistance.",
      icon: <Ionicons name="mic-outline" size={32} color="#4A90E2" />,
    },
    {
      title: "Fall Detection",
      description: "Advanced sensors detect falls and activate airbags to reduce injury risk.",
      icon: <Ionicons name="alert-circle-outline" size={32} color="#4A90E2" />,
    },
    {
      title: "Emergency Alerts",
      description: "Send instant notifications to family and emergency services.",
      icon: <Ionicons name="notifications-outline" size={32} color="#4A90E2" />,
    },
    {
      title: "Health Monitoring",
      description: "Keep track of pulse rate, blood pressure, SpO2, and body temperature.",
      icon: <FontAwesome name="heartbeat" size={32} color="#4A90E2" />,
    },
    {
      title: "Cost Reduction",
      description: "Affordable, all-in-one solution for elderly care and assistance.",
      icon: <Ionicons name="wallet-outline" size={32} color="#4A90E2" />,
    },
    {
      title: "Pill Dispenser",
      description: "Automated pill dispenser to manage and remind users of medication schedules.",
      icon: <Ionicons name="medkit-outline" size={32} color="#4A90E2" />,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A90E2', '#357ABD']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.push("/")} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ElderlyAssist</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* SOS Alert Section */}
        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={styles.sosButton}
            onPress={() => alert("Emergency Alert Sent!")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF5252', '#FF1744']}
              style={styles.sosGradient}
            >
              <Text style={styles.sosText}>SOS</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.sosDescription}>Emergency Alert</Text>
          <Text style={styles.sosNote}>Use SOS only in case of Emergency</Text>
          </View>

        {/* Features Grid */}
        <View style={styles.cardsContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.card}
              activeOpacity={0.9}
            >
              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  {feature.icon}
                </View>
              </View>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav/>
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
    padding: 20,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor:"#ffff",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  sosContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
    paddingHorizontal: 20,
  },
  sosButton: {
    width: 110,
    height: 110,
    borderRadius: 55,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  sosGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  sosText: {
    color: "white",
    fontSize: 28,
    fontWeight: "800",
  },
  sosDescription: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 15,
  },
  cardsContainer: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 13,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 18,
  },
  sosNote: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 5,
  },
});

export default HomePage;