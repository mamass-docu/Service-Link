// src/screens/Customer/CustomerTermsAndConditionsScreen.js
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
import { update, isLoading, setIsLoading } from "../../databaseHelper";

const CustomerTermsAndConditionsScreen = ({ navigation }) => {
  const [isAccepted, setIsAccepted] = useState(false);
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

      // Navigate to the main dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: "CustomerHome" }],
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
          <Text style={styles.sectionTitle}>1. Customer Agreement</Text>
          <Text style={styles.paragraph}>
            Welcome to our service platform. This agreement outlines your
            rights, responsibilities, and obligations as a customer on our
            platform.
          </Text>

          <Text style={styles.sectionTitle}>2. Service Usage</Text>
          <Text style={styles.paragraph}>
            As a customer, you agree to:{"\n\n"}• Use the platform responsibly
            {"\n"}• Provide accurate information{"\n"}• Respect service
            providers{"\n"}• Follow booking procedures{"\n"}• Maintain proper
            communication
          </Text>

          <Text style={styles.sectionTitle}>3. Booking & Payments</Text>
          <Text style={styles.paragraph}>
            You understand and agree that:{"\n\n"}• Bookings are subject to
            provider availability{"\n"}• Payment terms are as specified{"\n"}•
            Cancellation policies apply{"\n"}• Refund procedures must be
            followed
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
          disabled={!isAccepted || isLoading()}
        >
          {isLoading() ? (
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
    fontFamily: "Poppins-SemiBold",
  },
  scrollView: {
    flex: 1,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
  },
  paragraph: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
  },
});

export default CustomerTermsAndConditionsScreen;
