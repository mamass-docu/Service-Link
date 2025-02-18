import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  Clipboard,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Add your QR code URLs or import local images
const QR_CODES = {
  gcash: require('../../../../assets/qr/gcash.jpg'), // Replace with your QR image path
  maya: require('../../../../assets/qr/paymaya.jpg'), // Replace with your QR image path
};

const PayBillsScreen = ({ navigation }) => {
  const [commissionBills, setCommissionBills] = useState([
    {
      id: 1,
      date: '2024-02-05',
      service: 'Aircon Cleaning',
      amount: 2500,
      commission: 375,
      status: 'unpaid',
      customer: 'Juan Dela Cruz',
    },
    {
      id: 2,
      date: '2024-02-04',
      service: 'Aircon Repair',
      amount: 3000,
      commission: 450,
      status: 'unpaid',
      customer: 'Maria Santos',
    },
    {
      id: 3,
      date: '2024-02-03',
      service: 'Aircon Installation',
      amount: 5000,
      commission: 750,
      status: 'processing',
      reference: 'GC987654321',
      customer: 'Pedro Penduko',
    },
  ]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qr');
  const [selectedQR, setSelectedQR] = useState('gcash');

  const getTotalUnpaid = () => {
    return commissionBills
      .filter(bill => bill.status === 'unpaid')
      .reduce((total, bill) => total + bill.commission, 0);
  };

  const getUnpaidCount = () => {
    return commissionBills.filter(bill => bill.status === 'unpaid').length;
  };

  const handleSubmitPayment = () => {
    if (!referenceNumber.trim()) {
      Alert.alert('Error', 'Please enter reference number');
      return;
    }
    Alert.alert(
      'Success',
      'Payment submitted successfully. Please wait for admin verification.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowPaymentModal(false);
            setReferenceNumber('');
          }
        }
      ]
    );
  };

  const BillCard = ({ bill }) => (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <Text style={styles.date}>{bill.date}</Text>
        <View style={[
          styles.status,
          { backgroundColor: bill.status === 'processing' ? '#FFF3E0' : '#FFE8E8' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: bill.status === 'processing' ? '#FF9800' : '#FF4444' }
          ]}>
            {bill.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.service}>{bill.service}</Text>
      <Text style={styles.customer}>{bill.customer}</Text>

      <View style={styles.amountContainer}>
        <View style={styles.amountRow}>
          <Text style={styles.label}>Service Amount:</Text>
          <Text style={styles.amount}>₱{bill.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={styles.label}>Commission (15%):</Text>
          <Text style={styles.commission}>₱{bill.commission.toFixed(2)}</Text>
        </View>
      </View>

      {bill.status === 'processing' && (
        <Text style={styles.reference}>Ref: {bill.reference}</Text>
      )}
    </View>
  );

  const PaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setShowPaymentModal(false);
        setReferenceNumber('');
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pay All Commissions</Text>
          
          <View style={styles.paymentSummary}>
            <Text style={styles.summaryLabel}>Total Amount Due</Text>
            <Text style={styles.summaryAmount}>₱{getTotalUnpaid().toFixed(2)}</Text>
            <Text style={styles.billCount}>{getUnpaidCount()} unpaid bills</Text>
          </View>

          <View style={styles.paymentOptions}>
            <TouchableOpacity 
              style={[
                styles.optionButton,
                selectedPaymentMethod === 'qr' && styles.optionButtonActive
              ]}
              onPress={() => setSelectedPaymentMethod('qr')}
            >
              <Icon name="qrcode-scan" size={20} color="#FFFFFF" />
              <Text style={styles.optionText}>Pay with QR</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton,
                selectedPaymentMethod === 'number' && styles.optionButtonActive
              ]}
              onPress={() => setSelectedPaymentMethod('number')}
            >
              <Icon name="numeric" size={20} color="#FFFFFF" />
              <Text style={styles.optionText}>Pay with Number</Text>
            </TouchableOpacity>
          </View>

          {selectedPaymentMethod === 'qr' && (
            <>
              <View style={styles.qrTabs}>
                <TouchableOpacity 
                  style={[
                    styles.qrTab, 
                    selectedQR === 'gcash' && styles.qrTabActive
                  ]}
                  onPress={() => setSelectedQR('gcash')}
                >
                  <Icon name="wallet" size={20} color="#00A1E9" />
                  <Text style={styles.qrTabText}>GCash</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.qrTab, 
                    selectedQR === 'maya' && styles.qrTabActive
                  ]}
                  onPress={() => setSelectedQR('maya')}
                >
                  <Icon name="wallet" size={20} color="#682E87" />
                  <Text style={styles.qrTabText}>Maya</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.qrContainer}>
                <Image
                  source={QR_CODES[selectedQR]}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>
            </>
          )}

          {selectedPaymentMethod === 'number' && (
            <View style={styles.adminNumbers}>
              <View style={styles.paymentMethod}>
                <View style={styles.methodHeader}>
                  <Icon name="wallet" size={20} color="#00A1E9" />
                  <Text style={styles.methodName}>GCash</Text>
                </View>
                <TouchableOpacity 
                  style={styles.copyNumber}
                  onPress={() => {
                    Clipboard.setString('09515613663');
                    Alert.alert('Copied', 'GCash number copied to clipboard');
                  }}
                >
                  <Text style={styles.numberText}>09515613663</Text>
                  <Icon name="content-copy" size={18} color="#666" />
                </TouchableOpacity>
                <Text style={styles.accountName}>ER*****N M.</Text>
              </View>

              <View style={styles.paymentMethod}>
                <View style={styles.methodHeader}>
                  <Icon name="wallet" size={20} color="#682E87" />
                  <Text style={styles.methodName}>Maya</Text>
                </View>
                <TouchableOpacity 
                  style={styles.copyNumber}
                  onPress={() => {
                    Clipboard.setString('09515613663');
                    Alert.alert('Copied', 'Maya number copied to clipboard');
                  }}
                >
                  <Text style={styles.numberText}>09515613663</Text>
                  <Icon name="content-copy" size={18} color="#666" />
                </TouchableOpacity>
                <Text style={styles.accountName}>ER*****N M</Text>
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Reference Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter reference number"
              placeholderTextColor="#999"
              value={referenceNumber}
              onChangeText={setReferenceNumber}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitPayment}
          >
            <Text style={styles.submitButtonText}>Submit Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Commission Bills</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <Text style={styles.unpaidLabel}>Unpaid Commission</Text>
          <Text style={styles.unpaidCount}>
            {getUnpaidCount()} {getUnpaidCount() === 1 ? 'bill' : 'bills'}
          </Text>
        </View>
        <Text style={styles.totalAmount}>₱{getTotalUnpaid().toFixed(2)}</Text>
        {getUnpaidCount() > 0 && (
          <TouchableOpacity 
            style={styles.payAllButton}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={styles.payAllText}>Pay All Commissions</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {commissionBills.map(bill => (
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
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  unpaidLabel: {
    fontSize: 14,
    color: '#666',
  },
  unpaidCount: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  payAllButton: {
    backgroundColor: '#FFB800',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  payAllText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  billCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  service: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  customer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  amountContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  commission: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '600',
  },
  reference: {
    fontSize: 13,
    color: '#666',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentSummary: {
    alignItems: 'center',
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  billCount: {
    fontSize: 14,
    color: '#666',
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB800',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  optionButtonActive: {
    backgroundColor: '#0056b3',
  },
  optionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  qrTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  qrTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    gap: 8,
  },
  qrTabActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  qrTabText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  adminNumbers: {
    marginBottom: 24,
    gap: 12,
  },
  paymentMethod: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  copyNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  numberText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  accountName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#FFB800',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PayBillsScreen;
