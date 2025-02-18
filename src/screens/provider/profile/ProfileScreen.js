import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAppContext } from "../../../../AppProvider";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { app, db } from "../../../firebase";
import * as ImagePicker from "expo-image-picker";
import { update, uploadFile, serverTimestamp } from "../../../databaseHelper";
import { getAuth } from "firebase/auth";

const ProfileScreen = ({ navigation }) => {
  const { userName, userId } = useAppContext();
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [imageUri, setImageUri] = useState(null);

  useFocusEffect(
    useCallback(() => {
      async function refresh() {
        try {
          const completedCountSnapshot = await getCountFromServer(
            query(
              collection(db, "bookings"),
              where("providerId", "==", userId),
              where("status", "==", "Completed")
            )
          );
          setTotalCompleted(completedCountSnapshot.data().count);
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      }
      refresh();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            const auth = getAuth(app);
            await update("users", userId, {
              isOnline: false,
              lastSeen: serverTimestamp(),
            });

            await auth.signOut();

            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const MenuItem = ({ icon, title, onPress, color = "#666" }) => (
    <TouchableOpacity
      style={[styles.menuItem, title === "Logout" && styles.logoutButton]}
      onPress={onPress}
    >
      <View style={styles.menuIconContainer}>
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text style={[styles.menuText, { color: color }]}>{title}</Text>
      <Feather name="chevron-right" size={22} color={color} />
    </TouchableOpacity>
  );

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      const uri = image.uri;
      const imageName = image.fileName;
      const imageExtension = imageName.substring(imageName.lastIndexOf("."));
      console.log(imageExtension);
      const filename = `${userId}${imageExtension}`;
      console.log(filename);
      console.log(uri);

      const downloadUrl = uploadFile(`profileImages/${filename}`, uri);
      console.log(downloadUrl);

      setImageUri(uri);
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={selectImage}
              >
                <Feather name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profession}>Professional Plumber</Text>

            <View style={styles.ratingContainer}>
              <Feather name="star" size={20} color="#FFB800" />
              <Text style={styles.ratingText}>4.8</Text>
              <Text style={styles.reviewCount}>(127 reviews)</Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalCompleted}</Text>
                <Text style={styles.statLabel}>Jobs Done</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5+</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <MenuItem
              icon="edit"
              title="Edit Profile"
              onPress={() => navigation.navigate("ProviderEditProfile")}
            />
            <MenuItem
              icon="clock" // Changed icon to clock
              title="Manage Availability"
              onPress={() => navigation.navigate("MyAvailability")}
            />
            <MenuItem
              icon="inbox"
              title="Transactions"
              onPress={() => navigation.navigate("Transactions")}
            />
            <MenuItem
              icon="shield"
              title="Verification Status"
              onPress={() => navigation.navigate("VerificationStatus")}
            />
            <MenuItem
              icon="credit-card"
              title="Pay Bills"
              onPress={() => navigation.navigate("PayBills")}
            />
            <MenuItem
              icon="help-circle"
              title="Help & Support"
              onPress={() => navigation.navigate("ProviderHelpAndSupport")}
            />
            <MenuItem
              icon="settings"
              title="Settings"
              onPress={() => navigation.navigate("ProviderSettings")}
            />
            <MenuItem
              icon="log-out"
              title="Logout"
              onPress={handleLogout}
              color="#FF4444"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFB800",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFB800",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  profession: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    width: "90%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#DDD",
    marginHorizontal: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    marginBottom: 8,
    borderRadius: 12,
  },
  menuIconContainer: {
    width: 24,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 12,
    marginBottom: 30,
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFE5E5",
  },
});

export default ProfileScreen;
