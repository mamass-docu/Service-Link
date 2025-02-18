import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAppContext } from "../../../../AppProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { get, update, where } from "../../../databaseHelper";

const { width } = Dimensions.get("window");

const JobRequestCard = ({ job, onAccept, onDecline }) => (
  <View style={styles.requestCard}>
    <View style={styles.requestHeader}>
      <View style={styles.customerInfo}>
        <Image
          source={{ uri: job.customerImage }}
          style={styles.customerAvatar}
        />
        <View>
          <Text style={styles.customerName}>{job.customerName}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Icon
                key={index}
                name="star"
                size={12}
                color={index < Math.floor(job.rating) ? "#FFB800" : "#DDDDDD"}
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.jobPrice}>₱{job.price}</Text>
    </View>

    <View style={styles.jobDetails}>
      <View style={styles.detailItem}>
        <Icon name="briefcase-outline" size={16} color="#666" />
        <Text style={styles.detailText}>
          {job.service}/{job.task}
        </Text>
      </View>
      <View style={styles.detailItem}>
        <Icon name="map-marker" size={16} color="#666" />
        <Text style={styles.detailText}>{job.address}</Text>
      </View>
    </View>

    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={styles.declineButton}
        onPress={() => onDecline(job)}
      >
        <Text style={styles.declineButtonText}>Decline</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => onAccept(job)}
      >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const ServiceCard = ({ icon, title, count }) => (
  <View style={styles.serviceCard}>
    <Icon name={icon} size={24} color="#FFB800" />
    <Text style={styles.serviceCardTitle}>{title}</Text>
    <Text style={styles.serviceCardCount}>{count}</Text>
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userName, userId } = useAppContext();
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [upcomingJobs, setUpcomingJobs] = useState([
    {
      id: "request1",
      customerName: "John Applessed",
      service: "Regular Wash & Fold",
      price: "250",
      status: "Pending",
      address: "#425, 3rd Street, Makati",
      rating: 4.5,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      date: "2024-02-10",
      time: "2:30 PM",
      customerId: "customer123",
    },
    {
      id: "request2",
      customerName: "Jane Smith",
      service: "Dry Cleaning",
      price: "350",
      status: "Pending",
      address: "#123, Main Street, Makati",
      rating: 4.8,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      date: "2024-02-11",
      time: "3:30 PM",
      customerId: "customer456",
    },
  ]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  async function refresh() {
    try {
      const snapshot = await get(
        "bookings",
        where("providerId", "==", userId),
        where("status", "==", "Pending")
      );
      // const snapshot = await getDocs(
      //   query(
      //     collection(db, "bookings"),
      //     where("providerId", "==", userId),
      //     where("status", "==", "Pending")
      //   )
      // );
      setUpcomingJobs(
        snapshot.docs.map((item) => {
          return {
            id: item.id,
            ...item.data(),
          };
        })
      );
      // let temp = [];

      // for (const bookingsDoc of snapshot.docs) {
      //   const bookingsData = bookingsDoc.data();
      //   const userRef = doc(db, "users", bookingsData.customerId);
      //   const userSnap = await getDoc(userRef);

      //   temp.push({
      //     id: bookingsDoc.id,
      //     ...bookingsData,
      //     customerName: userSnap.exists() ? userSnap.data().name : null,
      //   });
      // }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  const providerStats = {
    totalEarnings: 25800,
    jobsCompleted: 145,
    activeJobs: 3,
    rating: 4.8,
    reviewCount: 98,
  };

  const handleAcceptJob = (job) => {
    Alert.alert(
      "Accept Booking",
      "Are you sure you want to accept this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: async () => {
            await update("bookings", job.id, {
              status: "Confirmed",
              confirmedAt: new Date().toISOString(),
            });
            // await updateDoc(doc(db, "bookings", job.id), {
            //   status: "Confirmed",
            //   confirmedAt: new Date().toISOString(),
            // });

            refresh();

            Alert.alert("Success", "Booking request accepted");
          },
        },
      ]
    );
  };

  const handleDeclineJob = (job) => {
    Alert.alert(
      "Decline Booking",
      "Are you sure you want to decline this booking?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Decline",
          onPress: async () => {
            await update("bookings", job.id, {
              status: "Rejected",
              rejectedAt: new Date().toISOString(),
            });
            // await updateDoc(doc(db, "bookings", job.id), {
            //   status: "Rejected",
            //   rejectedAt: new Date().toISOString(),
            // });

            refresh();

            Alert.alert("Success", "Booking request declined");
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor="#FFB800" barStyle="light-content" />

      {/* Provider Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <Image
              source={{
                uri: "https://assets.epuzzle.info/puzzle/158/484/original.jpg",
              }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.providerName}>{userName}</Text>
            </View>
          </View>
          <View style={styles.notificationContainer}>
            <TouchableOpacity style={styles.notificationButton}>
              <Icon name="bell" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.requestBadge}>
              <Text style={styles.requestCount}>{upcomingJobs.length}</Text>
            </View>
          </View>
        </View>

        {/* Rating Card */}
        <View style={styles.ratingCard}>
          <View style={styles.ratingInfo}>
            <Icon name="star" size={24} color="#FFB800" />
            <Text style={styles.ratingText}>{providerStats.rating}</Text>
            <Text style={styles.reviewCount}>
              ({providerStats.reviewCount} reviews)
            </Text>
          </View>
          <Text style={styles.verifiedText}>
            <Icon name="check-circle" size={16} color="#4CAF50" /> Verified
            Provider
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.serviceCard}>
          <Icon name="cash" size={24} color="#FFB800" />
          <Text style={styles.serviceCardTitle}>Today's Earnings</Text>
          <Text style={styles.serviceCardCount}>
            ₱{providerStats.totalEarnings}
          </Text>
        </View>
        <View style={styles.serviceCard}>
          <Icon name="briefcase-check" size={24} color="#FFB800" />
          <Text style={styles.serviceCardTitle}>Completed Jobs</Text>
          <Text style={styles.serviceCardCount}>{totalCompleted}</Text>
        </View>
        <View style={styles.serviceCard}>
          <Icon name="calendar-clock" size={24} color="#FFB800" />
          <Text style={styles.serviceCardTitle}>Active Jobs</Text>
          <Text style={styles.serviceCardCount}>
            {providerStats.activeJobs}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewBookingsButton}
          onPress={() => navigation.navigate("Bookings")}
        >
          <Icon name="calendar-check" size={20} color="#FFF" />
          <Text style={styles.viewBookingsText}>View Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewShopButton}
          onPress={() => navigation.navigate("Shop")}
        >
          <Icon name="store" size={20} color="#FFB800" />
          <Text style={styles.viewShopText}>View Shop</Text>
        </TouchableOpacity>
      </View>

      {/* Job Requests */}
      <View style={styles.jobsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {upcomingJobs.length} New Job Requests
          </Text>
        </View>

        {upcomingJobs.map((job) => (
          <JobRequestCard
            key={job.id}
            job={job}
            onAccept={handleAcceptJob}
            onDecline={handleDeclineJob}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFB800",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  greetingText: {
    color: "#FFF",
    fontSize: 14,
  },
  providerName: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
  },
  notificationContainer: {
    position: "relative",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  requestBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF4444",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  requestCount: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  ratingCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 4,
  },
  reviewCount: {
    color: "#666",
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
  },
  serviceCardTitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  serviceCardCount: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    marginHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  viewBookingsButton: {
    flex: 1,
    height: 45,
    flexDirection: "row",
    backgroundColor: "#FFB800",
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },
  viewShopButton: {
    flex: 1,
    height: 45,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFB800",
    elevation: 2,
  },
  viewBookingsText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  viewShopText: {
    color: "#FFB800",
    fontSize: 15,
    fontWeight: "600",
  },
  jobsSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  jobDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  declineButton: {
    flex: 1,
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    flex: 1,
    height: 45,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  declineButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  acceptButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  noBookingsContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    elevation: 2,
  },
  noBookingsText: {
    color: "#666",
    fontSize: 16,
  },
});

export default HomeScreen;
