import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
export default function Welcomescreen() {
  return (``
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7ebdd",
        padding: 20,
        height: "100%",
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <View
        style={{
          marginTop: 20,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 300,
            height: 400,
          }}
        >
          <LottieView
            source={require("./../../assets/Animations/Animationelderly1.json")}
            autoPlay
            loop
          />
        </View>
        <Text
          style={{
            fontSize: 30,
            textAlign: "center",
            fontWeight: "700",
            color: "#2c3e50",
            lineHeight: 36,
            marginBottom: 10,
            marginTop: 40,
          }}
        >
          Welcome to ElderlyAssist
        </Text>
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: "#7f8c8d",
            paddingHorizontal: 15,
            marginBottom: 50,
          }}
        >
          Your comprehensive solution for enhanced elderly care and
          independence.
        </Text>
        <Pressable
          style={{
            paddingVertical: 15,
            paddingHorizontal: 20,
            marginTop: 200,
            backgroundColor: "#504538",
            width: "100%",
            borderRadius: 25,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => router.push("screens/HomePage")}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Get Started
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
