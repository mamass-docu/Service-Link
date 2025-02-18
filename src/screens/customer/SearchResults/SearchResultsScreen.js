// src/screens/Customer/SearchResults/SearchResultsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchResultsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const popularServices = [
   'Plumbing Services',
    'Laundry',
    'Car Wash',
    'Cellphone Repair',
    'House Cleaning',
  ];

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleServicePress = (service) => {
    if (service === 'Plumbing Services') {
      navigation.navigate('PlumbingServices');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for House"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView>
        {/* Popular Services Section */}
        <View style={styles.popularServicesContainer}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          {popularServices.map((service, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.serviceItem}
              onPress={() => handleServicePress(service)}
            >
              <Text style={styles.serviceText}>{service}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0, // Removes default padding on Android
  },
  popularServicesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  serviceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  serviceText: {
    fontSize: 16,
    color: '#333',
  },
});

export default SearchResultsScreen;
