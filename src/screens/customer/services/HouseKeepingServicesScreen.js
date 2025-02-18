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

const ServiceDetailsModal = ({ visible, service, onClose }) => {
  if (!service) return null;

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
              <TouchableOpacity style={modalStyles.addToCartButton}>
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
                ₱{service.discountedPrice} with code CLEAN30
              </Text>
              <Text style={modalStyles.estimatedTime}>
                Estimated Time: {service.estimatedTime}
              </Text>
              <Text style={modalStyles.description}>{service.description}</Text>
            </View>

            <View style={modalStyles.sectionContainer}>
              <Text style={modalStyles.sectionTitle}>Services Included</Text>
              {service.included.map((item, index) => (
                <Text key={index} style={modalStyles.bulletPoint}>• {item}</Text>
              ))}
            </View>

            <View style={modalStyles.sectionContainer}>
              <Text style={modalStyles.sectionTitle}>Services Excluded</Text>
              {service.excluded.map((item, index) => (
                <Text key={index} style={modalStyles.bulletPoint}>• {item}</Text>
              ))}
            </View>

            <TouchableOpacity style={modalStyles.bottomAddToCartButton}>
              <Text style={modalStyles.bottomAddToCartText}>Book Now</Text>
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
          <Text style={styles.perService}>/service</Text>
        </View>
        <View style={styles.discountContainer}>
          <Text style={styles.discountPrice}>₱{service.discountedPrice}</Text>
          <Text style={styles.discountLabel}>Discounted</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const HouseKeepingServicesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const cleaningServices = [
    {
      id: 1,
      title: 'Full Home Cleaning',
      image: 'https://www.balajicleaningagency.com/img/service/Untitled-02.jpg',
      estimatedTime: '4 Hours',
      price: '2500',
      discountedPrice: '2000',
      description: 'Complete home cleaning service including all rooms, bathrooms, and kitchen.',
      included: [
        'General dusting and cleaning',
        'Floor cleaning and mopping',
        'Bathroom sanitization',
        'Kitchen deep cleaning'
      ],
      excluded: [
        'Window cleaning',
        'Furniture moving',
        'Wall washing',
        'Outdoor cleaning'
      ]
    },
    {
      id: 2,
      title: 'Deep Cleaning',
      image: 'https://www.cleansweepofamerica.com/wp-content/uploads/2020/07/what-is-included-in-a-deep-house-cleaning.jpg',
      estimatedTime: '6 Hours',
      price: '3500',
      discountedPrice: '1000',
      description: 'Intensive cleaning service focusing on deep sanitization and detailed cleaning.',
      included: [
        'Deep furniture cleaning',
        'Carpet shampooing',
        'Cabinet organization',
        'Appliance cleaning'
      ],
      excluded: [
        'Pest control',
        'Repairs',
        'Paint touch-ups',
        'Garden maintenance'
      ]
    },
    {
      id: 3,
      title: 'Move In/Out Cleaning',
      image: 'https://nextdaycleaning.com/wp-content/uploads/2021/01/Move-In-Move-Out-Cleaning-Checklist-Latest-2021-Update.jpg',
      estimatedTime: '8 Hours',
      price: '4500',
      discountedPrice: '1500',
      included: [
        'Complete property cleaning',
        'Cabinet and drawer cleaning',
        'Window cleaning',
        'Floor deep cleaning'
      ],
      excluded: [
        'Furniture assembly',
        'Painting services',
        'Repairs',
        'Junk removal'
      ]
    }
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
        <Text style={styles.headerTitle}>House Keeping Services</Text>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services"
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.servicesGrid}>
          {cleaningServices.map((service) => (
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
    color: '#FFB800',
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
    color: '#FFB800',
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
    backgroundColor: '#FFB800',
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
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
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  scrollContent: {
    flexGrow: 1,
  },
  servicesGrid: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 120,
    height: 120,
    margin: 12,
    borderRadius: 8,
    overflow: 'hidden',
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
    fontWeight: '600',
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
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  perService: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFB800',
    marginRight: 4,
  },
  discountLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default HouseKeepingServicesScreen;
