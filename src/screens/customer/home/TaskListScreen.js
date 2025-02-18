import React, { useCallback, useEffect, useState } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import BookServiceScreen from "../bookings/BookServiceScreen";
import { db } from "../../../firebase";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query } from "firebase/firestore";
import { get, where } from "../../../databaseHelper";

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
        <Text style={styles.serviceTitle}>{service.task}</Text>
        {/* <Text style={styles.estimatedTime}>⏱️ {service.estimatedTime}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₱{service.price}</Text>
          <Text style={styles.perService}>/service</Text>
        </View>
        <View style={styles.discountContainer}>
          <Text style={styles.discountPrice}>₱{service.discountedPrice}</Text>
          <Text style={styles.discountLabel}>Discounted</Text>
        </View> */}
      </View>
    </View>
  </TouchableOpacity>
);

export default function TaskListScreen({ navigation, route }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { service } = route.params;

  useFocusEffect(
    useCallback(() => {
      async function refresh() {
        try {
          const snapshot = await get(
            "services",
            where("service", "==", service)
          );
          // const snapshot = await getDocs(
          //   query(collection(db, "services"), where("service", "==", service))
          // );
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          console.log(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
      refresh();
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() == "") setFilteredTasks(null);
    else
      setFilteredTasks(
        tasks.filter((service) =>
          service.task.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
  }, [searchQuery]);

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
        <Text style={styles.headerTitle}>Aircon Services</Text>
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
              onPress={() => setSearchQuery("")}
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
          {(filteredTasks ?? tasks).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={(service) => {
                navigation.navigate("CustomerProviderOption", {
                  serviceId: service.id,
                  service: service.service,
                  task: service.task,
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFB800",
    marginLeft: 8,
    fontWeight: "500",
  },
  serviceImage: {
    width: "100%",
    height: 200,
  },
  detailsContainer: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  discountPrice: {
    fontSize: 16,
    color: "#FFB800",
    marginBottom: 8,
  },
  estimatedTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  sectionContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomAddToCartButton: {
    backgroundColor: "#FFB800",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bottomAddToCartText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  searchContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333333",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
  },
  imageContainer: {
    width: 120,
    height: 120,
    margin: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  perService: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFB800",
    marginRight: 4,
  },
  discountLabel: {
    fontSize: 12,
    color: "#666",
  },
  warningText: {
    fontSize: 14,
    color: "#FF4444",
    marginBottom: 8,
  },
});
