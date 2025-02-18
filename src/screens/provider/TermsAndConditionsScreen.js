// src/screens/ServiceProvider/TermsAndConditionsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAppContext } from "../../../AppProvider";
import { update } from "../../databaseHelper";

const TermsAndConditionsScreen = ({ navigation }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAppContext();

  const handleAcceptTerms = async () => {
    if (!isAccepted) return;

    setIsLoading(true);
    try {
      await update("users", userId, {
        hasAcceptedTerms: true,
      });
      // await updateDoc(doc(db, "users", userId), {
      //   hasAcceptedTerms: true,
      // });
      navigation.reset({
        index: 0,
        routes: [{ name: "ProviderHome" }],
      });
    } catch (error) {
      console.error("Error updating terms acceptance:", error);
      Alert.alert("Error", "Failed to save your acceptance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.lastUpdated}>Last Updated: January 2024</Text>

        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>1. Service Provider Agreement</Text>
          <Text style={styles.paragraph}>
            Welcome to our service provider platform. This agreement outlines
            your rights, responsibilities, and obligations as a service provider
            on our platform.
          </Text>

          <Text style={styles.sectionTitle}>2. Your Responsibilities</Text>
          <Text style={styles.paragraph}>
            As a service provider, you agree to:{"\n\n"}• Maintain professional
            standards at all times{"\n"}• Provide quality service to all clients
            {"\n"}• Be punctual for all appointments{"\n"}• Communicate
            professionally with clients{"\n"}• Follow all platform guidelines
            and policies
          </Text>

          <Text style={styles.sectionTitle}>3. Quality Standards</Text>
          <Text style={styles.paragraph}>
            You must maintain high quality standards including:{"\n\n"}• Using
            appropriate tools and equipment{"\n"}• Following safety protocols
            {"\n"}• Maintaining cleanliness at work sites{"\n"}• Providing
            accurate time and cost estimates
          </Text>

          {/* Add more sections as needed */}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsAccepted(!isAccepted)}
        >
          <View style={[styles.checkbox, isAccepted && styles.checkboxChecked]}>
            {isAccepted && <Feather name="check" size={16} color="#FFF" />}
          </View>
          <Text style={styles.checkboxLabel}>
            I have read and agree to the Terms & Conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.acceptButton,
            !isAccepted && styles.acceptButtonDisabled,
          ]}
          onPress={handleAcceptTerms}
          disabled={!isAccepted || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.acceptButtonText}>Accept & Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  lastUpdated: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
  },
  bottomContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFB800",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FFB800",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  acceptButton: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TermsAndConditionsScreen;
