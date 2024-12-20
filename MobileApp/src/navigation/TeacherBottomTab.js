import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "../utils/constants";
import { Home } from "../screens/Home";
import { TeacherPI } from "../screens/Teacher/TabAccount/TeacherPI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChangePassword } from "../components/ChangePassword";
import { TeacherAccount } from "../screens/Teacher/TabAccount/TeacherAccount";
import { TeacherHome } from "../screens/Teacher/TabHome/TeacherHome";
import { ScreenViewAll, StudentViewAll, TeacherViewAll, ViewAll } from "../screens/ViewAll";
import { DetailCourse } from "../screens/DetailCourse";
import { DetailCenter } from "../screens/DetailCenter";
import { DetailTeacher } from "../screens/DetailTeacher";
import { TeacherAllCourse } from "../screens/Teacher/TabMyCourse/TeacherAllCourse";
import { TeacherDetailCourse } from "../screens/Teacher/TabMyCourse/TeacherDetailCourse";
import { TeacherDetailAttendance } from "../screens/Teacher/TabMyCourse/TeacherDetailAttendance";
import { NotificationScreen } from "../screens/Notification";

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
                component={TeacherHome}
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
                component={TeacherAllCourse}
            />
            <StackMyCourse.Screen
                name="Detail My Course"
                component={TeacherDetailCourse}
            />
            <StackMyCourse.Screen
                name="Detail Attendance"
                component={TeacherDetailAttendance}
            />

        </StackMyCourse.Navigator>
    )
}

const StackNotiScreen = ()=>{
    const StackAccount = createNativeStackNavigator()
    return(
        <StackAccount.Navigator
            screenOptions={{
                headerTintColor: COLORS.main
            }}
        >
            <StackAccount.Screen
                name="Notification"
                component={NotificationScreen}
            />
        </StackAccount.Navigator>
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
                component={TeacherAccount}
            />
            <StackAccount.Screen
                name="Your infomation"
                component={TeacherPI}
            />
            <StackAccount.Screen
                name="Change password"
                component={ChangePassword}
            />
        </StackAccount.Navigator>
    )
}

export const TeacherBottomTab = ()=>{
    const Tab = createBottomTabNavigator()
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
                    if(route.name === "My Lecture"){
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
            <Tab.Screen name="HomeScreen" component={StackHomeScreen} options={{ tabBarLabel: "Home" }} />
            <Tab.Screen name="My Course" component={StackMyCourseScreen} />
            <Tab.Screen name="My Lecture" component={Home} />
            <Tab.Screen name="Noti" component={StackNotiScreen} />
            <Tab.Screen name="Chat" component={Home} />
            <Tab.Screen name="AccountScreen" component={StackAccountScreen} options={{ tabBarLabel: "Account" }}/>
        </Tab.Navigator>
    )
}