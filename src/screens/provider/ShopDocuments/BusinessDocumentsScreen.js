// src/screens/ServiceProvider/BusinessDocumentsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const BusinessDocumentsScreen = ({ navigation }) => {
  const [documents, setDocuments] = useState({
    business_permit: null,
    gov_id: null,
    certification: null,
  });

  const documentTypes = [
    {
      id: 'business_permit',
      title: 'Business Permit/DTI Registration',
      description: 'Upload a clear copy of your business permit',
      required: true,
    },
    {
      id: 'gov_id',
      title: 'Valid Government ID',
      description: 'Upload any valid government ID',
      required: true,
    },
    {
      id: 'proof_of_income', // Added new document type
      title: 'Proof of Income',
      description: 'Upload your latest income statement or tax return',
      required: true,
    },
    {
      id: 'certification',
      title: 'Professional Certifications',
      description: 'Upload relevant certifications',
      required: false,
    },
  ];

  const pickImage = async (documentId) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setDocuments(prev => ({
          ...prev,
          [documentId]: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const validateDocuments = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !documents[doc.id]);

    if (missingDocs.length > 0) {
      Alert.alert(
        'Missing Documents',
        `Please upload the following required documents:\n${missingDocs.map(doc => `• ${doc.title}`).join('\n')}`
      );
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateDocuments()) return;

    Alert.alert(
      'Success',
      'Documents uploaded successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('VerificationStatus', { documentsUploaded: true })
        }
      ]
    );
  };

  const DocumentCard = ({ document }) => (
    <View style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <Text style={styles.documentTitle}>
          {document.title}
          {document.required && <Text style={styles.requiredTag}> *Required</Text>}
        </Text>
        <Text style={styles.documentDescription}>{document.description}</Text>
      </View>

      {documents[document.id] ? (
        <View style={styles.uploadedContainer}>
          <Image 
            source={{ uri: documents[document.id] }} 
            style={styles.uploadedImage} 
          />
          <View style={styles.uploadedInfo}>
            <Text style={styles.uploadedStatus}>Document Uploaded</Text>
            <TouchableOpacity 
              style={styles.replaceButton}
              onPress={() => pickImage(document.id)}
            >
              <Feather name="refresh-cw" size={16} color="#007AFF" />
              <Text style={styles.replaceButtonText}>Replace</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => pickImage(document.id)}
        >
          <View style={styles.uploadContent}>
            <Feather name="upload-cloud" size={24} color="#666666" />
            <Text style={styles.uploadText}>Click to Upload</Text>
            <Text style={styles.uploadSubtext}>PNG, JPG or JPEG</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Required Documents</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.documentList}>
          {documentTypes.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Submit Documents</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF2',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  documentList: {
    padding: 16,
  },
  documentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8ECF2',
  },
  documentHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF2',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: '#666666',
  },
  requiredTag: {
    color: '#FF4444',
    fontSize: 12,
  },
  uploadButton: {
    padding: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    margin: 16,
    borderRadius: 12,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  uploadedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  uploadedInfo: {
    flex: 1,
  },
  uploadedStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  replaceButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replaceButtonText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: '#FFB800',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BusinessDocumentsScreen;
