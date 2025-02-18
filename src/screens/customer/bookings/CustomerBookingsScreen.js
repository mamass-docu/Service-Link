import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { db } from "../../../firebase";
import { useAppContext } from "../../../../AppProvider";
import { query, getDocs, collection } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { get, where } from "../../../databaseHelper";
// import JobStatusScreen from "../"; // Import JobStatusScreen

const BookingCard = ({ booking, navigation, userRole }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFB800";
      case "confirmed":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "cancelled":
        return "#F44336";
      default:
        return "#666666";
    }
  };

  return (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() =>
        navigation.navigate("JobStatus", {
          user: {
            id:
              userRole == "Customer" ? booking.customerId : booking.providerId,
            name:
              userRole == "Customer"
                ? booking.customerName
                : booking.providerName,
            date: booking.date,
            time: booking.time,
            address: booking.address,
            status: booking.status,
            createdAt: booking.createdAt,
            confirmedAt: booking.confirmedAt,
            rejectedAt: booking.rejectedAt,
            completedAt: booking.completedAt,
          },
        })
      }
    >
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=375&q=80",
          }}
          style={styles.providerImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.providerName}>{booking.providerName}</Text>
          <Text style={styles.serviceType}>{booking.service}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(booking.status)}20` },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(booking.status) },
            ]}
          >
            {booking.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather name="calendar" size={16} color="#666" />
            <Text style={styles.infoText}>{booking.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Feather name="clock" size={16} color="#666" />
            <Text style={styles.infoText}>{booking.time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>₱{booking.price}</Text>
        </View>

        {booking.status === "pending" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                /* Handle cancel */
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => {
                /* Handle reschedule */
              }}
            >
              <Text style={styles.rescheduleButtonText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const CustomerBookingsScreen = ({ navigation }) => {
  const { userId, userRole } = useAppContext();

  const [activeTab, setActiveTab] = useState("upcoming");

  const [bookings, setBookings] = useState({
    upcoming: [],
    completed: [],
  });

  useFocusEffect(
    useCallback(() => {
      async function getBookings() {
        try {
          const querySnapshot = await get(
            "bookings",
            where("customerId", "==", userId),
            where("status", "!=", "Cancelled")
          );
          // const querySnapshot = await getDocs(query(
          //   collection(db, "bookings"),
          //   where("customerId", "==", userId),
          //   where("status", "!=", "Cancelled")
          // ));
          let upcoming = [];
          let completed = [];
          for (const serviceDoc of querySnapshot.docs) {
            const serviceData = serviceDoc.data();
            if (serviceData.status != "Completed")
              upcoming.push({
                id: serviceDoc.id,
                ...serviceData,
              });
            else
              completed.push({
                id: serviceDoc.id,
                ...serviceData,
              });
          }

          setBookings({
            upcoming: upcoming,
            completed: completed,
          });
        } catch (error) {
          console.log("Error fetching services:", error);
        }
      }
      getBookings();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        showsVerticalScrollIndicator={false}
      >
        {bookings[activeTab].map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            navigation={navigation} // Pass navigation to BookingCard
          />
        ))}

        {bookings[activeTab].length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={50} color="#CCC" />
            <Text style={styles.emptyStateText}>No bookings found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFB800",
  },
  tabText: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFB800",
  },
  bookingsList: {
    flex: 1,
    padding: 20,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: "#666666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666666",
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666666",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FFF5F5",
  },
  cancelButtonText: {
    color: "#F44336",
    fontWeight: "500",
  },
  rescheduleButton: {
    backgroundColor: "#FFB80020",
  },
  rescheduleButtonText: {
    color: "#FFB800",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
});

export default CustomerBookingsScreen;
