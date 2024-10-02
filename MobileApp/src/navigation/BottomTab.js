import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "../constants";
import { Home } from "../screens/Home";
import { PersionalInfor } from "../components/PI";
import { StudentPI } from "../screens/Student/StudentPI";
import { TeacherPI } from "../screens/Teacher/TeacherPI";

export const StudentBottomTab = ()=>{
    const Tab = createBottomTabNavigator()
    return(
        <Tab.Navigator
            screenOptions={({route})=>({
                tabBarIcon: (({color})=>{
                    if(route.name === "Home"){
                        return <Feather name="home" size={24} color={color}/>
                    }
                    if(route.name === "My Course"){
                        return <AntDesign name="book" size={24} color={color} />
                    }
                    if(route.name === "My Test"){
                        return <Ionicons name="documents-outline" size={24} color={color} />
                    }
                    if(route.name === "Noti"){
                        return <Ionicons name="notifications-outline" size={24} color={color} />
                    }
                    if(route.name === "Chat"){
                        return <Ionicons name="chatbubble-outline" size={24} color={color} />
                    }
                    if(route.name === "Account"){
                        return <Feather name="user" size={24} color={color} />
                    }
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
            <Tab.Screen name="Account" component={StudentPI} />
        </Tab.Navigator>
    )
}

export const TeacherBottomTab = ()=>{
    const Tab = createBottomTabNavigator()
    return(
        <Tab.Navigator
            screenOptions={({route})=>({
                tabBarIcon: (({color})=>{
                    if(route.name === "Home"){
                        return <Feather name="home" size={24} color={color}/>
                    }
                    if(route.name === "My Course"){
                        return <AntDesign name="book" size={24} color={color} />
                    }
                    if(route.name === "My Lecture"){
                        return <Ionicons name="documents-outline" size={24} color={color} />
                    }
                    if(route.name === "Noti"){
                        return <Ionicons name="notifications-outline" size={24} color={color} />
                    }
                    if(route.name === "Chat"){
                        return <Ionicons name="chatbubble-outline" size={24} color={color} />
                    }
                    if(route.name === "Account"){
                        return <Feather name="user" size={24} color={color} />
                    }
                }),
                tabBarActiveTintColor: COLORS.main,
                tabBarInactiveTintColor: COLORS.lightText
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="My Course" component={Home} />
            <Tab.Screen name="My Lecture" component={Home} />
            <Tab.Screen name="Noti" component={Home} />
            <Tab.Screen name="Chat" component={Home} />
            <Tab.Screen name="Account" component={TeacherPI} />
        </Tab.Navigator>
    )
}