import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS, currentIP } from "../utils/constants";
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
import { TeacherDetailAttendance } from "../screens/Teacher/TabMyCourse/TeacherDetailAttendance";
import { NotificationScreen } from "../screens/Notification";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { ViewAllFromDetail } from "../screens/ViewAllFromDetail";
import { getAllNotificationOfUser } from "../services/notification";
import * as signalR from '@microsoft/signalr';
import { TeacherLectureDetail } from "../screens/Teacher/TabMyLecture/TeacherLectureDetail";

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
            <StackHome.Screen
                name="Courses of center"
                component={ViewAllFromDetail}
            />
            <StackHome.Screen
                name="Courses of teacher"
                component={ViewAllFromDetail}
            />
            <StackHome.Screen
                name="Teachers of center"
                component={ViewAllFromDetail}
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
                component={DetailCourse}
            />
            <StackMyCourse.Screen
                name="Detail Attendance"
                component={TeacherDetailAttendance}
            />
            <StackMyCourse.Screen
                name="Detail Lecture"
                component={TeacherLectureDetail}
            />

            <StackMyCourse.Screen
                name="Detail Course"
                component={DetailCourse}
            />
            <StackMyCourse.Screen
                name="Detail Center"
                component={DetailCenter}
            />
            <StackMyCourse.Screen
                name="Detail Teacher"
                component={DetailTeacher}
            />
            <StackMyCourse.Screen
                name="Courses of center"
                component={ViewAllFromDetail}
            />
            <StackMyCourse.Screen
                name="Courses of teacher"
                component={ViewAllFromDetail}
            />
            <StackMyCourse.Screen
                name="Teachers of center"
                component={ViewAllFromDetail}
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
    const {state} = useUser()
    const [allNoti, setAllNoti]= useState([])
    const [unReadNoti, setUnReadNoti]= useState(0)

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

    useEffect(() => {
        // Create connection to the SignalR hub
        const connection = new signalR.HubConnectionBuilder()
            .withUrl('http://' + currentIP +':5000/notificationHub')  // Ensure the URL matches your backend
            .build();

        // Start the connection
        connection.start()
            .then(() => console.log('Connected to SignalR'))
            .catch(err => console.error('SignalR Connection Error: ', err));

        // Subscribe to the "UpdateNotifications" event
        connection.on('UpdateNotifications', (updatedNotifications) => {
            let notiUnRead = 0
            if(updatedNotifications){
                updatedNotifications.forEach(item => {
                    if(item.isRead === 0){
                        notiUnRead +=1
                    }
                });
                setAllNoti(updatedNotifications)
            }
            setUnReadNoti(notiUnRead)
        });

        // Clean up the connection when component unmounts
        return () => {
            connection.stop();
        };
    }, []);

    useEffect(()=>{
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
            <Tab.Screen name="Noti" 
                options={unReadNoti > 0 && { 
                    tabBarBadge: unReadNoti,
                    tabBarBadgeStyle: { backgroundColor: COLORS.main, color: 'white' }
                }}
            >
                {props => <NotificationScreen allNoti={allNoti} setUnReadNoti={setUnReadNoti} getNoti={getNoti}/>}
            </Tab.Screen>
            <Tab.Screen name="Chat" component={Home} />
            <Tab.Screen name="AccountScreen" component={StackAccountScreen} options={{ tabBarLabel: "Account" }}/>
        </Tab.Navigator>
    )
}