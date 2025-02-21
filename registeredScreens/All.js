import React from "react";
import WelcomeScreen from "../src/screens/WelcomeScreen";
import OnboardingScreen1 from "../src/screens/boarding/OnboardingScreen1";
import OnboardingScreen2 from "../src/screens/boarding/OnboardingScreen2";
import OnboardingScreen3 from "../src/screens/boarding/OnboardingScreen3";
import LoginScreen from "../src/screens/auth/LoginScreen";
import ForgotPassword from "../src/screens/auth/ForgotPasswordScreen";
import RoleScreen from "../src/screens/auth/RoleScreen";
import SignupScreen from "../src/screens/auth/SignupScreen";
import MessageScreen from "../src/components/MessageScreen";
import ChangePasswordScreen from "../src/components/ChangePasswordScreen";

export const All = (Stack) => (
  <>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Boarding1" component={OnboardingScreen1} />
    <Stack.Screen name="Boarding2" component={OnboardingScreen2} />
    <Stack.Screen name="Boarding3" component={OnboardingScreen3} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="Role" component={RoleScreen} />
    <Stack.Screen name="SignUp" component={SignupScreen} />
    <Stack.Screen name="Message" component={MessageScreen} />

    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </>
);
