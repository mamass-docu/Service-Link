// src/screens/ServiceProvider/ProviderSettings.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const ProviderSettings = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: {
      bookings: true,
      messages: true,
      promotions: false,
    },
    privacy: {
      showOnlineStatus: true,
      showLocation: false,
    },
    availability: {
      autoAcceptBookings: false,
      showAvailability: true,
    }
  });

  const handleSettingToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            // Add logout logic here
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            // Add account deletion logic here
          },
          style: "destructive"
        }
      ]
    );
  };

  const SettingItem = ({ icon, title, onPress, value, type = 'toggle', description, color = '#333' }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={onPress}
      disabled={type === 'toggle'}
    >
      <View style={styles.settingMain}>
        <View style={[styles.settingIcon, { backgroundColor: `${color}15` }]}>
          <Feather name={icon} size={20} color={color} />
        </View>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color }]}>{title}</Text>
          {description && (
            <Text style={styles.settingDescription}>{description}</Text>
          )}
        </View>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#E5E5E5', true: '#FFB80050' }}
          thumbColor={value ? '#FFB800' : '#FFF'}
        />
      ) : (
        <Feather name="chevron-right" size={20} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="lock"
              title="Change Password"
              type="navigation"
              onPress={() => navigation.navigate('ChangePassword')}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="bell"
              title="Booking Notifications"
              value={settings.notifications.bookings}
              onPress={() => handleSettingToggle('notifications', 'bookings')}
            />
            <SettingItem
              icon="message-square"
              title="Message Notifications"
              value={settings.notifications.messages}
              onPress={() => handleSettingToggle('notifications', 'messages')}
            />
            <SettingItem
              icon="gift"
              title="Promotions & Updates"
              value={settings.notifications.promotions}
              onPress={() => handleSettingToggle('notifications', 'promotions')}
            />
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="eye"
              title="Show Online Status"
              value={settings.privacy.showOnlineStatus}
              onPress={() => handleSettingToggle('privacy', 'showOnlineStatus')}
            />
            <SettingItem
              icon="map-pin"
              title="Share Location"
              value={settings.privacy.showLocation}
              onPress={() => handleSettingToggle('privacy', 'showLocation')}
            />
            <SettingItem
              icon="shield"
              title="Privacy Policy"
              type="navigation"
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="help-circle"
              title="Help Center"
              type="navigation"
              onPress={() => navigation.navigate('ProviderHelpAndSupport')}
            />
            <SettingItem
              icon="file-text"
              title="Terms of Service"
              type="navigation"
              onPress={() => navigation.navigate('Terms')}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});

export default ProviderSettings;
