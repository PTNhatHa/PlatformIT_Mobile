import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import HomeIcon from "../../assets/icons/Home.png";
import CourseIcon from "../../assets/icons/Course.png";
import TestIcon from "../../assets/icons/Test.png";
import NotiIcon from "../../assets/icons/Noti.png";
import ChatIcon from "../../assets/icons/Chat.png";
import AccountIcon from "../../assets/icons/Account.png";
import { Image } from "react-native";
import { COLORS } from "../constants";

export const BottomTab = ()=>{
    const Tab = createBottomTabNavigator()
    return(
        <Tab.Navigator
            screenOptions={({route})=>({
                tabBarIcon: (({color})=>{
                    let iconName
                    if(route.name === "Sign in"){
                        iconName=HomeIcon
                    }
                    if(route.name === "Sign up"){
                        iconName=CourseIcon
                    }
                    return <Image source={iconName} tintColor={color} style={{ width: 20, height: 20 }}/>
                }),
                tabBarActiveTintColor: COLORS.main,
                tabBarInactiveTintColor: COLORS.lightText
            })}
        >
            <Tab.Screen
                name="Sign in"
                component={SignIn}
            />
            <Tab.Screen
                name="Sign up"
                component={SignUp}
            />
        </Tab.Navigator>
    )
}