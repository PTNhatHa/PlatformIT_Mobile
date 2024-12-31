import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS, currentIP } from "../utils/constants";
import { Home } from "../screens/Home";
import { StudentPI } from "../screens/Student/TabAccount/StudentPI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StudentAccount } from "../screens/Student/TabAccount/StudentAccount";
import { ChangePassword } from "../components/ChangePassword";
import { ScreenViewAll, StudentViewAll, ViewAll } from "../screens/ViewAll";
import { DetailCourse } from "../screens/DetailCourse";
import { DetailCenter } from "../screens/DetailCenter";
import { DetailTeacher } from "../screens/DetailTeacher";
import { StudentAllCourse } from "../screens/Student/TabMyCourse/StudentAllCourse";
import { NotificationScreen } from "../screens/Notification";
import { useUser } from "../contexts/UserContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { ViewAllFromDetail } from "../screens/ViewAllFromDetail";
import { getAllNotificationOfUser } from "../services/notification";
import * as signalR from '@microsoft/signalr';
import { TeacherLectureDetail } from "../screens/Teacher/TabMyCourse/TeacherLectureDetail";
import { StudentLectureDetail } from "../screens/Student/TabMyCourse/StudentLectureDetail";
import { StudentAllTest } from "../screens/Student/TabMyTest/StudentAllTest";
import { StudentDetailAsgm } from "../screens/Student/TabMyTest/StudentDetailAsgm";
import { StudentDoAsgm } from "../screens/Student/TabMyTest/StudentDoAsgm";
import { calculateRelativeTime, parseRelativeTime } from "../utils/utils";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { ChatBoard } from "../screens/ChatBoard";
import { ChatBox } from "../screens/ChatBox";
import { getAllUserConversations } from "../services/message";
import { CommentNoti } from "../screens/CommentNoti";
import { StudentPaymentHistory } from "../screens/Student/TabAccount/StudentPaymentHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from 'react-native';

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
                component={Home}
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
            <StackHome.Screen
                name="Detail Lecture"
                component={StudentLectureDetail}
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
                name="My Course"
                component={StudentAllCourse}
            />
            <StackMyCourse.Screen
                name="Detail My Course"
                component={DetailCourse}
            />
            <StackMyCourse.Screen
                name="Detail Lecture"
                component={StudentLectureDetail}
            />
            <StackMyCourse.Screen
                name="Detail Exercise"
                component={StudentDetailAsgm}
            />
            <StackMyCourse.Screen
                name="Do Assignment"
                component={StudentDoAsgm}
                options={{
                    headerShown: false,
                }}
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

const StackMyTestScreen = ()=>{
    const StackMyTest = createNativeStackNavigator()
    return(
        <StackMyTest.Navigator
            screenOptions={{
                headerTintColor: COLORS.main
            }}
        >
            <StackMyTest.Screen
                name="My Test"
                component={StudentAllTest}
            />
            <StackMyTest.Screen
                name="Detail Test"
                component={StudentDetailAsgm}
            />
            <StackMyTest.Screen
                name="Do Assignment"
                component={StudentDoAsgm}
                options={{
                    headerShown: false,
                }}
            />
        </StackMyTest.Navigator>
    )
}

const StackChatScreen = ({getUnReadMessage})=>{
    const StackChat = createNativeStackNavigator()
    return(
        <StackChat.Navigator
            screenOptions={{
                headerTintColor: COLORS.main
            }}
        >
            <StackChat.Screen
                name="ChatBoard"
                options={{ headerShown: true }}
            >
                {props => (
                    <ChatBoard 
                        {...props} 
                        getUnReadMessage={getUnReadMessage} 
                    />
                )}
            </StackChat.Screen>
            <StackChat.Screen
                name="ChatBox"
                component={ChatBox}
                options={{ headerShown: false }}
            />
        </StackChat.Navigator>
    )
}

const StackNotiScreen = ({allNoti, setUnReadNoti, getNoti})=>{
    const StackNoti = createNativeStackNavigator()
    return(
        <StackNoti.Navigator
            screenOptions={{
                headerTintColor: COLORS.main
            }}
        >
            <StackNoti.Screen
                name="NotiBoard"               
                options={{ headerShown: false }}
            >
                {(props) => (
                    <NotificationScreen 
                        {...props} 
                        allNoti={allNoti} 
                        setUnReadNoti={setUnReadNoti} 
                        getNoti={getNoti}
                    />
                )}
            </StackNoti.Screen>
            <StackNoti.Screen
                name="Comment"
                component={CommentNoti}
            />
        </StackNoti.Navigator>
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
                name="Payment History"
                component={StudentPaymentHistory}
            />
        </StackAccount.Navigator>
    )
}

