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
  Image,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import LocationPickerModal from '../../../../components/LocationPickerModal';

const ServiceDetailsModal = ({ visible, service, onClose, navigation }) => {
  if (!service) return null;

  // Define included and excluded services
  const includedServices = [
    'Detection and diagnosis of leaks',
    'Repairing leaks in plumbing, roofs, and walls',
    'Sealing and waterproofing affected areas',
    'Testing to ensure repairs are effective'
  ];

  const excludedServices = [
    'Major structural repairs unrelated to leaks',
    'Replacement of large sections of roofing or piping',
    'Landscaping or remediation of mold',
    'Decorative or aesthetic enhancements'
  ];

  const handleBookService = () => {
    onClose();
    navigation.navigate('BookService', { 
      service: {
        ...service,
        image: service.image,
        title: service.title,
        price: service.price,
        discountedPrice: service.discountedPrice,
        estimatedTime: service.estimatedTime,
        included: includedServices,
        excluded: excludedServices,
      }
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={modalStyles.backButton}>
              <Feather name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={modalStyles.headerTitle}>{service.title}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={modalStyles.topHeader}>
              <Text style={modalStyles.totalText}>Total: ₱{service.price}</Text>
              <TouchableOpacity 
                style={modalStyles.addToCartButton}
                onPress={handleBookService}
              >
                <Feather name="plus" size={20} color="#FFB800" />
                <Text style={modalStyles.addToCartText}>Book Now</Text>
              </TouchableOpacity>
            </View>

            <Image
              source={{ uri: service.image }}
              style={modalStyles.serviceImage}
              resizeMode="cover"
            />

            <View style={modalStyles.detailsContainer}>
              <Text style={modalStyles.serviceTitle}>{service.title}</Text>
              <Text style={modalStyles.price}>₱{service.price}</Text>
              <Text style={modalStyles.discountPrice}>
                ₱{service.discountedPrice} with code FLOW30
              </Text>
              <Text style={modalStyles.estimatedTime}>
                Estimated Service Time: {service.estimatedTime}
              </Text>
              <Text style={modalStyles.description}>
                Professional services to quickly identify and fix leaks, ensuring your
                property remains dry and damage-free.
              </Text>
            </View>

            <View style={modalStyles.sectionContainer}>
              <Text style={modalStyles.sectionTitle}>Services Included</Text>
              {includedServices.map((item, index) => (
                <Text key={index} style={modalStyles.bulletPoint}>• {item}</Text>
              ))}
            </View>

            <View style={modalStyles.sectionContainer}>
              <Text style={modalStyles.sectionTitle}>Services Excluded</Text>
              {excludedServices.map((item, index) => (
                <Text key={index} style={modalStyles.bulletPoint}>• {item}</Text>
              ))}
            </View>

            <TouchableOpacity 
              style={modalStyles.bottomAddToCartButton}
              onPress={handleBookService}
            >
              <Text style={modalStyles.bottomAddToCartText}>Book This Service</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};


const ServiceCard = ({ service, onPress }) => (
  <TouchableOpacity 
    style={styles.serviceCard} 
    activeOpacity={0.9}
    onPress={() => onPress(service)}
  >
    <View style={styles.cardContent}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: service.image }} 
          style={styles.serviceImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.estimatedTime}>⏱️ {service.estimatedTime}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₱{service.price}</Text>
          <Text style={styles.perHour}>/hr</Text>
        </View>
        <View style={styles.discountContainer}>
          <Text style={styles.discountPrice}>₱{service.discountedPrice}</Text>
          <Text style={styles.discountLabel}>Discounted Price</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const PlumbingServicesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const plumbingServices = [
    {
      id: 1,
      title: 'Leak Repairs',
      image: 'https://remoracleaning.com/wp-content/uploads/2023/07/worker-repairing-water-heater.jpg',
      estimatedTime: '120 Min',
      price: '80',
      discountedPrice: '65',
    },
    {
      id: 2,
      title: 'Sink Clogging',
      image: 'https://www.gopreferred.com/wp-content/uploads/2018/02/iStock-521198018.jpg',
      estimatedTime: '60 Min',
      price: '100',
      discountedPrice: '85',
    },
    {
      id: 3,
      title: 'Toilet Clogging',
      image: 'https://quartermoonplumbing.com/wp-content/uploads/2022/11/unclogging-a-toilet.jpg',
      estimatedTime: '60 Min',
      price: '50',
      discountedPrice: '35',
    },
    {
      id: 4,
      title: 'Bathtub Clogging',
      image: 'https://jyplumbinghvac.com/wp-content/uploads/bathtub-drain-clogged.jpg',
      estimatedTime: '60 Min',
      price: '60',
      discountedPrice: '45',
    },
    {
      id: 5,
      title: 'Water Heater Installation',
      image: 'https://trusteyman.com/wp-content/uploads/2018/05/Water-heater-installation-dos-and-donts.jpeg',
      estimatedTime: '120 Min',
      price: '90',
      discountedPrice: '75',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plumbing</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a service"
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.servicesGrid}>
          {plumbingServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={(service) => {
                setSelectedService(service);
                setModalVisible(true);
              }}
            />
          ))}
        </View>
      </ScrollView>

      <ServiceDetailsModal
        visible={modalVisible}
        service={selectedService}
        navigation={navigation}
        onClose={() => {
          setModalVisible(false);
          setSelectedService(null);
        }}
      />
    </SafeAreaView>
  );
};

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FF4B4B',
    marginLeft: 8,
    fontWeight: '500',
  },
  serviceImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  discountPrice: {
    fontSize: 16,
    color: '#00A651',
    marginBottom: 8,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomAddToCartButton: {
    backgroundColor: '#FF4B4B',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottomAddToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Original styles remain the same
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  servicesGrid: {
    padding: 16,
  },
  serviceCard: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    margin: 12,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  perHour: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00A651',
    marginRight: 6,
  },
  discountLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default PlumbingServicesScreen;
