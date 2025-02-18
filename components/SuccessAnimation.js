import React from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import Video from 'react-native-video';

const SuccessAnimation = ({ visible, onClose }) => {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <LottieView
              source={require('../../../assets/animations/success.json')}
              autoPlay
              loop={false}
              style={styles.animation}
              onAnimationFinish={onClose}
              speed={0.5} // Changed from 0.7 to 0.5 (slower animation)
            />
            <Text style={styles.modalTitle}>Submitted Successfully!</Text>
            <Text style={styles.modalMessage}>
              Your business application has been submitted for review.
              We will notify you once the verification is complete.
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: Dimensions.get('window').width - 48,
    alignItems: 'center',
  },
  video: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SuccessAnimation;