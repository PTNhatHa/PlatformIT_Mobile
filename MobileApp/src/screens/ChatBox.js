import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS, commonStyles, currentIP } from "../utils/constants";
import { ButtonIconLightGreen } from "../components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';
import DefaultAva from "../../assets/images/DefaultAva.png"
import { changeReadStatus, readAllNotification } from "../services/notification";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getConversation, sendMessage } from "../services/message";
import { formatDateTime, getTime } from "../utils/utils";
import { isChatAvailable } from "../services/user";
import * as signalR from '@microsoft/signalr';

export const ChatBox = ({route})=>{
    const idTeacher = route?.params?.idTeacher || null
    const idStudent = route?.params?.idStudent || null
    const {name, avatar} = route?.params || {}
    const navigation = useNavigation()
    const {state} = useUser()
    const [listMessage, setListMessage] = useState([])
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false)
    const [newMessage, setNewMessage] = useState({
        idSender: state.idUser,
        idReceiver: idStudent || idTeacher,
        content: "",
        createdBy: state.idUser
    })
    const [receiverName, setReceiverName] = useState({
        name: name || "",
        avatar: avatar || ""
    })
    const scrollViewRef = useRef(null);
    const [isChat, setIsChat] = useState(true)

    const getMessages = async()=>{
        setLoading(true)
        try {
            const response = await getConversation(state.idUser, idStudent || idTeacher)            
            if(response){
                setListMessage(response)
                setReceiverName(response[0].idSender !== state.idUser ? 
                    {
                        name: response[0].senderName,
                        avatar: response[0].senderAvatar
                    }
                    :
                    {
                        name: response[0].receiverName,
                        avatar: response[0].receiverAvatar
                    }
                    
                )
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    const checkIsChat = async()=>{
        try {
            const response = await isChatAvailable(idStudent || state.idUser, idTeacher || state.idUser)
            setIsChat(response)
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [listMessage]);

    useEffect(()=>{
        getMessages()
        checkIsChat()
    },[])

    useEffect(()=>{
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`http://${currentIP}:5000/chatHub?userId=${state.idUser}`)
            .configureLogging(signalR.LogLevel.Information)
            .build();
        
        const startConnection = async () => {
            try {
                await connection.start();
                // console.log('Connected to UpdateConversation chatBox hub.');
                connection.on('UpdateNewMessage', (updateNewMessage) => {
                    setLoading(true)  
                    if(updateNewMessage){
                        const date = new Date();
                        const isoDateWithoutZ = date.toISOString().replace('Z', '');
                        setListMessage((prev) => [...prev, {
                            idSender: updateNewMessage.idSender,
                            idReceiver: state.idUser,
                            content: updateNewMessage.content,
                            createdDate: isoDateWithoutZ,
                        }])
                    }
                    setLoading(false)
                });
            } catch (error) {
                console.log('SignalR Connection Error chatBox:', error);
            }
        };    
        startConnection();
        connection.onclose((error) => {
            console.log('SignalR connection closed chatBox:', error);
            setTimeout(() => startConnection(), 5000); // Retry every 5 seconds
        });
    
        return () => {
            console.log('Stopping SignalR connection...');
            connection.stop().then(() => console.log('SignalR connection stopped.'));
        };
    }, [])

    const handleSendMessage = async()=>{
        setLoading(true)
        try {
            const response = await sendMessage(newMessage)
            if(response){
                getMessages()
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

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
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color={COLORS.main} />
                </TouchableOpacity>
                <Image style={styles.img} source={receiverName.avatar ? { uri: receiverName.avatar} : DefaultAva}/>
                <Text style={commonStyles.title}>{receiverName.name}</Text>
            </View>
            <View style={styles.containerMess}>
                <View>
                    <ScrollView contentContainerStyle={styles.wrapBox} ref={scrollViewRef} >
                        {listMessage.length > 0 &&
                            listMessage.map((mess, index) => {
                                const isShowDateTimePrev = !listMessage[index - 1] || (new Date(mess.createdDate) - new Date(listMessage[index - 1]?.createdDate)) / 60000 > 15
                                const isShowDateTimeNext = !listMessage[index + 1] || (new Date(listMessage[index + 1]?.createdDate) - new Date(mess.createdDate)) / 60000 > 15
                                const isToday = formatDateTime(mess.createdDate) === formatDateTime(new Date())
                                if(mess.idSender !== state.idUser){
                                    if((mess.idSender !== listMessage[index + 1]?.idSender || isShowDateTimeNext)){
                                        return(
                                            <View key={index}>                                                
                                                {isShowDateTimePrev && <Text style={styles.textDateTime}>{isToday ? getTime(mess.createdDate, true) : formatDateTime(mess.createdDate, true)}</Text>}
                                                <View key={index} style={styles.wrapFlex}>
                                                    <Image style={styles.img} source={receiverName.avatar ? { uri: receiverName.avatar} : DefaultAva}/>
                                                    <Text style={[styles.dataMess, (mess.idSender === listMessage[index - 1]?.idSender && !isShowDateTimePrev) && styles.nonRadiusTopLeft, (mess.idSender === listMessage[index + 1]?.idSender && !isShowDateTimeNext) && styles.nonRadiusBottomLeft]}>
                                                        {mess.content}
                                                    </Text>                        
                                                </View>
                                            </View>
                                        )
                                    } else{
                                        return(
                                            <View key={index}>
                                                {isShowDateTimePrev && <Text style={styles.textDateTime}>{isToday ? getTime(mess.createdDate, true) : formatDateTime(mess.createdDate, true)}</Text>}
                                                <View key={index} style={[styles.wrapFlex, styles.subMess]}>
                                                    <Text style={[styles.dataMess, (mess.idSender === listMessage[index - 1]?.idSender && !isShowDateTimePrev) && styles.nonRadiusTopLeft, (mess.idSender === listMessage[index + 1]?.idSender && !isShowDateTimeNext) && styles.nonRadiusBottomLeft]}>
                                                        {mess.content}
                                                    </Text>                        
                                                </View>
                                            </View>
                                        )
                                    }
                                } else{
                                    return(
                                        <View key={index}>
                                            {isShowDateTimePrev && <Text style={styles.textDateTime}>{isToday ? getTime(mess.createdDate) : formatDateTime(mess.createdDate, true)}</Text>}
                                            <View key={index} style={[styles.wrapFlex, styles.myMess]}>                                   
                                                <Text style={[styles.dataMess, styles.dataMyMess, (mess.idSender === listMessage[index - 1]?.idSender && !isShowDateTimePrev) && styles.nonRadiusTopRight, (mess.idSender === listMessage[index + 1]?.idSender && !isShowDateTimeNext) && styles.nonRadiusBottomRight]}>
                                                    {mess.content}
                                                </Text>                        
                                            </View>
                                        </View>
                                    )
                                }
                            })
                        }
                        {!isChat && <Text style={styles.textDateTime}>You can't chat now.</Text>}
                    </ScrollView>
                </View>
            </View>
            {isChat && 
            <View style={styles.wrapperNewMessage}>
                <TextInput
                    value={newMessage}
                    style={styles.input}
                    placeholder={"Aa"}
                    onChangeText={(v)=>setNewMessage({
                        ...newMessage,
                        content: v
                    })}
                />
                <TouchableOpacity onPress={()=>handleSendMessage()}>
                    <FontAwesome name="send-o" size={24} color="black" />
                </TouchableOpacity>
            </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    wrapContainer:{
        backgroundColor: "white",
        flex: 1
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
        fontSize: 14,
        color: "black",
        flexWrap: "wrap",
        backgroundColor: COLORS.lightText,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        textAlignVertical: "center",
        maxWidth: "70%"
    },
    dataMyMess:{
        backgroundColor: COLORS.main30
    },
    img:{
        width: 35,
        height: 35,
        borderRadius: 90,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: COLORS.lightText
    },
    header: {
        ...commonStyles.shadow,
        flexDirection: "row", 
        alignItems: "center",
        backgroundColor: "white", 
        padding: 16,
        gap: 8
    },
    btn: {
        paddingVertical: 8,
        flexDirection: "row",
        gap: 4,
        alignItems: "center"
    },
    wrapperNewMessage: {
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
    wrapFlex: {
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-end"
    },
    wrapBox:{
        marginHorizontal: 16,
        paddingTop: 16,
        gap: 2,
    },
    myMess:{
        alignSelf: "flex-end",
    },
    nonRadiusTopLeft:{
        borderTopLeftRadius: 4
    },
    nonRadiusBottomLeft:{
        borderBottomLeftRadius: 4
    },
    nonRadiusTopRight:{
        borderTopRightRadius: 4
    },
    nonRadiusBottomRight:{
        borderBottomRightRadius: 4
    },
    subMess:{
        marginLeft: 43
    },
    containerMess:{
        flex: 1,
        justifyContent: 'flex-end'
    },
    textDateTime:{
        textAlign: "center",
        fontSize: 12,
        color: COLORS.stroke,
        marginVertical: 16,
    }
})