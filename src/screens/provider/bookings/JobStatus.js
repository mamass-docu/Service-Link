import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAppContext } from "../../../../AppProvider";
import { update } from "../../../databaseHelper";

const Status = ({ active, text, date, hideLine }) => {
  if (!date) return;

  return (
    <View>
      {!hideLine && (
        <View
          style={[styles.timelineConnector, active && styles.activeConnector]}
        />
      )}

      <View style={[styles.timelineDot, active && styles.activeDot]} />
      <Text style={[styles.timelineText, active && styles.activeText]}>
        {text}
      </Text>
      <Text style={styles.timelineTime}>{date}</Text>
    </View>
  );
};

const JobStatusScreen = ({ route, navigation }) => {
  const { userRole } = useAppContext();
  const { user } = route.params;
  const [currentStatus, setCurrentStatus] = useState(user?.status);
  const [progressAt, setProgressAt] = useState(user?.progressAt);
  const [completedAt, setCompletedAt] = useState(user?.completedAt);
  // const [showGoToJob, setShowGoToJob] = useState(true);
  console.log(currentStatus);

  const handleStatusUpdate = async () => {
    try {
      const datetime = new Date().toISOString();
      if (currentStatus === "Confirmed") {
        await update("bookings", user?.bookingId, {
          status: "On Process",
          progressAt: datetime,
        });
        // await updateDoc(doc(db, "bookings", user?.bookingId), {
        //   status: "On Process",
        //   progressAt: datetime,
        // });
        setProgressAt(datetime);
        setCurrentStatus("On Process");
        // setShowGoToJob(false);
        Alert.alert("Status Updated", "Job is now in progress");
      } else if (currentStatus === "On Process") {
        await update("bookings", user?.bookingId, {
          status: "Completed",
          completedAt: datetime,
        });
        // await updateDoc(doc(db, "bookings", user?.bookingId), {
        //   status: "Completed",
        //   completedAt: datetime,
        // });
        setCompletedAt(datetime);
        setCurrentStatus("Completed");
        Alert.alert("Status Updated", "Job has been completed");
      } else if (currentStatus === "Completed") {
        await update("bookings", user?.id, {
          status: "past",
          completedTime: datetime,
        });
        // await updateDoc(doc(db, "bookings", user?.id), {
        //   status: "past",
        //   completedTime: datetime,
        // });
        Alert.alert("Success", "Booking marked as completed", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Bookings", { refresh: true }),
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusButton = () => {
    if (userRole != "Provider") return;

    if (currentStatus == "Confirmed")
      return (
        <TouchableOpacity
          style={styles.goToJobButton}
          onPress={handleStatusUpdate}
        >
          <Icon name="bicycle" size={24} color="#FFF" />
          <Text style={styles.goToJobText}>Go to Job</Text>
        </TouchableOpacity>
      );
    if (currentStatus === "On Process")
      return (
        <TouchableOpacity
          style={[styles.goToJobButton, { backgroundColor: "#6C3EE9" }]}
          onPress={handleStatusUpdate}
        >
          <Icon name="check-circle" size={24} color="#FFF" />
          <Text style={styles.goToJobText}>Complete Job</Text>
        </TouchableOpacity>
      );

    // else {
    //   if (currentStatus === "Completed")
    //     return (
    //       <TouchableOpacity
    //         style={[styles.goToJobButton, { backgroundColor: "#4CAF50" }]}
    //         onPress={handleStatusUpdate}
    //       >
    //         <Icon name="check-circle-outline" size={24} color="#FFF" />
    //         <Text style={styles.goToJobText}>Mark as Completed</Text>
    //       </TouchableOpacity>
    //     );
    // }
  };

  const onMessage = () => {
    navigation.navigate("Message", {
      otherUserId: user.id,
      otherUserName: user.name,
      otherUserImage: "",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Detail</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Customer Card */}
      <View style={styles.customerCard}>
        <View style={styles.customerInfo}>
          <Image
            source={{
              uri:
                user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
            }}
            style={styles.customerImage}
          />
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>
              {user?.name || "John Smith"}
            </Text>
            <Text style={styles.serviceType}>{user?.service}</Text>
          </View>
        </View>

        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="phone" size={20} color="#6C3EE9" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMessage} style={styles.iconButton}>
            <Icon name="message-text" size={20} color="#6C3EE9" />
          </TouchableOpacity>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{user?.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{user?.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{user?.address}</Text>
          </View>
        </View>
      </View>

      {/* Status Buttons */}
      {getStatusButton()}

      {/* Job Status Section */}
      <View style={styles.statusSection}>
        <Text style={styles.statusTitle}>Job Status</Text>
        <View style={styles.statusTimeline}>
          <View style={styles.timelineItem}>
            <Status
              active={currentStatus == "Pending"}
              text="Job is Pending"
              date={user?.createdAt}
            />

            <Status
              active={currentStatus == "Rejected"}
              text="Job Rejected"
              date={user?.rejectedAt}
            />

            <Status
              active={currentStatus == "Confirmed"}
              text="Job Accepted"
              date={user?.confirmedAt}
            />

            <Status
              active={currentStatus == "On Process"}
              text="Job On Process"
              date={progressAt}
            />

            <Status
              active={currentStatus == "Completed"}
              text="Job Completed"
              hideLine={true}
              date={completedAt}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  customerCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: "#666",
  },
  contactButtons: {
    flexDirection: "row",
    position: "absolute",
    right: 16,
    top: 16,
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  bookingDetails: {
    marginTop: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
  },
  goToJobButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  goToJobText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  statusSection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  statusTimeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: "column",
    marginBottom: 24,
    position: "relative",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DDD",
    marginRight: 5,
    marginBottom: -5,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
  },
  timelineConnector: {
    position: "absolute",
    left: 5,
    top: 0,
    width: 2,
    height: 43,
    backgroundColor: "#DDD",
  },
  activeConnector: {
    backgroundColor: "#4CAF50",
  },
  timelineText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 18,
  },
  activeText: {
    color: "#333",
    fontWeight: "500",
  },
  timelineTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginLeft: 18,
  },
});

export default JobStatusScreen;
