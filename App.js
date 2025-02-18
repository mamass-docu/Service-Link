import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider } from "./AppProvider";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import OnboardingScreen1 from "./src/screens/boarding/OnboardingScreen1";
import OnboardingScreen2 from "./src/screens/boarding/OnboardingScreen2";
import OnboardingScreen3 from "./src/screens/boarding/OnboardingScreen3";
import LoginScreen from "./src/screens/auth/LoginScreen";
import CustomerMainDashboard from "./src/screens/customer/CustomerMainDashboard";
import Addresses from "./src/screens/customer/profile/Addresses";
import CustomerEditProfileScreen from "./src/screens/customer/profile/CustomerEditProfile";
import SignupScreen from "./src/screens/auth/SignupScreen";
import RoleScreen from "./src/screens/auth/RoleScreen";
import ForgotPassword from "./src/screens/auth/ForgotPasswordScreen";
import CustomerTermsAndConditionsScreen from "./src/screens/customer/CustomerTermsAndConditionsScreen";
import HelpAndSupportScreen from "./src/screens/customer/profile/HelpAndSupportScreen";
import PrivacyAndSecurityScreen from "./src/screens/customer/profile/PrivacyAndSecurityScreen";
import MoreServices from "./src/screens/customer/home/MoreServices";
import AirconServicesScreen from "./src/screens/customer/services/AirconServicesScreen";

