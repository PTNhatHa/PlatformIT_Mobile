import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS, commonStyles, currentIP } from "../utils/constants";
import { ButtonIconLightGreen } from "../components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';
import DefaultAva from "../../assets/images/DefaultAva.png"
import { changeReadStatus, readAllNotification } from "../services/notification";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllUserConversations, updateReadStatus } from "../services/message";
import { calculateRelativeTime, parseRelativeTime } from "../utils/utils";
import * as signalR from '@microsoft/signalr';

export const ChatBoard = ({route, getUnReadMessage})=>{
    const idTeacher = route?.params?.idTeacher || 0
    const idStudent = route?.params?.idStudent || 0
    const {name, avatar} = route?.params || {}
    const navigation = useNavigation()
    const {state} = useUser()
    const [listChat, setListChat] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false)

    const getAllConversation = async()=>{
        setLoading(true)
        try {
            const response = await getAllUserConversations(state.idUser)
            if(response){
                const newMess = response.map(mess => {
                    return{
                        ...mess,
                        timestamp: parseRelativeTime(mess.relativeTime),
                    }
                })
                setListChat(newMess)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    // useEffect(()=>{
    //     getAllConversation()
    //     const interval = setInterval(() => {
    //         setListChat((prevMessage) =>
    //           prevMessage.map((mess) => ({
    //             ...mess,
    //             relativeTime: calculateRelativeTime(mess.timestamp),
    //           }))
    //         )
    //     }, 60000); // Update every minute
    //     return () => clearInterval(interval);
    // }, [])

    useFocusEffect(
        useCallback(() => {
            getAllConversation()
            const interval = setInterval(() => {
                setListChat((prevMessage) =>
                  prevMessage.map((mess) => ({
                    ...mess,
                    relativeTime: calculateRelativeTime(mess.timestamp),
                  }))
                )
            }, 60000); // Update every minute
            return () => clearInterval(interval);
        }, [])
    );

    const handleRefresh = async ()=>{
        setRefreshing(true)
        try {

        } catch (error) {
            console.log("Error refresh");
        } finally{
            setRefreshing(false)
        }
    }

    useEffect(()=>{
        if(idStudent || idTeacher){
            navigation.navigate("ChatBox", {
                idStudent: idStudent,
                idTeacher: idTeacher,
                name: name || "",
                avatar: avatar || ""
            })
        }
    }, [idStudent, idTeacher])

    const handleReadMess = async(idUser, isRead)=>{
        try {
            if(isRead === 0){
                const response = await updateReadStatus(idUser, state.idUser)
                if(response){
                    getUnReadMessage()
                    getAllConversation()
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            if(state.idRole === 3){
                navigation.navigate("ChatBox", {
                    idTeacher: idUser
                })
            } else{
                navigation.navigate("ChatBox", {
                    idStudent: idUser
                })
            }
        }
    }

    useEffect(()=>{
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`http://${currentIP}:5000/chatHub?userId=${state.idUser}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();
        
        const startConnection = async () => {
            try {
                await connection.start();
                console.log('Connected to UpdateConversation chatboard hub.');                
                connection.on('UpdateChatList', (UpdateChatList) => {
                    console.log("UpdateChatList: ", UpdateChatList);
                    const response = UpdateChatList
                    if(response){
                        const newMess = response.map(mess => {
                            return{
                                ...mess,
                                timestamp: parseRelativeTime(mess.relativeTime),
                            }
                        })
                        setListChat(newMess)
                    }
                });
            } catch (error) {
                console.log('SignalR Connection chatboard Error:', error);
            }
        };    
        startConnection();
        connection.onclose((error) => {
            console.log('SignalR connection closed chatboard:', error);
            setTimeout(() => startConnection(), 5000); // Retry every 5 seconds
        });
    
        return () => {
            console.log('Stopping SignalR connection...');
            connection.stop().then(() => console.log('SignalR connection stopped.'));
        };
    }, [])

    if (loading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }

    return(
        <View style={styles.wrapContainer}>
            <View style={styles.wrapperSearch}>
                <MaterialIcons name="search" size={20} color="black" />
                <TextInput
                    value={"search"}
                    style={styles.input}
                    placeholder={"Search"}
                />
            </View>
            <FlatList
                data={listChat}
                renderItem={({item}) => 
                    <TouchableOpacity 
                        style={styles.container} 
                        onPress={()=>handleReadMess(item.userId, item.isRead)}
                        key={item.userId}
                    >
                        <Image style={styles.img} source={item.avatar ? { uri: item.avatar} : DefaultAva}/>
                        <View style={styles.wrapContent}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={[styles.dataMess, item.isRead === 0 && styles.dataMessActive]} numberOfLines={1} ellipsizeMode="tail">
                                {item.lastMessageSenderName === item.name ? `${item.name}: ` : "You: "}
                                {item.lastMessage}
                            </Text>
                        </View>
                        <Text style={[styles.dataMess, item.isRead === 0 && styles.dataMessActive]}>{item.relativeTime}</Text>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.userId}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}    
            />
        </View>
    )
}


const styles = StyleSheet.create({
    wrapContainer:{
        backgroundColor: "white"
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center"
    },
    wrapContent:{
        flex: 1,
    },
    title:{
        fontSize: 16,
        fontWeight: "bold",
        color: "Black"
    },
    dataDate: {
        fontSize: 12,
        color: COLORS.main,
    },
    dataMess: {
        fontSize: 12,
        color: COLORS.stroke,
        flexWrap: "wrap",
    },
    dataMessActive: {
        color: "black",
        fontWeight: "bold"
    },
    img:{
        width: 50,
        height: 50,
        borderRadius: 90,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: COLORS.lightText
    },
    header: {
        ...commonStyles.shadow,
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: "white", 
        padding: 16
    },
    btn: {
        paddingVertical: 8,
        flexDirection: "row",
        gap: 4,
        alignItems: "center"
    },
    wrapperSearch: {
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 2,
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    input:{
        fontSize: 16,
        width: "90%"
    },
})