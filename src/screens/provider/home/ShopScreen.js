import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const ViewShopScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('services');
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [shopInfo, setShopInfo] = useState({
    name: "CleanPro Laundry Services",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3",
    description: "Professional laundry services with state-of-the-art equipment. We provide quality cleaning for all types of garments with eco-friendly detergents.",
    email: "cleanpro@example.com",
    phone: "+63 912 345 6789",
    address: "123 Main Street, Makati City, Metro Manila",
    rating: 4.8,
    reviews: 156
  });

  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
  });

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Regular Wash & Fold",
      price: "₱75/kg",
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3",
      description: "Regular washing, drying, and folding service for everyday clothes."
    },
    {
      id: 2,
      name: "Dry Cleaning",
      price: "₱250/piece",
      image: "https://black-and-white.co.in/wp-content/uploads/2024/04/what-is-dry-cleaning.jpg",
      description: "Professional dry cleaning for delicate garments and formal wear."
    },
    {
      id: 3,
      name: "Express Service",
      price: "₱100/kg",
      image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?ixlib=rb-4.0.3",
      description: "Same-day washing and folding service for urgent needs."
    },
    {
      id: 4,
      name: "Bedding & Linens",
      price: "₱150/kg",
      image: "https://pyxis.nymag.com/v1/imgs/8b2/520/9b87009ca861876a5849df78499bef2e0c-EvergreenLinen.1x.rsquare.w1400.jpg",
      description: "Specialized cleaning for bedsheets, blankets, and other linens."
    }
  ]);

  const [reviews] = useState([
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      date: "2023-11-01",
      comment: "Excellent service! My clothes came back perfectly clean and fresh.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      user: "Maria Garcia",
      rating: 4,
      date: "2023-10-28",
      comment: "Very good service, but delivery was a bit delayed.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      user: "David Smith",
      rating: 5,
      date: "2023-10-25",
      comment: "Best laundry service in town! Will definitely use again.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      user: "Sarah Johnson",
      rating: 4,
      date: "2023-10-20",
      comment: "Professional staff and great quality cleaning.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      user: "Michael Lee",
      rating: 5,
      date: "2023-10-15",
      comment: "They handled my delicate clothes with care. Very satisfied!",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    }
  ]);
    const handleEditShop = () => {
    setEditingShop({...shopInfo});
    setShowEditShop(true);
  };

  const handleBannerImageSelect = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to your photo library to change banner image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [16, 9],
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0].uri) {
        setShopInfo({
          ...shopInfo,
          image: result.assets[0].uri
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
    const serviceToAdd = {
      id: newId,
      name: newService.name,
      price: `₱${newService.price}`,
      description: newService.description,
      image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3",
    };
    
    setServices([...services, serviceToAdd]);
    Alert.alert('Success', 'Service added successfully!');
    setShowAddService(false);
    setNewService({ name: '', price: '', description: '' });
  };

  const handleEditService = (service) => {
    const serviceToEdit = {
      ...service,
      price: service.price.replace('₱', '')
    };
    setEditingService(serviceToEdit);
    setShowEditService(true);
  };

  const handleUpdateService = () => {
    if (!editingService) {
      return;
    }

    if (!editingService.name || !editingService.price || !editingService.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const updatedService = {
      ...editingService,
      price: editingService.price.startsWith('₱') ? editingService.price : `₱${editingService.price}`
    };

    setServices(services.map(service => 
      service.id === editingService.id ? updatedService : service
    ));
    
    Alert.alert('Success', 'Service updated successfully!');
    setShowEditService(false);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setServices(services.filter(service => service.id !== serviceId));
            Alert.alert('Success', 'Service deleted successfully!');
          },
        },
      ]
    );
  };

  // Review Card Component
  const ReviewCard = ({ review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{review.user}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="star"
                size={16}
                color={index < review.rating ? "#FFB800" : "#DDDDDD"}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{review.date}</Text>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shop Banner with Edit Button */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: shopInfo.image }}
            style={styles.shopBanner}
          />
          <TouchableOpacity 
            style={styles.editBannerButton}
            onPress={handleBannerImageSelect}
          >
            <Icon name="camera" size={20} color="#FFFFFF" style={styles.cameraIcon} />
            <Text style={styles.editBannerText}>Change Shop Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Shop Info */}
        <View style={styles.shopInfoContainer}>
          <Text style={styles.shopName}>{shopInfo.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#FFB800" />
            <Text style={styles.ratingText}>{shopInfo.rating}</Text>
            <Text style={styles.reviewCount}>({shopInfo.reviews} reviews)</Text>
          </View>

          <Text style={styles.description}>{shopInfo.description}</Text>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Icon name="email" size={20} color="#666" />
              <Text style={styles.contactText}>{shopInfo.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="phone" size={20} color="#666" />
              <Text style={styles.contactText}>{shopInfo.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="map-marker" size={20} color="#666" />
              <Text style={styles.contactText}>{shopInfo.address}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'services' && styles.activeTab]}
            onPress={() => setActiveTab('services')}
          >
            <Text style={[styles.tabText, activeTab === 'services' && styles.activeTabText]}>
              Our Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Services Tab Content */}
        {activeTab === 'services' && (
          <View style={styles.servicesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Services</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddService(true)}
              >
                <Icon name="plus" size={20} color="#FFB800" />
                <Text style={styles.addButtonText}>Add Service</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <Image
                    source={{ uri: service.image }}
                    style={styles.serviceImage}
                  />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                    <Text style={styles.serviceDescription} numberOfLines={2}>
                      {service.description}
                    </Text>
                  </View>
                  <View style={styles.serviceActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditService(service)}
                    >
                      <Icon name="pencil" size={20} color="#FFB800" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteService(service.id)}
                    >
                      <Icon name="delete" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Reviews Tab Content */}
        {activeTab === 'reviews' && (
          <View style={styles.reviewsSection}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Service Modal */}
      <Modal
        visible={showAddService}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Service</Text>
              <TouchableOpacity onPress={() => {
                setShowAddService(false);
                setNewService({ name: '', price: '', description: '' });
              }}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Service Name"
              value={newService.name}
              onChangeText={(text) => setNewService({...newService, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Price (₱)"
              value={newService.price}
              onChangeText={(text) => setNewService({...newService, price: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newService.description}
              onChangeText={(text) => setNewService({...newService, description: text})}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity 
              style={styles.addServiceButton}
              onPress={handleAddService}
            >
              <Text style={styles.addServiceButtonText}>Add Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        visible={showEditService}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Service</Text>
              <TouchableOpacity onPress={() => setShowEditService(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Service Name"
              value={editingService?.name}
              onChangeText={(text) => setEditingService({...editingService, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={editingService?.price?.replace('₱', '')}
              onChangeText={(text) => setEditingService({...editingService, price: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={editingService?.description}
              onChangeText={(text) => setEditingService({...editingService, description: text})}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity 
              style={styles.addServiceButton}
              onPress={handleUpdateService}
            >
              <Text style={styles.addServiceButtonText}>Update Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  bannerContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  shopBanner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  editBannerButton: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cameraIcon: {
    marginRight: 6,
  },
  editBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  shopInfoContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  shopName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666666',
  },
  description: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  contactInfo: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFB800',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFB800',
    fontWeight: '600',
  },
  servicesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: '#FFB800',
    fontWeight: '600',
    marginLeft: 4,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFB800',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  serviceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 16,
  },
  viewButton: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#FFB800',
    fontWeight: '600',
  },
  reviewsSection: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#666666',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addServiceButton: {
    backgroundColor: '#FFB800',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addServiceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ViewShopScreen;