import TermsAndConditionsScreen from "./src/screens/provider/TermsAndConditionsScreen";
import MainDashboard from "./src/screens/provider/MainDashboard";
import ProviderEditProfileScreen from "./src/screens/provider/profile/ProviderEditProfileScreen";
import TransactionsScreen from "./src/screens/provider/profile/TransactionsScreen";
import VerificationStatusScreen from "./src/screens/provider/profile/VerificationStatusScreen";
import HelpSupportScreen from "./src/screens/provider/profile/HelpSupportScreen";
import ProviderSettings from "./src/screens/provider/profile/ProviderSettings";
import BookingHelpScreen from "./src/screens/provider/profile/BookingHelpScreen";
import MyAvailabilityScreen from "./src/screens/provider/profile/MyAvailabilityScreen";
import AddServicesScreen from "./src/screens/provider/profile/AddServicesScreen";
import PayBillsScreen from "./src/screens/provider/profile/PayBillsScreen";
import CarRepairServicesScreen from "./src/screens/customer/services/CarRepairServicesScreen";
import CarWashServicesScreen from "./src/screens/customer/services/CarWashServicesScreen";
import PhoneRepairServicesScreen from "./src/screens/customer/services/PhoneRepairServicesScreen";
import HouseKeepingServicesScreen from "./src/screens/customer/services/HouseKeepingServicesScreen";
import ElectricalServicesScreen from "./src/screens/customer/services/ElectricalServicesScreen";
import LaundryServicesScreen from "./src/screens/customer/services/LaundryServicesScreen";
import MassageServicesScreen from "./src/screens/customer/services/MassageServicesScreen";
import PlumbingServicesScreen from "./src/screens/customer/services/PlumbingServicesScreen";
import WatchRepairServicesScreen from "./src/screens/customer/services/WatchRepairServicesScreen";
import SearchResultsScreen from "./src/screens/customer/SearchResults/SearchResultsScreen";
import BusinessDocumentsScreen from "./src/screens/provider/ShopDocuments/BusinessDocumentsScreen";
import BusinessHoursScreen from "./src/screens/provider/profile/BusinessHoursScreen";
import ViewShopScreen from "./src/screens/provider/home/ShopScreen";
import BookServiceScreen from "./src/screens/customer/bookings/BookServiceScreen";
import BookingsScreen from "./src/screens/provider/bookings/BookingsScreen";
import JobStatusScreen from "./src/screens/provider/bookings/JobStatus";
import TaskListScreen from "./src/screens/customer/home/TaskListScreen";
import ProviderOptionScreen from "./src/screens/customer/home/ProviderOptionScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Boarding1" component={OnboardingScreen1} />
          <Stack.Screen name="Boarding2" component={OnboardingScreen2} />
          <Stack.Screen name="Boarding3" component={OnboardingScreen3} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Role" component={RoleScreen} />
          <Stack.Screen name="SignUp" component={SignupScreen} />

          {/* PROVIDER SCREENS */}
          <Stack.Screen
            name="ProviderTermsAndConditions"
            component={TermsAndConditionsScreen}
          />
          <Stack.Screen name="ProviderHome" component={MainDashboard} />
          <Stack.Screen
            name="ProviderEditProfile"
            component={ProviderEditProfileScreen}
          />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen
            name="VerificationStatus"
            component={VerificationStatusScreen}
          />
          <Stack.Screen
            name="ProviderHelpAndSupport"
            component={HelpSupportScreen}
          />
          <Stack.Screen
            name="MyAvailability"
            component={MyAvailabilityScreen}
          />
          <Stack.Screen name="PayBills" component={PayBillsScreen} />
          <Stack.Screen name="ProviderSettings" component={ProviderSettings} />
          <Stack.Screen
            name="BookingHelpScreen"
            component={BookingHelpScreen}
          />
          <Stack.Screen name="AddServices" component={AddServicesScreen} />
          <Stack.Screen
            name="BusinessDocuments"
            component={BusinessDocumentsScreen}
          />
          <Stack.Screen name="BusinessHours" component={BusinessHoursScreen} />
          <Stack.Screen name="Shop" component={ViewShopScreen} />
          <Stack.Screen name="Bookings" component={BookingsScreen} />
          <Stack.Screen
            name="JobStatus"
            component={JobStatusScreen}
            options={{
              headerShown: false,
              animation: "slide_from_right",
              contentStyle: { backgroundColor: "#1A1A1A" },
            }}
          />

          {/* CUSTOMER SCREENS */}
          <Stack.Screen
            name="CustomerTermsAndConditions"
            component={CustomerTermsAndConditionsScreen}
          />
          <Stack.Screen name="CustomerHome" component={CustomerMainDashboard} />
          <Stack.Screen name="Addresses" component={Addresses} />
          <Stack.Screen
            name="CustomerEditProfile"
            component={CustomerEditProfileScreen}
          />
          <Stack.Screen
            name="CustomerHelpAndSupport"
            component={HelpAndSupportScreen}
          />
          <Stack.Screen
            name="CustomerPrivacyAndSecurity"
            component={PrivacyAndSecurityScreen}
          />

          <Stack.Screen name="CustomerMoreServices" component={MoreServices} />
          <Stack.Screen
            name="CustomerServiceTasks"
            component={TaskListScreen}
          />
          <Stack.Screen
            name="CustomerProviderOption"
            component={ProviderOptionScreen}
          />

          <Stack.Screen
            name="AirconServices"
            component={AirconServicesScreen}
          />
          <Stack.Screen
            name="CarRepairServices"
            component={CarRepairServicesScreen}
          />
          <Stack.Screen
            name="CarWashServices"
            component={CarWashServicesScreen}
          />
          <Stack.Screen
            name="PhoneRepairServices"
            component={PhoneRepairServicesScreen}
          />
          <Stack.Screen
            name="HouseKeepingServices"
            component={HouseKeepingServicesScreen}
          />
          <Stack.Screen
            name="ElectricalServices"
            component={ElectricalServicesScreen}
          />
          <Stack.Screen
            name="LaundryServices"
            component={LaundryServicesScreen}
          />
          <Stack.Screen
            name="MassageServices"
            component={MassageServicesScreen}
          />
          <Stack.Screen
            name="PlumbingServices"
            component={PlumbingServicesScreen}
          />
          <Stack.Screen
            name="WatchRepairServices"
            component={WatchRepairServicesScreen}
          />
          <Stack.Screen name="BookService" component={BookServiceScreen} />
          <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
