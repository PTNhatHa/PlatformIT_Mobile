import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS, commonStyles } from "../utils/constants";
import { ButtonIconLightGreen } from "../components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';
import DefaultAva from "../../assets/images/DefaultAva.png"
import { changeReadStatus, readAllNotification } from "../services/notification";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getConversation, sendMessage } from "../services/message";

export const ChatBox = ({route})=>{
    const idTeacher = route?.params?.idTeacher || null
    const idStudent = route?.params?.idStudent || null
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

    const getMessages = async()=>{
        setLoading(true)
        try {
            const response = await getConversation(state.idUser, idStudent || idTeacher)
            // console.log(response);
            if(response){
                setListMessage(response)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }
    const handleRefresh = async ()=>{
        setRefreshing(true)
        try {
            getMessages()
        } catch (error) {
            console.log("Error refresh");
        } finally{
            setRefreshing(false)
        }
    }

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [listMessage]);

    useEffect(()=>{
        getMessages()
    },[])

    const handleSendMessage = async()=>{
        setLoading(true)
        try {
            const response = await sendMessage(newMessage)
            if(response){
                // reload
                // Alert.alert("Done", "Done")
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
                <Text style={commonStyles.title}>Name</Text>
            </View>
            <View style={styles.containerMess}>
                <View>
                    <ScrollView contentContainerStyle={styles.wrapBox} ref={scrollViewRef} >
                        {listMessage.length > 0 &&
                            listMessage.map((mess, index) => {
                                if(mess.idSender !== state.idUser){
                                    if((mess.idSender !== listMessage[index + 1]?.idSender)){
                                        return(
                                            <View key={index} style={styles.wrapFlex}>
                                                <Image style={styles.img} source={mess.senderAvatar ? { uri: mess.senderAvatar} : DefaultAva}/>
                                                <Text style={[styles.dataMess, (mess.idSender === listMessage[index - 1]?.idSender) && styles.nonRadiusTopLeft, (mess.idSender === listMessage[index + 1]?.idSender) && styles.nonRadiusBottomLeft]}>
                                                    {mess.content}
                                                </Text>                        
                                            </View>
                                        )
                                    } else{
                                        return(
                                            <View key={index} style={[styles.wrapFlex, styles.subMess]}>
                                                <Text style={[styles.dataMess, (mess.idSender === listMessage[index - 1]?.idSender) && styles.nonRadiusTopLeft, (mess.idSender === listMessage[index + 1]?.idSender) && styles.nonRadiusBottomLeft]}>
                                                    {mess.content}
                                                </Text>                        
                                            </View>
                                        )
                                    }
                                } else{
                                    return(
                                        <View key={index} style={[styles.wrapFlex, styles.myMess]}>                                   
                                            <Text style={[styles.dataMess, styles.dataMyMess, (mess.idSender === listMessage[index - 1]?.idSender) && styles.nonRadiusTopRight, (mess.idSender === listMessage[index + 1]?.idSender) && styles.nonRadiusBottomRight]}>
                                                {mess.content}
                                            </Text>                        
                                        </View>
                                    )
                                }
                            })
                        }
                    </ScrollView>
                </View>
            </View>
            <View style={styles.wrapperSearch}>
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
    wrapFlex: {
        flexDirection: "row",
        gap: 8,
    },
    wrapBox:{
        marginHorizontal: 16,
        paddingVertical: 16,
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
        flex: 1, // Đảm bảo container chiếm hết không gian còn lại
        borderWidth: 1,
        justifyContent: 'flex-end' // Đảm bảo nội dung trong ScrollView nằm sát dưới
    }
})