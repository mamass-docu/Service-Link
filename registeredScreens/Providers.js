import TermsAndConditionsScreen from "../src/screens/provider/TermsAndConditionsScreen";
import ProviderEditProfileScreen from "../src/screens/provider/profile/ProviderEditProfileScreen";
import VerificationStatusScreen from "../src/screens/provider/profile/VerificationStatusScreen";
import HelpSupportScreen from "../src/screens/provider/profile/HelpSupportScreen";
import MyAvailabilityScreen from "../src/screens/provider/profile/MyAvailabilityScreen";
import PayBillsScreen from "../src/screens/provider/profile/PayBillsScreen";
import ProviderSettings from "../src/screens/provider/profile/ProviderSettings";
import BookingHelpScreen from "../src/screens/provider/profile/BookingHelpScreen";
import AddServicesScreen from "../src/screens/provider/profile/AddServicesScreen";
import BusinessHoursScreen from "../src/screens/provider/profile/BusinessHoursScreen";
import ViewShopScreen from "../src/screens/provider/home/ShopScreen";
import BookingsScreen from "../src/screens/provider/bookings/BookingsScreen";
import JobStatusScreen from "../src/screens/provider/bookings/JobStatus";
import MainDashboard from "../src/screens/provider/MainDashboard";
import TransactionsScreen from "../src/screens/provider/profile/TransactionsScreen";
import BusinessDocumentsScreen from "../src/screens/provider/ShopDocuments/BusinessDocumentsScreen";

export const Providers = (Stack) => (
  <>
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
    <Stack.Screen name="ProviderHelpAndSupport" component={HelpSupportScreen} />
    <Stack.Screen name="MyAvailability" component={MyAvailabilityScreen} />
    <Stack.Screen name="PayBills" component={PayBillsScreen} />
    <Stack.Screen name="ProviderSettings" component={ProviderSettings} />
    <Stack.Screen name="BookingHelpScreen" component={BookingHelpScreen} />
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
  </>
);
