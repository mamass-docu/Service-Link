import React, { useEffect, useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAppContext } from "../../../../AppProvider";
import { add, find, get, remove, update, where } from "../../../databaseHelper";
import { selectImage } from "../../../ImageSelector";
import { updateProviderUserImage } from "../../../db/UpdateUser";
import { uploadImage } from "../../../cloudinary";

const ViewShopScreen = ({ navigation }) => {
  const { userId, userName, userImage, userEmail, setUserImage } =
    useAppContext();

  const [activeTab, setActiveTab] = useState("services");
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [shopInfo, setShopInfo] = useState({});

  const [newService, setNewService] = useState({
    name: null,
    price: null,
    discountedPrice: null,
    description: null,
  });

  const [services, setServices] = useState([]);

  const [reviews] = useState([
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      date: "2023-11-01",
      comment:
        "Excellent service! My clothes came back perfectly clean and fresh.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      user: "Maria Garcia",
      rating: 4,
      date: "2023-10-28",
      comment: "Very good service, but delivery was a bit delayed.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      user: "David Smith",
      rating: 5,
      date: "2023-10-25",
      comment: "Best laundry service in town! Will definitely use again.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      user: "Sarah Johnson",
      rating: 4,
      date: "2023-10-20",
      comment: "Professional staff and great quality cleaning.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: 5,
      user: "Michael Lee",
      rating: 5,
      date: "2023-10-15",
      comment: "They handled my delicate clothes with care. Very satisfied!",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ]);

  const fetchData = async () => {
    const userSnap = await find("users", userId, false);
    const userData = userSnap.data();
    setShopInfo({
      description: userData.description,
      phoneNumber: userData.phoneNumber,
      address: userData.address,
      service: userData.service,
    });
    fetchServices();
  };

  const fetchServices = async () => {
    const snap = await get(
      "providerServices",
      false,
      where("providerId", "==", userId)
    );
    setServices(
      snap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          task: data.task,
          price: data.price,
          discountedPrice: data.discountedPrice,
          description: data.description,
        };
      })
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateProfileImage = async () => {
    const image = await selectImage();
    if (!image) return;

    // const imageName = image.fileName;
    // const imageExtension = imageName.substring(imageName.lastIndexOf("."));
    // const filename = `${userId}${imageExtension}`;

    try {
      // await deleteImage(userImage);
      const imgUrl = await uploadImage(image, userId);

      await update(
        "users",
        userId,
        {
          image: imgUrl,
        },
        false
      );

      await updateProviderUserImage(userId, imgUrl);

      setUserImage(imgUrl);
      alert("Image uploaded successfully!");
    } catch (e) {
      alert(e);
    }
  };

  const handleEditShop = () => {
    setEditingShop({ ...shopInfo });
    setShowEditShop(true);
  };

  const handleAddService = async () => {
    if (
      !newService.task ||
      !newService.price ||
      !newService.discountedPrice ||
      !newService.description
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const serviceToAdd = {
        task: newService.task,
        service: shopInfo.service,
        price: newService.price,
        discountedPrice: newService.discountedPrice,
        description: newService.description,
        image: userImage,
        providerId: userId,
        providerName: userName,
      };

      await add("providerServices", serviceToAdd, false);
      
      fetchServices()

      Alert.alert("Success", "Service added successfully!");
      setShowAddService(false);
      setNewService({ name: null, price: null, description: null });
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditService = (service) => {
    setEditingService({
      ...service,
      price: service.price + "",
      discountedPrice: service.discountedPrice + "",
    });
    setShowEditService(true);
  };

  const handleUpdateService = async () => {
    if (!editingService) {
      return;
    }

    if (
      !editingService.task ||
      !editingService.price ||
      !editingService.discountedPrice ||
      !editingService.description
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const updatedService = {
      task: newService.task,
      price: newService.price,
      discountedPrice: newService.discountedPrice,
      description: newService.description,
    };

    await update("providerServices", editingService.id, updatedService, false);

    fetchServices()

    Alert.alert("Success", "Service updated successfully!");
    setShowEditService(false);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await remove("providerServices", serviceId, false)
            fetchServices()
            Alert.alert("Success", "Service deleted successfully!");
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
          <Image source={{ uri: userImage }} style={styles.shopBanner} />
          <TouchableOpacity
            style={styles.editBannerButton}
            onPress={updateProfileImage}
          >
            <Icon
              name="camera"
              size={20}
              color="#FFFFFF"
              style={styles.cameraIcon}
            />
            <Text style={styles.editBannerText}>Change Shop Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Shop Info */}
        <View style={styles.shopInfoContainer}>
          <Text style={styles.shopName}>{userName}</Text>

          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color="#FFB800" />
            <Text style={styles.ratingText}>4.1</Text>
            <Text style={styles.reviewCount}>(100 reviews)</Text>
          </View>

          <Text style={styles.description}>{shopInfo.description}</Text>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Icon name="email" size={20} color="#666" />
              <Text style={styles.contactText}>{userEmail}</Text>
            </View>
            <View style={styles.contactItem}>
              <Icon name="phone" size={20} color="#666" />
              <Text style={styles.contactText}>{shopInfo.phoneNumber}</Text>
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
            style={[styles.tab, activeTab === "services" && styles.activeTab]}
            onPress={() => setActiveTab("services")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "services" && styles.activeTabText,
              ]}
            >
              Our Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "reviews" && styles.activeTabText,
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Services Tab Content */}
        {activeTab === "services" && (
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
                    source={{
                      uri: userImage,
                    }}
                    style={styles.serviceImage}
                  />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.task}</Text>
                    <Text style={styles.servicePrice}>₱{service.price}</Text>
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
        {activeTab === "reviews" && (
          <View style={styles.reviewsSection}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Service Modal */}
      <Modal visible={showAddService} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Service</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddService(false);
                  setNewService({ name: "", price: "", description: "" });
                }}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Service Name"
              value={newService.task}
              onChangeText={(text) =>
                setNewService({ ...newService, task: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Price (₱)"
              value={newService.price}
              onChangeText={(text) =>
                setNewService({ ...newService, price: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Discounted Price (₱)"
              value={newService.discountedPrice}
              onChangeText={(text) =>
                setNewService({ ...newService, discountedPrice: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={newService.description}
              onChangeText={(text) =>
                setNewService({ ...newService, description: text })
              }
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
      <Modal visible={showEditService} animationType="slide" transparent={true}>
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
              value={editingService?.task}
              onChangeText={(text) =>
                setEditingService({ ...editingService, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={editingService?.price}
              onChangeText={(text) =>
                setEditingService({ ...editingService, price: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Discounted Price"
              value={editingService?.discountedPrice}
              onChangeText={(text) =>
                setEditingService({ ...editingService, discountedPrice: text })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={editingService?.description}
              onChangeText={(text) =>
                setEditingService({ ...editingService, description: text })
              }
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
    flex: 1,
    textAlign: "center",
  },
  bannerContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  shopBanner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  editBannerButton: {
    position: "absolute",
    left: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cameraIcon: {
    marginRight: 6,
  },
  editBannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  shopInfoContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  shopName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginLeft: 4,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666666",
  },
  description: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 22,
    marginBottom: 16,
  },
  contactInfo: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 12,
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFB800",
  },
  tabText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFB800",
    fontWeight: "600",
  },
  servicesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: "#FFB800",
    fontWeight: "600",
    marginLeft: 4,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFB800",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  serviceActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 16,
  },
  viewButton: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  viewButtonText: {
    fontSize: 14,
    color: "#FFB800",
    fontWeight: "600",
  },
  reviewsSection: {
    padding: 20,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666666",
  },
  reviewComment: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333333",
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  addServiceButton: {
    backgroundColor: "#FFB800",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  addServiceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ViewShopScreen;
