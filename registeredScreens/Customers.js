import BookServiceScreen from "../src/screens/customer/bookings/BookServiceScreen";
import PaymentOptionsScreen from "../src/screens/customer/bookings/PaymentOptionsScreen";
import CustomerMainDashboard from "../src/screens/customer/CustomerMainDashboard";
import CustomerTermsAndConditionsScreen from "../src/screens/customer/CustomerTermsAndConditionsScreen";
import MoreServices from "../src/screens/customer/home/MoreServices";
import ProviderOptionScreen from "../src/screens/customer/home/ProviderOptionScreen";
import TaskListScreen from "../src/screens/customer/home/TaskListScreen";
import Addresses from "../src/screens/customer/profile/Addresses";
import CustomerEditProfileScreen from "../src/screens/customer/profile/CustomerEditProfile";
import HelpAndSupportScreen from "../src/screens/customer/profile/HelpAndSupportScreen";
import PrivacyAndSecurityScreen from "../src/screens/customer/profile/PrivacyAndSecurityScreen";
import SearchResultsScreen from "../src/screens/customer/SearchResults/SearchResultsScreen";
import AirconServicesScreen from "../src/screens/customer/services/AirconServicesScreen";
import CarRepairServicesScreen from "../src/screens/customer/services/CarRepairServicesScreen";

export const Customers = (Stack) => (
  <>
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
    <Stack.Screen name="CustomerServiceTasks" component={TaskListScreen} />
    <Stack.Screen
      name="CustomerProviderOption"
      component={ProviderOptionScreen}
    />

    <Stack.Screen name="AirconServices" component={AirconServicesScreen} />
    <Stack.Screen
      name="CarRepairServices"
      component={CarRepairServicesScreen}
    />
    {/* <Stack.Screen
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
          /> */}
    {/* <Stack.Screen
            name="WatchRepairServices"
            component={WatchRepairServicesScreen}
          /> */}
    <Stack.Screen name="BookService" component={BookServiceScreen} />
    <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
    <Stack.Screen
      name="PaymentOptionsScreen"
      component={PaymentOptionsScreen}
    />
  </>
);
