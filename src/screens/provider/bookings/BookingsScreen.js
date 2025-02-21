import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAppContext } from "../../../../AppProvider";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { find, get, update, where } from "../../../databaseHelper";

const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return { bg: "#E8F5E9", text: "#4CAF50" };
    case "Completed":
      return { bg: "#E3F2FD", text: "#2196F3" };
    case "Declined":
      return { bg: "#FFEBEE", text: "#F44336" };
    default:
      return { bg: "#FFF3E0", text: "#FFB800" };
  }
};

const BookingCard = ({
  booking,
  onAccept,
  onDecline,
  navigation,
  userRole,
}) => (
  <TouchableOpacity
    style={styles.bookingCard}
    onPress={() =>
      navigation.navigate("JobStatus", {
        user: {
          bookingId: booking.id,
          id: userRole == "Customer" ? booking.customerId : booking.providerId,
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
    <View style={styles.bookingCardTop}>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{booking.customerName}</Text>
        <Text style={styles.serviceType}>{booking.service}</Text>
      </View>
      <Text style={styles.priceText}>₱{booking.price}</Text>
    </View>

    <View style={styles.bookingDetails}>
      <View style={styles.detailRow}>
        <Icon name="clock-outline" size={16} color="#666666" />
        <Text style={styles.detailText}>{booking.time}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="calendar" size={16} color="#666666" />
        <Text style={styles.detailText}>{booking.date}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="map-marker" size={16} color="#666666" />
        <Text style={styles.detailText}>{booking.address}</Text>
      </View>
    </View>

    {booking.status === "Pending" ? (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => {
            onAccept(booking.id);
          }}
        >
          <Text style={styles.actionButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={() => onDecline(booking.id)}
        >
          <Text style={[styles.actionButtonText, styles.declineText]}>
            Decline
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View
        style={[
          styles.statusContainer,
          {
            backgroundColor: getStatusColor(booking.status).bg,
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: getStatusColor(booking.status).text,
            },
          ]}
        >
          {booking.status}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const BookingsScreen = ({ navigation }) => {
  const { userId, userRole } = useAppContext();
  const [activeTab, setActiveTab] = useState("incoming");
  const [bookings, setBookings] = useState([]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  async function refresh() {
    try {
      const snapshot = await get(
        "bookings",
        false,
        where("providerId", "==", userId)
      );
      // const snapshot = await getDocs(
      //   query(collection(db, "bookings"), where("providerId", "==", userId))
      // );
      let temp = [];

      for (const bookingsDoc of snapshot.docs) {
        const bookingsData = bookingsDoc.data();
        const userSnap = await find("users", bookingsData.customerId, false);
        // const userSnap = await getDoc(doc(db, "users", bookingsData.customerId));

        temp.push({
          id: bookingsDoc.id,
          ...bookingsData,
          customerImage: userSnap.exists() ? userSnap.data().image : null,
        });
      }

      setBookings(temp);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }

  const handleAccept = async (bookingId) => {
    Alert.alert(
      "Accept Booking",
      "Are you sure you want to accept this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            try {
              await update(
                "bookings",
                bookingId,
                {
                  status: "Confirmed",
                },
                false
              );
              // await updateDoc(doc(db, "bookings", bookingId), {
              //   status: "Confirmed",
              // });
              const booking = bookings.find((b) => b.id === bookingId);
              if (booking) {
                navigation.navigate("JobStatus", {
                  booking: { ...booking, status: "Confirmed" },
                });
              }
              refresh();
            } catch (error) {
              console.error("Error accepting booking:", error);
              Alert.alert("Error", "Failed to accept booking");
            }
          },
        },
      ]
    );
  };

  const handleDecline = async (bookingId) => {
    Alert.alert(
      "Decline Booking",
      "Are you sure you want to decline this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          onPress: async () => {
            try {
              await update(
                "bookings",
                bookingId,
                {
                  status: "Declined",
                },
                false
              );
              // await updateDoc(doc(db, "bookings", bookingId), {
              //   status: "Declined",
              // });
              refresh();
            } catch (error) {
              console.error("Error declining booking:", error);
              Alert.alert("Error", "Failed to decline booking");
            }
          },
        },
      ]
    );
  };

  const filteredBookings = () =>
    bookings.filter((booking) => {
      if (activeTab === "incoming") {
        return !["Completed", "Rejected"].includes(booking.status);
      } else {
        return ["Completed", "Rejected"].includes(booking.status);
      }
    });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Text style={styles.title}>Bookings</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "incoming" && styles.activeTab]}
          onPress={() => setActiveTab("incoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "incoming" && styles.activeTabText,
            ]}
          >
            Incoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredBookings()}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onAccept={handleAccept}
            onDecline={handleDecline}
            navigation={navigation}
            userRole={userRole}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.bookingList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFB800",
  },
  bookingList: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bookingCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: "#666666",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFB800",
  },
  bookingDetails: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    color: "#666666",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#FFB800",
  },
  declineButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  declineText: {
    color: "#FF4444",
  },
  statusContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default BookingsScreen;
