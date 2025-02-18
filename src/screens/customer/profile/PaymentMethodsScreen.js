// src/screens/ServiceProvider/PayBillsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PayBillsScreen = ({ navigation }) => {
  const [commissionBills, setCommissionBills] = useState([
    {
      id: 1,
      transactionDate: '2024-02-05',
      serviceType: 'Aircon Cleaning',
      totalAmount: 2500,
      commission: 375, // 15% of 2500
      status: 'unpaid',
      customerName: 'Juan Dela Cruz',
    },
    {
      id: 2,
      transactionDate: '2024-02-04',
      serviceType: 'Aircon Repair',
      totalAmount: 3000,
      commission: 450, // 15% of 3000
      status: 'paid',
      customerName: 'Maria Santos',
      referenceNumber: 'GC123456789',
      paymentDate: '2024-02-04',
    },
    {
      id: 3,
      transactionDate: '2024-02-03',
      serviceType: 'Aircon Installation',
      totalAmount: 5000,
      commission: 750, // 15% of 5000
      status: 'unpaid',
      customerName: 'Pedro Penduko',
    },
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const getTotalUnpaidCommission = () => {
    return commissionBills
      .filter(bill => bill.status === 'unpaid')
      .reduce((total, bill) => total + bill.commission, 0);
  };

  const handlePayBill = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const BillCard = ({ bill }) => (
    <View style={[
      styles.billCard,
      bill.status === 'paid' && styles.paidBillCard
    ]}>
      <View style={styles.billHeader}>
        <View>
          <Text style={styles.dateText}>{bill.transactionDate}</Text>
          <Text style={styles.serviceType}>{bill.serviceType}</Text>
          <Text style={styles.customerName}>Customer: {bill.customerName}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          bill.status === 'paid' ? styles.paidBadge : styles.unpaidBadge
        ]}>
          <Text style={styles.statusText}>{bill.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.billDetails}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Service Amount:</Text>
          <Text style={styles.amount}>₱{bill.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Commission (15%):</Text>
          <Text style={styles.commissionAmount}>₱{bill.commission.toFixed(2)}</Text>
        </View>
      </View>

      {bill.status === 'paid' && (
        <View style={styles.paymentInfo}>
          <Text style={styles.referenceText}>
            Reference No: {bill.referenceNumber}
          </Text>
          <Text style={styles.paymentDate}>
            Paid on: {bill.paymentDate}
          </Text>
        </View>
      )}

      {bill.status === 'unpaid' && (
        <TouchableOpacity 
          style={styles.payButton}
          onPress={() => handlePayBill(bill)}
        >
          <Icon name="cash" size={20} color="#FFFFFF" />
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const PaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Payment Instructions</Text>
          
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentTitle}>Commission Amount:</Text>
            <Text style={styles.paymentAmount}>
              ₱{selectedBill?.commission.toFixed(2)}
            </Text>
          </View>

          <View style={styles.paymentInstructions}>
            <Text style={styles.instructionTitle}>Please pay through:</Text>
            
            <View style={styles.paymentMethod}>
              <Icon name="wallet" size={24} color="#00A1E9" />
              <View style={styles.methodDetails}>
                <Text style={styles.methodName}>GCash</Text>
                <Text style={styles.accountNumber}>0912 345 6789</Text>
                <Text style={styles.accountName}>ServiceLink Admin</Text>
              </View>
            </View>

            <View style={styles.paymentMethod}>
              <Icon name="wallet" size={24} color="#682E87" />
              <View style={styles.methodDetails}>
                <Text style={styles.methodName}>Maya</Text>
                <Text style={styles.accountNumber}>0998 765 4321</Text>
                <Text style={styles.accountName}>ServiceLink Admin</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => {
              setShowPaymentModal(false);
              navigation.navigate('UploadPaymentProof', { bill: selectedBill });
            }}
          >
            <Icon name="upload" size={20} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Upload Payment Proof</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPaymentModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commission Bills</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Total Unpaid Commission */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Unpaid Commission:</Text>
        <Text style={styles.totalAmount}>₱{getTotalUnpaidCommission().toFixed(2)}</Text>
      </View>

      <ScrollView style={styles.content}>
        {commissionBills.map((bill) => (
          <BillCard key={bill.id} bill={bill} />
        ))}
      </ScrollView>

      <PaymentModal />
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
  backButton: {
    padding: 8,
  },
  totalContainer: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4B8',
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFB800',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  paidBillCard: {
    opacity: 0.8,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paidBadge: {
    backgroundColor: '#E8F5E9',
  },
  unpaidBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  billDetails: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  commissionAmount: {
    fontSize: 14,
    color: '#FFB800',
    fontWeight: '600',
  },
  paymentInfo: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
    marginTop: 12,
  },
  referenceText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
  },
  payButton: {
    backgroundColor: '#FFB800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  paymentDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  paymentAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFB800',
  },
  paymentInstructions: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  methodDetails: {
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 14,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: '#FFB800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default PayBillsScreen;