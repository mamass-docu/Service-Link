import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MessagesScreen = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatHeads] = useState([
    {
      id: 1,
      name: "John Martinez",
      service: "Engine Repair Specialist",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
      lastMessage: "Your engine repair is scheduled for tomorrow.",
      time: "9:39 am",
      isOnline: true,
    },
    {
      id: 2,
      name: "Michael Santos",
      service: "Brake Service Expert",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3",
      lastMessage: "We'll check your brake system.",
      time: "Tue",
      isOnline: true,
    },
    {
      id: 3,
      name: "David Garcia",
      service: "Window and Glass Repair",
      avatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3",
      lastMessage: "Windshield replacement quote ready.",
      time: "Wed",
      isOnline: false,
    },
    {
      id: 4,
      name: "Robert Cruz",
      service: "Transmission Specialist",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3",
      lastMessage: "Your transmission needs checking.",
      time: "Thu",
      isOnline: true,
    },
    {
      id: 5,
      name: "Carlos Reyes",
      service: "AC Systems Expert",
      avatar: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?ixlib=rb-4.0.3",
      lastMessage: "AC system maintenance complete.",
      time: "Fri",
      isOnline: false,
    },
    {
      id: 6,
      name: "James Rodriguez",
      service: "Tire Specialist",
      avatar: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?ixlib=rb-4.0.3",
      lastMessage: "Time for tire rotation.",
      time: "Sat",
      isOnline: true,
    },
    {
      id: 7,
      name: "Alex Fernandez",
      service: "Body Work Specialist",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3",
      lastMessage: "Paint job estimate ready.",
      time: "Sun",
      isOnline: true,
    },
    {
      id: 8,
      name: "Daniel Torres",
      service: "Oil Change Specialist",
      avatar: "https://images.unsplash.com/photo-1640951613773-54706e06851d?ixlib=rb-4.0.3",
      lastMessage: "Regular maintenance due.",
      time: "Mon",
      isOnline: false,
    },
    {
      id: 9,
      name: "Marco Rivera",
      service: "Electrical Systems Expert",
      avatar: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-4.0.3",
      lastMessage: "Battery check completed.",
      time: "Yesterday",
      isOnline: true,
    },
    {
      id: 10,
      name: "Luis Morales",
      service: "Steering Systems Expert",
      avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3",
      lastMessage: "Power steering fluid changed.",
      time: "2:30 PM",
      isOnline: false,
    }
]);


  const renderChatHead = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatHeadContainer}
      onPress={() => setActiveChat(item.id)}
    >
      <View style={styles.chatHeadImageContainer}>
        <Image 
          source={{ uri: item.avatar }}
          style={styles.chatHeadImage}
          defaultSource={require('../../../../assets/images/profile.png')}
        />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.chatHeadName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItemContainer}
      onPress={() => setActiveChat(item.id)}
    >
      <View style={styles.chatItemLeft}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: item.avatar }}
            style={styles.avatar}
          />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.chatItemInfo}>
          <Text style={styles.chatItemName}>{item.name}</Text>
          <Text style={styles.chatItemService}>{item.service}</Text>
          <Text style={styles.chatItemMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
      <Text style={styles.chatItemTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Icon name="magnify" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Chat Heads */}
      <View style={styles.chatHeadsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chatHeadsScroll}
        >
          {chatHeads.map((chatHead) => (
            <View key={chatHead.id} style={styles.chatHeadWrapper}>
              {renderChatHead({ item: chatHead })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={chatHeads}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.chatList}
      />
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
    paddingTop: Platform.OS === 'android' ? 40 : 16, // Added padding for Android
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  chatHeadsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  chatHeadsScroll: {
    padding: 16,
  },
  chatHeadWrapper: {
    marginRight: 20,
  },
  chatHeadContainer: {
    alignItems: "center",
    width: 70,
  },
  chatHeadImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  chatHeadImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#F0F0F0",
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  chatHeadName: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    width: 70,
    fontWeight: "500",
  },
  chatItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  chatItemLeft: {
    flexDirection: "row",
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F0F0",
  },
  chatItemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  chatItemService: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  chatItemMessage: {
    fontSize: 14,
    color: "#999",
  },
  chatItemTime: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  chatList: {
    flexGrow: 1,
  },
});

export default MessagesScreen;
