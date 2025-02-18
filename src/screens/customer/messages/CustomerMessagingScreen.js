import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MessagesScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Juan Dela Cruz', message: 'Hi! I need a cleaning service.', time: '2:30 PM', isUser: false },
    { id: 2, sender: 'Maria Santos', message: 'Can you fix my plumbing issue tomorrow?', time: '4:00 PM', isUser: false },
    { id: 3, sender: 'You', message: 'Yes! We are available!', time: '5:15 PM', isUser: true },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageRow, item.isUser ? styles.sentMessageRow : styles.receivedMessageRow]}>
      {!item.isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.sender.charAt(0)}</Text>
        </View>
      )}
      <View style={[styles.messageBubble, item.isUser ? styles.sentMessageBubble : styles.receivedMessageBubble]}>
        {!item.isUser && <Text style={styles.senderName}>{item.sender}</Text>}
        <Text style={[styles.messageText, item.isUser && styles.sentMessageText]}>{item.message}</Text>
        <Text style={[styles.timeText, item.isUser && styles.sentTimeText]}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={24} color="#333" />
        <Text style={styles.headerTitle}>Messages</Text>
        <Icon name="dots-vertical" size={24} color="#333" />
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messageList}
      />

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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  messageList: {
    padding: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  receivedMessageRow: {
    justifyContent: 'flex-start',
  },
  sentMessageRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFB800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
  },
  receivedMessageBubble: {
    backgroundColor: '#F0F0F0',
  },
  sentMessageBubble: {
    backgroundColor: '#FFB800',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTimeText: {
    color: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FFB800',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesScreen;
