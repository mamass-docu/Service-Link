import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { app, db } from "../../firebase";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAppContext } from "../../../AppProvider";
import { find, update, serverTimestamp } from "../../databaseHelper";
const { width, height } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "provider@provider.com",
    password: "password",
  });
  const { setUserId, setUserName, setUserRole, setUserEmail } = useAppContext();

  const auth = getAuth(app);

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Check if user exists in serviceProviders collection
      const userDoc = await find("users", userCredential.user.uid);
      // const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        await auth.signOut();
        setIsLoading(false);
        Alert.alert("Error", "Account not found!!!");
        return;
      }

      const userData = userDoc.data();

      // Verify user type
      if (userData.role == "Admin") {
        await auth.signOut();
        setIsLoading(false);
        Alert.alert("Error", "Invalid account type!!!");
        return;
      }

      // Check account status
      if (!userData.active) {
        await auth.signOut();
        setIsLoading(false);
        Alert.alert("Error", "Account is not active!!!");
        return;
      }

      setIsLoading(false);

      setUserId(userCredential.user.uid);
      setUserName(userData.name);
      setUserEmail(userData.email);
      setUserRole(userData.role);

      update("users", userCredential.user.uid, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: userData.hasAcceptedTerms
              ? `${userData.role}Home`
              : `${userData.role}TermsAndConditions`,
          },
        ],
      });
    } catch (error) {
      setIsLoading(false);
      console.error("Login error:", error);

      let errorMessage = "An error occurred during login";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
        translucent={false}
        hidden={false}
      />
      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Logo or Icon */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/login.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your service provider account
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Feather
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Role")}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.25, // 25% of screen height
    marginBottom: 20,
  },
  logo: {
    width: width * 0.6, // 60% of screen width
    height: width * 0.6, // Keep aspect ratio square
  },
  titleSection: {
    marginBottom: height * 0.03,
  },
  mainTitle: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#666666",
  },
  formSection: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#1A1A1A",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 10,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFB800",
  },
  loginButton: {
    height: 56,
    backgroundColor: "#FFB800",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFB800",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  noAccountText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666666",
  },
  signupText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "#FFB800",
  },
});
