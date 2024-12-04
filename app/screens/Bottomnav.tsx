import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const BottomNav: React.FC = () => {
  const route = useRoute();

  // Modified handleNavigation function to prevent navigation to current screen
  const handleNavigation = (screen: string) => {
    const currentScreen = route.name.split("/").pop(); // Handle cases where route.name might include the full path
    if (currentScreen !== screen) {
      router.push(`/screens/${screen}`);
    }
  };

  return (
    <View>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation("HomePage")}
        >
          <FontAwesome name="home" size={24} color="#504538" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation("Assistant")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#504538"
          />
          <Text style={styles.navText}>Assistant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation("Vitals")}
        >
          <FontAwesome
            name="heartbeat" // Heartbeat icon from FontAwesome
            size={24}
            color="#504538"
          />

          <Text style={styles.navText}>Vitals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation("Medication")}
        >
          <Ionicons name="medkit-outline" size={24} color="#504538" />
          <Text style={styles.navText}>Medication</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => handleNavigation("Mytasks")}
        >
          <Ionicons name="checkmark-done-outline" size={24} color="#504538" />
          <Text style={styles.navText}>Tasks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#504538",
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default BottomNav;
