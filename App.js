import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppProvider } from "./AppProvider";

import { All } from "./registeredScreens/All";
import { Providers } from "./registeredScreens/Providers";
import { Customers } from "./registeredScreens/Customers";

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
          {All(Stack)}
          {Providers(Stack)}
          {Customers(Stack)}
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
