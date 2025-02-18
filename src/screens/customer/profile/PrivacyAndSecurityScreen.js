import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PrivacyAndSecurityScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    biometricLogin: false,
    twoFactorAuth: false,
    locationServices: true,
    dataSharing: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const SecurityOption = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionIconContainer}>
        <Icon name={icon} size={24} color="#FFB800" />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#CCC" />
    </TouchableOpacity>
  );

  const ToggleOption = ({ icon, title, subtitle, value, onToggle }) => (
    <View style={styles.optionCard}>
      <View style={styles.optionIconContainer}>
        <Icon name={icon} size={24} color="#FFB800" />
      </View>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#EEEEEE", true: "#FFB800" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Implement account deletion logic
            Alert.alert(
              "Account Deleted",
              "Your account has been successfully deleted."
            );
            navigation.reset({
              index: 0,
              routes: [{ name: "RoleScreen" }],
            });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <SecurityOption
            icon="lock"
            title="Change Password"
            subtitle="Update your password"
            onPress={handleChangePassword}
          />
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <ToggleOption
            icon="map-marker"
            title="Location Services"
            subtitle="Allow app to access your location"
            value={settings.locationServices}
            onToggle={(value) =>
              setSettings({ ...settings, locationServices: value })
            }
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <ToggleOption
            icon="email"
            title="Email Notifications"
            subtitle="Receive updates via email"
            value={settings.emailNotifications}
            onToggle={(value) =>
              setSettings({ ...settings, emailNotifications: value })
            }
          />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
          >
            <Icon name="delete" size={24} color="#FF4444" />
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF9E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  deleteAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  deleteAccountText: {
    fontSize: 16,
    color: "#FF4444",
    marginLeft: 12,
    fontWeight: "500",
  },
});

export default PrivacyAndSecurityScreen;
