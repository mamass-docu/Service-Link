import { useFocusEffect } from "@react-navigation/native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../firebase";
import { useAppContext } from "../../AppProvider";

const MessageScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const { userId } = useAppContext();

  const { otherUserId, otherUserName, otherUserImage } = route.params;
  const mounted = useRef(true);
  // useFocusEffect(useCallback(() => {
  useEffect(() => {
    const messageQuery = query(
      collection(db, "messages"),
      where("participants", "array-contains", userId),
      orderBy("sentAt", "asc")
    );
    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      if (!mounted.current) return;
      let temp = [];
      snapshot.docs.forEach((dc) => {
        const message = dc.data();

        if (message.participants.some((mess) => mess == otherUserId)) {
          temp.push({
            id: dc.id,
            message: message.message,
            isUserSender: message.senderId == userId,
            seen: message.seen,
            sentAt: message.sentAt,
          });
        }
      });
      if (!mounted.current || temp.length == 0) return;

      setMessages(temp);
    });

    return () => {
      mounted.current = false;
      console.log("unsubs message");
      unsubscribe();
      // setMessages([]);
    };
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() == "") return;

    const newMsg = {
      participants: [userId, otherUserId],
      message: newMessage,
      seen: false,
      sentAt: getDateTime(),
      senderId: userId,
    };
    await addDoc(collection(db, "messages"), newMsg);
    setNewMessage("");
  };

  function getDateTime() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
  }

  const renderItem = ({ item }) => (
    <View
      key={item.id}
      style={[
        styles.messageRow,
        item.isUserSender ? styles.sentMessageRow : styles.receivedMessageRow,
      ]}
    >
      {!item.isUserSender && (
        <Image
          source={{ uri: otherUserImage }}
          style={{
            width: 36,
            height: 36,
            borderRadius: 28,
            backgroundColor: "#F0F0F0",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 8,
          }}
        />
      )}
      {/* <View style={styles.avatar}> */}
      {/* <Text style={styles.avatarText}>{otherUserName.charAt(0)}</Text> */}
      {/* </View> */}
      <View
        style={[
          styles.messageBubble,
          item.isUserSender
            ? styles.sentMessageBubble
            : styles.receivedMessageBubble,
        ]}
      >
        {!item.isUserSender && (
          <Text style={styles.senderName}>{otherUserName}</Text>
        )}
        <Text
          style={[
            styles.messageText,
            item.isUserSender && styles.sentMessageText,
          ]}
        >
          {item.message}
        </Text>
        <Text style={[styles.timeText]}>{item.sentAt}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUserName}</Text>
        <Icon name="dots-vertical" size={24} color="#333" />
      </View>

      <ScrollView contentContainerStyle={styles.messageList}>
        {messages.map((item) => renderItem({ item }))}
      </ScrollView>
      {/* <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageList}
        initialNumToRender={15} 
        maxToRenderPerBatch={5} 
        windowSize={21}
      /> */}

      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      > */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="plus" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* </KeyboardAvoidingView> */}
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
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  messageList: {
    padding: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  receivedMessageRow: {
    justifyContent: "flex-start",
  },
  sentMessageRow: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFB800",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
  },
  receivedMessageBubble: {
    backgroundColor: "#F0F0F0",
  },
  sentMessageBubble: {
    backgroundColor: "#FFB800",
  },
  senderName: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  timeText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  sentTimeText: {
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#FFB800",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MessageScreen;
