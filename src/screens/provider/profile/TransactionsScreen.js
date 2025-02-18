// src/screens/ServiceProvider/TransactionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const TransactionScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Dummy data for transactions
  const transactions = [
    {
      id: '1',
      customerName: 'John Doe',
      service: 'Plumbing Service',
      amount: 2500,
      date: '2023-11-01',
      status: 'completed',
      time: '10:30 AM',
      paymentMethod: 'Cash',
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      service: 'Pipe Repair',
      amount: 1800,
      date: '2023-11-02',
      status: 'pending',
      time: '2:15 PM',
      paymentMethod: 'GCash',
    },
    {
      id: '3',
      customerName: 'Mike Johnson',
      service: 'Bathroom Repair',
      amount: 3500,
      date: '2023-11-03',
      status: 'completed',
      time: '11:45 AM',
      paymentMethod: 'Maya',
    },
    {
      id: '4',
      customerName: 'Sarah Wilson',
      service: 'Kitchen Sink',
      amount: 2000,
      date: '2023-11-04',
      status: 'pending',
      time: '3:20 PM',
      paymentMethod: 'Cash',
    },
    {
      id: '5',
      customerName: 'David Brown',
      service: 'Toilet Repair',
      amount: 1500,
      date: '2023-11-05',
      status: 'completed',
      time: '9:00 AM',
      paymentMethod: 'GCash',
    },
  ];

  const FilterButton = ({ title, value }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === value && styles.filterButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const TransactionCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.transactionDate}>{item.date} • {item.time}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountPrefix}>₱</Text>
          <Text style={styles.amount}>{item.amount.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Service:</Text>
          <Text style={styles.detailValue}>{item.service}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method:</Text>
          <Text style={styles.detailValue}>{item.paymentMethod}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'completed' ? styles.statusCompleted : styles.statusPending
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'completed' ? styles.statusTextCompleted : styles.statusTextPending
            ]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <Feather name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <FilterButton title="All" value="all" />
          <FilterButton title="Completed" value="completed" />
          <FilterButton title="Pending" value="pending" />
          <FilterButton title="This Month" value="month" />
        </ScrollView>
      </View>

      {/* Transactions List */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard item={item} />}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      />
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
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  filterIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#FFB800',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  transactionsList: {
    padding: 16,
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  amountPrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  transactionDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextCompleted: {
    color: '#2E7D32',
  },
  statusTextPending: {
    color: '#EF6C00',
  },
});

export default TransactionScreen;
