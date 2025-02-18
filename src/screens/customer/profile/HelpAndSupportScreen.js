import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const HelpAndSupportScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      id: 1,
      question: "How do I book a service?",
      answer:
        "To book a service, simply go to the home screen, select the service you need, choose a service provider, and follow the booking steps.",
    },
    {
      id: 2,
      question: "How do I cancel a booking?",
      answer:
        "You can cancel a booking by going to 'My Bookings', selecting the booking you want to cancel, and clicking the 'Cancel' button. Please note our cancellation policy.",
    },
    {
      id: 3,
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods including credit/debit cards, GCash, and cash payments.",
    },
    // Add more FAQs as needed
  ];

  const supportCategories = [
    {
      icon: "calendar-clock",
      title: "Booking Issues",
      screen: "BookingSupport",
    },
    {
      icon: "credit-card",
      title: "Payment Help",
      screen: "PaymentSupport",
    },
    {
      icon: "account-question",
      title: "Account Help",
      screen: "AccountSupport",
    },
    {
      icon: "shield-check",
      title: "Safety Concerns",
      screen: "SafetySupport",
    },
  ];

  const FaqItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{question}</Text>
          <Icon
            name={expanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#666"
          />
        </View>
        {expanded && <Text style={styles.faqAnswer}>{answer}</Text>}
      </TouchableOpacity>
    );
  };

  const SupportCategory = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
      <View style={styles.categoryIcon}>
        <Icon name={icon} size={24} color="#FFB800" />
      </View>
      <Text style={styles.categoryTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={24} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Quick Help Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>How can we help you?</Text>
          <View style={styles.categoriesGrid}>
            {supportCategories.map((category, index) => (
              <SupportCategory
                key={index}
                icon={category.icon}
                title={category.title}
                onPress={() => navigation.navigate(category.screen)}
              />
            ))}
          </View>
        </View>

        {/* FAQs Section */}
        <View style={styles.faqsContainer}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.contactContainer}>
          <Text style={styles.sectionTitle}>Still need help?</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => navigation.navigate("ContactSupport")}
          >
            <Icon name="message" size={24} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Support Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => navigation.navigate("TermsOfService")}
          >
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  categoryCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF9E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  faqsContainer: {
    padding: 16,
  },
  faqItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#666",
    marginTop: 12,
    lineHeight: 20,
  },
  contactContainer: {
    padding: 16,
    alignItems: "center",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFB800",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  linksContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 16,
  },
  linkItem: {
    padding: 8,
  },
  linkText: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
});

export default HelpAndSupportScreen;
