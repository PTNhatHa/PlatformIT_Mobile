import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import HomeIcon from "../../assets/icons/Home.png";
import CourseIcon from "../../assets/icons/Course.png";
import TestIcon from "../../assets/icons/Test.png";
import NotiIcon from "../../assets/icons/Noti.png";
import ChatIcon from "../../assets/icons/Chat.png";
import AccountIcon from "../../assets/icons/Account.png";
import { Image } from "react-native";
import { COLORS } from "../constants";
import { Home } from "../screens/Home";

export const BottomTab = ()=>{
    const Tab = createBottomTabNavigator()
    return(
        <Tab.Navigator
            screenOptions={({route})=>({
                tabBarIcon: (({color})=>{
                    let iconName
                    if(route.name === "Home"){
                        iconName=HomeIcon
                    }
                    if(route.name === "My Course"){
                        iconName=CourseIcon
                    }
                    if(route.name === "My Test"){
                        iconName=TestIcon
                    }
                    if(route.name === "Noti"){
                        iconName=NotiIcon
                    }
                    if(route.name === "Chat"){
                        iconName=ChatIcon
                    }
                    if(route.name === "Account"){
                        iconName=AccountIcon
                    }
                    return <Image source={iconName} tintColor={color} style={{ width: 20, height: 20 }}/>
                }),
                tabBarActiveTintColor: COLORS.main,
                tabBarInactiveTintColor: COLORS.lightText
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="My Course" component={Home} />
            <Tab.Screen name="My Test" component={Home} />
            <Tab.Screen name="Noti" component={Home} />
            <Tab.Screen name="Chat" component={Home} />
            <Tab.Screen name="Account" component={Home} />
        </Tab.Navigator>
    )
}