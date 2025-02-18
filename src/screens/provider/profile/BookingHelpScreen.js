// src/screens/ServiceProvider/BookingHelpScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const BookingHelpScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [bookingId, setBookingId] = useState('');

  const handleSubmit = () => {
    if (!bookingId.trim() || !description.trim()) {
      Alert.alert(
        'Missing Information',
        'Please fill in all the required fields.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Here you would typically send the data to your backend
    Alert.alert(
      'Report Submitted',
      'We have received your report and will get back to you soon.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Issues</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Issue Form */}
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.label}>Booking ID*</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your booking ID"
              value={bookingId}
              onChangeText={setBookingId}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Describe your issue*</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Please provide details about your booking issue"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor="#999"
            />
          </View>

          {/* Common Issues */}
          <View style={styles.commonIssuesSection}>
            <Text style={styles.sectionTitle}>Common Booking Issues</Text>
            <View style={styles.issuesList}>
              <Text style={styles.issueItem}>• Booking cancellation</Text>
              <Text style={styles.issueItem}>• Service provider didn't arrive</Text>
              <Text style={styles.issueItem}>• Wrong service booked</Text>
              <Text style={styles.issueItem}>• Schedule modification</Text>
              <Text style={styles.issueItem}>• Payment issues</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Need immediate assistance?</Text>
            <Text style={styles.contactText}>
              Contact our 24/7 support team{'\n'}
              Email: support@servicelink.com{'\n'}
              Phone: (02) 8123 4567
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!bookingId.trim() || !description.trim()) && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={!bookingId.trim() || !description.trim()}
      >
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FFFFFF',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#FFFFFF',
    height: 120,
    textAlignVertical: 'top',
  },
  commonIssuesSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  issuesList: {
    gap: 8,
  },
  issueItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contactSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#0088FF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingHelpScreen;
