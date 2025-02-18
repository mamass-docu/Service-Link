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
import BookServiceScreen from '../bookings/BookServiceScreen';

const ServiceDetailsModal = ({ visible, service, onClose, navigation }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  if (!service) return null;

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  return (
    <>
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
                  onPress={handleBookNow}
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
                <Text style={styles.warningText}>⚠️ Professional Car Wash Service</Text>
                <Text style={modalStyles.price}>₱{service.price}</Text>
                <Text style={modalStyles.discountPrice}>
                  ₱{service.discountedPrice}
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

              <TouchableOpacity 
                style={modalStyles.bottomAddToCartButton}
                onPress={handleBookNow}
              >
                <Text style={modalStyles.bottomAddToCartText}>Book Now</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showBookingModal}
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}
      >
        <BookServiceScreen
          route={{ params: { service: service } }}
          navigation={{
            goBack: () => setShowBookingModal(false),
            navigate: (screen) => {
              setShowBookingModal(false);
              navigation.navigate(screen);
            }
          }}
        />
      </Modal>
    </>
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

const CarWashServicesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const carWashServices = [
    {
      id: 1,
      title: 'Basic Wash',
      image: 'https://img1.wsimg.com/isteam/stock/7075/:/cr=t:0%25,l:0%25,w:100%25,h:100%25',
      estimatedTime: '30 Minutes',
      price: '350',
      discountedPrice: '300',
      description: 'Exterior wash with basic cleaning for a quick refresh of your vehicle.',
      included: [
        'Exterior wash',
        'Tire cleaning',
        'Basic drying',
        'Windows cleaning'
      ],
      excluded: [
        'Interior cleaning',
        'Waxing',
        'Engine cleaning',
        'Undercarriage wash'
      ]
    },
    {
      id: 2,
      title: 'Premium Wash',
      image: 'https://protech.mc/wp-content/uploads/2022/09/lavage.jpg',
      estimatedTime: '1 Hour',
      price: '650',
      discountedPrice: '550',
      description: 'Complete interior and exterior cleaning for a thorough car wash experience.',
      included: [
        'Full exterior wash',
        'Interior vacuum',
        'Dashboard cleaning',
        'Tire shine'
      ],
      excluded: [
        'Engine cleaning',
        'Ceramic coating',
        'Paint correction',
        'Stain removal'
      ]
    },
    {
      id: 3,
      title: 'Deluxe Detail',
      image: 'https://www.shutterstock.com/image-photo/red-sportscars-wheels-covered-shampoo-600nw-2287564577.jpg',
      estimatedTime: '2 Hours',
      price: '1200',
      discountedPrice: '1000',
      description: 'Premium detailing service with waxing and interior deep cleaning.',
      included: [
        'Full detailing',
        'Wax application',
        'Leather treatment',
        'Deep interior cleaning'
      ],
      excluded: [
        'Paint repair',
        'Upholstery repair',
        'Ceramic coating',
        'Rust treatment'
      ]
    }
  ];

  const filteredServices = carWashServices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>Car Wash Services</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
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
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
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
  warningText: {
    fontSize: 14,
    color: '#FF4444',
    marginBottom: 8,
  },
});

export default CarWashServicesScreen;