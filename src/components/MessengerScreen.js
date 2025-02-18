import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
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
import { get } from "../databaseHelper";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db } from "../firebase";
import {
  collection,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
} from "firebase/firestore";
import { useAppContext } from "../../AppProvider";

export default function MessengerScreen({ navigation }) {
  const [activeChat, setActiveChat] = useState(null);
  const [chatHeads, setChatHeads] = useState([]);
  const [messengers, setMessengers] = useState([]);

  const { userId, userName } = useAppContext();

  const renderChatHead = ({ item }) => (
    <TouchableOpacity
      style={styles.chatHeadContainer}
      onPress={() =>
        navigation.navigate("Message", {
          otherUserId: item.otherUserId,
          otherUserName: item.otherUserName,
          otherUserImage: item.otherUserImage,
        })
      }
    >
      <View style={styles.chatHeadImageContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
          }}
          style={styles.chatHeadImage}
          // defaultSource={require("../../../../assets/images/profile.png")}
        />
        <View style={styles.onlineIndicator} />
      </View>
      <Text style={styles.chatHeadName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItemContainer}
      onPress={() =>
        navigation.navigate("Message", {
          otherUserId: item.otherUserId,
          otherUserName: item.otherUserName,
          otherUserImage: item.otherUserImage,
        })
      }
    >
      <View style={styles.chatItemLeft}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.image }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.chatItemInfo}>
          <Text style={styles.chatItemName}>{item.name}</Text>
          <Text style={styles.chatItemService}>{item.lastMessage}</Text>
          <Text style={styles.chatItemMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
      <Text style={styles.chatItemTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  const getActiveMessengers = () => {
    onSnapshot(
      query(collection(db, "users"), where("isOnline", "==", true)),
      (snapshot) => {
        let activeUsers = [];
        snapshot.docs.forEach((doc) => {
          if (doc.id == userId) return;

          const user = doc.data();
          activeUsers.push({
            name: user.name,
            otherUserId: doc.id,
            otherUserName: user.name,
            otherUserImage: user.image,
            // image: user.image,
            image:
              "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
          });
        });
        setChatHeads(activeUsers);
      }
    );
  };

  const setData = async (snapshot) => {
    let temp = [];
    let checked = [];
    for (dc in snapshot.docs) {
      // await snapshot.docs.forEach(async (dc) => {
      const message = dc.data();

      const otherUserId =
        message.participants[0] == userId
          ? message.participants[1]
          : message.participants[0];

      if (checked[otherUserId]) continue;

      checked[otherUserId] = true;
      const user = await getDoc(doc(db, "users", otherUserId));
      const userData = user.data();

      temp.push({
        lastMessage: message.message,
        name: userData.name,
        otherUserId: otherUserId,
        otherUserName: userData.name,
        otherUserImage: userData.image,
        isOnline: userData.isOnline,
        seen: message.senderId == userId ? false : message.seen,
        // image: userData.image,
        image:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
      });
      console.log(temp);
    }
    console.log("end", temp);

    setMessengers(temp);
  };

  const getMessengers = () => {
    onSnapshot(
      query(
        collection(db, "messages"),
        where("participants", "array-contains", userId),
        orderBy("sentAt", "desc")
      ),
      setData
    );
  };

  useFocusEffect(
    useCallback(() => {
      getActiveMessengers();
      getMessengers();
    }, [])
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
            <View key={chatHead.otherUserId} style={styles.chatHeadWrapper}>
              {renderChatHead({ item: chatHead })}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Chat List */}
      <FlatList
        data={messengers}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.otherUserId?.toString()}
        contentContainerStyle={styles.chatList}
      />
    </SafeAreaView>
  );
}

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
    paddingTop: Platform.OS === "android" ? 40 : 16, // Added padding for Android
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
    position: "relative",
    marginBottom: 8,
  },
  chatHeadImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#F0F0F0",
  },
  onlineIndicator: {
    position: "absolute",
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
    position: "relative",
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
    alignSelf: "flex-start",
    marginTop: 2,
  },
  chatList: {
    flexGrow: 1,
  },
});