export const StudentBottomTab = ()=>{
    const Tab = createBottomTabNavigator()
    const {state} = useUser()
    const [allNoti, setAllNoti]= useState([])
    const [unReadNoti, setUnReadNoti]= useState(0)
    const [unReadMess, setUnReadMess]= useState(0)
    const intervalRef = useRef(null)
    const connectionRefNoti = useRef(null); // Lưu trữ kết nối
    const connectionRefChat = useRef(null); // Lưu trữ kết nối
    const appState = useRef(AppState.currentState); // Theo dõi trạng thái app
    
    const getNoti = async()=>{
        const response = await getAllNotificationOfUser(state.idUser)
        let notiUnRead = 0
        if(response){
            response.forEach(item => {
                if(item.isRead === 0){
                    notiUnRead +=1
                }
            });
            const newNoti = response.map(noti => {
                return{
                    ...noti,
                    timestamp: parseRelativeTime(noti.relativeTime),
                }
            })
            setAllNoti(newNoti)
        }
        setUnReadNoti(notiUnRead)
    }

    const getUnReadMessage = async()=>{
        try {
            const response = await getAllUserConversations(state.idUser)
            let messUnRead = 0
            if(response){
                response.forEach(item => {
                    if(item.isRead === 0){
                        messUnRead +=1
                    }
                });
                
            }
            setUnReadMess(messUnRead)
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getNoti()
        getUnReadMessage()
        const startUpdatingRelativeTime = () => {
            intervalRef.current = setInterval(() => {
                setAllNoti((prevNotifications) =>
                    prevNotifications.map((notification) => ({
                        ...notification,
                        relativeTime: calculateRelativeTime(notification.timestamp),
                    }))
                );
            }, 60000); // Update every minute
        };
    
        startUpdatingRelativeTime();
    
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [])

    useEffect(() => {
        // Khởi tạo kết nối SignalR
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${currentIP}:5000/notificationHub?userId=${state.idUser}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();
    
        connectionRefNoti.current = connection; // Lưu kết nối vào ref
    
        const startConnection = async () => {
            try {
                await connection.start();
                console.log('Connected to SignalR hub.');
    
                // Lắng nghe sự kiện cập nhật notification
                connection.on('UpdateNotifications', (updatedNotifications) => {
                    let notiUnRead = 0;
                    const processedData = updatedNotifications.map((notification) => {
                        try {
                            if (notification.isRead === 0) {
                                notiUnRead += 1;
                            }
                            return {
                                ...notification,
                                timestamp: parseRelativeTime(notification.relativeTime),
                            };
                        } catch (error) {
                            console.log('Error parsing notification:', notification, error);
                            return notification; // Fallback
                        }
                    });
                    setUnReadNoti(notiUnRead);
                    setAllNoti(processedData);
                });
            } catch (error) {
                console.log('SignalR Connection Error:', error);
            }
        };
    
        // Bắt sự kiện kết nối bị ngắt
        connection.onclose((error) => {
            console.log('SignalR connection closed:', error);
            setTimeout(() => startConnection(), 5000); // Thử kết nối lại sau 5 giây
        });
    
        // Xử lý trạng thái AppState
        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // Ứng dụng quay lại => Tái kết nối nếu bị mất kết nối
                if (connection.state === signalR.HubConnectionState.Disconnected) {
                    console.log('App quay lại, tái kết nối SignalR...');
                    startConnection();
                }
            } else if (nextAppState === 'background') {
                // Ứng dụng chuyển sang background => Dừng kết nối
                if (connection.state === signalR.HubConnectionState.Connected) {
                    console.log('App vào background, ngắt kết nối SignalR...');
                    connection.stop().then(() => console.log('SignalR connection stopped.'));
                }
            }
            appState.current = nextAppState;
        };
    
        // Thêm listener cho AppState
        const subscription = AppState.addEventListener('change', handleAppStateChange);
    
        // Khởi động kết nối khi component mount
        startConnection();
    
        return () => {
            console.log('Stopping SignalR connection...');
            connection.stop().then(() => console.log('SignalR connection stopped.'));
            subscription.remove(); // Dọn dẹp listener
        };
    }, []);
    
    
    const updateReadMess = async(idUser)=>{
        try {
            const response = await updateReadStatus(idUser, state.idUser)
            if(response){
                console.log("response: ", response);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    
    // NewChat
    useEffect(() => {
        // Khởi tạo kết nối SignalR
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${currentIP}:5000/chatHub?userId=${state.idUser}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();
    
        connectionRefChat.current = connection; // Lưu kết nối vào ref
    
        const startConnection = async () => {
            try {
                await connection.start();
                console.log('Connected to SignalR chat hub.');
    
                // Lắng nghe sự kiện cập nhật danh sách chat
                connection.on('UpdateChatList', async (updatedConversation) => {
                    try {
                        const response = updatedConversation;
                        const currentChat = await AsyncStorage.getItem('currentChat');
    
                        if (response) {
                            const cleanedCurrentChat = currentChat?.trim(); // Loại bỏ khoảng trắng
                            const currentChatNumber = Number(cleanedCurrentChat);
                            const userIdNumber = Number(response[0]?.userId);
                            if (currentChatNumber === userIdNumber) {
                                // Nếu đang trong cuộc trò chuyện hiện tại, cập nhật trạng thái đọc
                                updateReadMess(state.currentChat);
                            } else {
                                // Nếu không, tính số tin nhắn chưa đọc
                                let messUnRead = 0;
                                response.forEach((item) => {
                                    if (item?.isRead === 0) {
                                        messUnRead += 1;
                                    }
                                });
                                setUnReadMess(messUnRead);
                            }
                        }
                    } catch (error) {
                        console.log('Error processing UpdateChatList:', error);
                    }
                });
            } catch (error) {
                console.log('SignalR Connection Error:', error.message);
            }
        };
    
        // Bắt sự kiện kết nối bị ngắt
        connection.onclose((error) => {
            console.log('SignalR connection closed:', error);
            setTimeout(() => startConnection(), 5000); // Thử kết nối lại sau 5 giây
        });
    
        // Xử lý trạng thái AppState
        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // Ứng dụng quay lại => Tái kết nối nếu bị mất kết nối
                if (connection.state === signalR.HubConnectionState.Disconnected) {
                    console.log('App quay lại, tái kết nối SignalR chat hub...');
                    startConnection();
                }
            } else if (nextAppState === 'background') {
                // Ứng dụng chuyển sang background => Dừng kết nối
                if (connection.state === signalR.HubConnectionState.Connected) {
                    console.log('App vào background, ngắt kết nối SignalR chat hub...');
                    connection.stop().then(() => console.log('SignalR chat hub connection stopped.'));
                }
            }
            appState.current = nextAppState;
        };
    
        // Thêm listener cho AppState
        const subscription = AppState.addEventListener('change', handleAppStateChange);
    
        // Khởi động kết nối khi component mount
        startConnection();
    
        return () => {
            console.log('Stopping SignalR chat hub connection...');
            connection.stop().then(() => console.log('SignalR chat hub connection stopped.'));
            subscription.remove(); // Dọn dẹp listener
        };
    }, []);
    


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
            <Tab.Screen name="HomeScreen" component={StackHomeScreen} options={{ tabBarLabel: "Home" }}
                listeners={() => ({
                    tabPress: (e) => {                      
                      if (state.isDoAsgm === true) {
                        e.preventDefault(); // Ngăn người dùng chuyển tab
                        Alert.alert("Warning", "You cannot switch tabs while doing an assignment!");
                      }
                    },
                  })}
            />
            <Tab.Screen name="My Course" component={StackMyCourseScreen} 
                listeners={() => ({
                    tabPress: (e) => {                      
                      if (state.isDoAsgm === true) {
                        e.preventDefault(); // Ngăn người dùng chuyển tab
                        Alert.alert("Warning", "You cannot switch tabs while doing an assignment!");
                      }
                    },
                  })}
            />
            <Tab.Screen name="My Test" component={StackMyTestScreen} 
                listeners={() => ({
                    tabPress: (e) => {                      
                      if (state.isDoAsgm === true) {
                        e.preventDefault(); // Ngăn người dùng chuyển tab
                        Alert.alert("Warning", "You cannot switch tabs while doing an assignment!");
                      }
                    },
                  })}
            />
            <Tab.Screen name="Noti" 
                options={unReadNoti > 0 && { 
                    tabBarBadge: unReadNoti,
                    tabBarBadgeStyle: { backgroundColor: COLORS.main, color: 'white' }
                }}
                listeners={() => ({
                    tabPress: (e) => {                      
                      if (state.isDoAsgm === true) {
                        e.preventDefault(); // Ngăn người dùng chuyển tab
                        Alert.alert("Warning", "You cannot switch tabs while doing an assignment!");
                      }
                    },
                  })}
            >
                {props => <StackNotiScreen allNoti={allNoti} setUnReadNoti={setUnReadNoti} getNoti={getNoti}/>}
            </Tab.Screen>
            <Tab.Screen 
                name="Chat" 
                options={unReadMess > 0 && { 
                    tabBarBadge: unReadMess,
                    tabBarBadgeStyle: { backgroundColor: COLORS.main, color: 'white' }
                }}
                listeners={() => ({
                    tabPress: (e) => {                      
                    if (state.isDoAsgm === true) {
                        e.preventDefault(); // Ngăn người dùng chuyển tab
                        Alert.alert("Warning", "You cannot switch tabs while doing an assignment!");
                    }
                    },
                })}
            >
                {props => <StackChatScreen 
                    {...props} 
                    getUnReadMessage={getUnReadMessage} // Truyền hàm vào StackChatScreen
                />}
            </Tab.Screen>
            <Tab.Screen name="AccountScreen" component={StackAccountScreen} options={{ tabBarLabel: "Account" }}
                listeners={() => ({
                    tabPress: (e) => {                      
                      if (state.isDoAsgm === true) {
                        e.preventDefault(); // Ngăn người dùng chuyển tab
                        Alert.alert("Warning", "You cannot switch tabs while doing an assignment!");
                      }
                    },
                  })}
            />
        </Tab.Navigator>
    )
}
