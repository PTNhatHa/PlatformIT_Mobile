import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";

export const SigninSignup = ()=>{
    const Stack = createNativeStackNavigator();
    return(
        <Stack.Navigator
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen
                name="Sign in"
                component={SignIn}
            />
            <Stack.Screen
                name="Sign up"
                component={SignUp}
            />
        </Stack.Navigator>
    )
}