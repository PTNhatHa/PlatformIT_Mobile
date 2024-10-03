import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import { StudentBottomTab} from "./StudentBottomTab";
import { TeacherBottomTab } from "./TeacherBottomTab";

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
            <Stack.Screen
                name="Student"
                component={StudentBottomTab}
            />
            <Stack.Screen
                name="Teacher"
                component={TeacherBottomTab}
            />
        </Stack.Navigator>
    )
}