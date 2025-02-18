// src/screens/ServiceProvider/AddServicesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddServicesScreen = ({ navigation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [shopImage, setShopImage] = useState(null);
  const [shopDetails, setShopDetails] = useState({
    shopName: '',
    description: '',
    phone: '',
    email: '',
    address: '',
  });

  const services = [
    "Aircon",
    "Car Repair",
    "Car Wash",
    "Phone Repair",
    "House Keeping",
    "Electrical",
    "Laundry",
    "Massage",
    "Plumbing",
    "Watch Repair"
  ];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setShopImage(result.assets[0].uri);
    }
  };

  const selectService = (service) => {
    setSelectedService(service);
    setIsDropdownOpen(false);
  };

  const validateForm = () => {
    if (!selectedService) {
      Alert.alert('Error', 'Please select a service type');
      return false;
    }
    if (!shopImage) {
      Alert.alert('Error', 'Please upload a shop image');
      return false;
    }
    if (!shopDetails.shopName.trim()) {
      Alert.alert('Error', 'Please enter your shop name');
      return false;
    }
    if (!shopDetails.description.trim()) {
      Alert.alert('Error', 'Please enter a shop description');
      return false;
    }
    if (!shopDetails.phone.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return false;
    }
    if (!shopDetails.email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return false;
    }
    if (!shopDetails.address.trim()) {
      Alert.alert('Error', 'Please enter your shop address');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
  
    Alert.alert(
      'Success',
      'Shop details saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('VerificationStatus', { 
            fromAddServices: true,
            currentStep: 4  // Moving to step 4 (Business Hours)
          })
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Shop</Text>
      </View>

      <ScrollView 
        style={styles.content}
        nestedScrollEnabled={true}
      >
        {/* Services Dropdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Type</Text>
          <TouchableOpacity 
            style={styles.dropdownHeader}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={styles.dropdownText}>
              {selectedService || 'Select a service'}
            </Text>
            <Feather 
              name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <ScrollView 
              style={styles.dropdownContent}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {services.map((service, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.serviceItem,
                    index === services.length - 1 && styles.lastServiceItem,
                    selectedService === service && styles.selectedServiceItem
                  ]}
                  onPress={() => selectService(service)}
                >
                  <View style={[
                    styles.radio,
                    selectedService === service && styles.radioSelected
                  ]}>
                    {selectedService === service && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.serviceText,
                    selectedService === service && styles.selectedServiceText
                  ]}>
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Shop Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Image</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {shopImage ? (
              <Image source={{ uri: shopImage }} style={styles.shopImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={40} color="#666666" />
                <Text style={styles.uploadText}>Upload Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Shop Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop Details</Text>

          <Text style={styles.label}>Shop Name</Text>
          <TextInput
            style={styles.input}
            value={shopDetails.shopName}
            onChangeText={(text) => setShopDetails({...shopDetails, shopName: text})}
            placeholder="Enter shop name"
          />
          
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={shopDetails.description}
            onChangeText={(text) => setShopDetails({...shopDetails, description: text})}
            placeholder="Enter shop description"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={shopDetails.phone}
            onChangeText={(text) => setShopDetails({...shopDetails, phone: text})}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={shopDetails.email}
            onChangeText={(text) => setShopDetails({...shopDetails, email: text})}
            placeholder="Enter email address"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={shopDetails.address}
            onChangeText={(text) => setShopDetails({...shopDetails, address: text})}
            placeholder="Enter complete address"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF2',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,
    elevation: 2,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    marginBottom: 4,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  dropdownContent: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8ECF2',
    maxHeight: 250,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF2',
  },
  selectedServiceItem: {
    backgroundColor: '#F0F7FF',
  },
  lastServiceItem: {
    borderBottomWidth: 0,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E8ECF2',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  serviceText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  selectedServiceText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  imageUpload: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  shopImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    width: '100%',
    height: '100%',
  },
  uploadText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666666',
  },
  label: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#1A1A1A',
  },
  textArea: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    height: 140,
    textAlignVertical: 'top',
    color: '#1A1A1A',
  },
  saveButton: {
    backgroundColor: '#FFB800',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: -10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default AddServicesScreen;
