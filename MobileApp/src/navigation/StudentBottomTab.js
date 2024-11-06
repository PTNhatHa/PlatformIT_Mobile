import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "../utils/constants";
import { Home } from "../screens/Home";
import { StudentPI } from "../screens/Student/TabAccount/StudentPI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StudentAccount } from "../screens/Student/TabAccount/StudentAccount";
import { ChangePassword } from "../components/ChangePassword";
import { StudentHome } from "../screens/Student/TabHome/StudentHome";
import { ScreenViewAll, StudentViewAll, ViewAll } from "../screens/ViewAll";
import { DetailCourse } from "../screens/DetailCourse";
import { DetailCenter } from "../screens/DetailCenter";
import { DetailTeacher } from "../screens/DetailTeacher";
import { StudentAllCourse } from "../screens/Student/TabMyCourse/StudentAllCourse";
import { StudentDetailCourse } from "../screens/Student/TabMyCourse/StudentDetailCourse";
import { NotificationScreen } from "../screens/Notification";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import { getAllNotificationOfUser } from "../services/user";

const StackHomeScreen = ()=>{
    const StackHome = createNativeStackNavigator()
    return(
        <StackHome.Navigator
            screenOptions={{
                headerTintColor: COLORS.main
            }}
        >
            <StackHome.Screen
                name="Home"
                component={StudentHome}
            />
            <StackHome.Screen
                name="View All"
                component={ScreenViewAll}
            />
            <StackHome.Screen
                name="Detail Course"
                component={DetailCourse}
            />
            <StackHome.Screen
                name="Detail Center"
                component={DetailCenter}
            />
            <StackHome.Screen
                name="Detail Teacher"
                component={DetailTeacher}
            />
        </StackHome.Navigator>
    )
}

const StackMyCourseScreen = ()=>{
    const StackMyCourse = createNativeStackNavigator()
    return(
        <StackMyCourse.Navigator
            screenOptions={{
                headerTintColor: COLORS.main
            }}
        >
            <StackMyCourse.Screen
                name="MyCourse"
                component={StudentAllCourse}
            />
            <StackMyCourse.Screen
                name="DetailCourse"
                component={DetailCourse}
            />
        </StackMyCourse.Navigator>
    )
}

const StackAccountScreen = ()=>{
    const StackAccount = createNativeStackNavigator()
    return(
        <StackAccount.Navigator
            screenOptions={{
                headerTintColor: COLORS.main
            }}
        >
            <StackAccount.Screen
                name="Account"
                component={StudentAccount}
            />
            <StackAccount.Screen
                name="Your infomation"
                component={StudentPI}
            />
            <StackAccount.Screen
                name="Change password"
                component={ChangePassword}
            />
        </StackAccount.Navigator>
    )
}

export const StudentBottomTab = ()=>{
    const Tab = createBottomTabNavigator()
    const {state} = useUser()
    const [allNoti, setAllNoti]= useState([])
    const [unReadNoti, setUnReadNoti]= useState(0)
    useEffect(()=>{
        const getNoti = async()=>{
            const response = await getAllNotificationOfUser(state.idUser)
            let notiUnRead = 0
            if(response){
                response.forEach(item => {
                    if(item.isRead === 0){
                        notiUnRead +=1
                    }
                });
                setAllNoti(response)
            }
            setUnReadNoti(notiUnRead)
        }
        getNoti()
    }, [])
    return(
        <Tab.Navigator
            screenOptions={({route})=>({
                tabBarIcon: (({color})=>{
                    if(route.name === "HomeScreen"){
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
                    if(route.name === "AccountScreen"){
                        return <Feather name="user" size={24} color={color} />
                    }
                }),
                tabBarActiveTintColor: COLORS.main,
                tabBarInactiveTintColor: COLORS.lightText,
                headerShown: false
            })}
        >
            <Tab.Screen name="HomeScreen" component={StackHomeScreen} options={{ tabBarLabel: "Home" }}/>
            <Tab.Screen name="My Course" component={StackMyCourseScreen} />
            <Tab.Screen name="My Test" component={Home} />
            <Tab.Screen name="Noti" 
                options={unReadNoti > 0 && { 
                    tabBarBadge: unReadNoti,
                    tabBarBadgeStyle: { backgroundColor: COLORS.main, color: 'white' }
                }}
            >
                {props => <NotificationScreen allNoti={allNoti} setUnReadNoti={setUnReadNoti} />}
            </Tab.Screen>
            <Tab.Screen name="Chat" component={Home} />
            <Tab.Screen name="AccountScreen" component={StackAccountScreen} options={{ tabBarLabel: "Account" }}/>
        </Tab.Navigator>
    )
}
