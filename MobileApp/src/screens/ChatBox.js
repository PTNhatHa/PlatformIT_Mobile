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

export const ChatBox = (props)=>{
    const navigation = useNavigation()
    const {state} = useUser()
    const [listMessage, setListMessage] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const handleRefresh = async ()=>{
        setRefreshing(true)
        try {

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
        setListMessage([
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: false
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 2,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
            {
                idUser: 1,
                fullName: "NhatHa",
                ava: "",
                nameLastChat: "NhatHa",
                message: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                relativeTime: "1 day agos",
                isRead: true
            },
        ])
    },[])

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
            <ScrollView contentContainerStyle={styles.wrapBox} ref={scrollViewRef} >
                {listMessage.length > 0 &&
                    listMessage.map((mess, index) => {
                        if(mess.idUser === 1){
                            if((mess.idUser !== listMessage[index + 1]?.idUser || index === 0)){
                                return(
                                    <View key={index} style={styles.wrapFlex}>
                                        <Image style={styles.img} source={mess.senderAvatar ? { uri: mess.senderAvatar} : DefaultAva}/>
                                        <Text style={[styles.dataMess, (mess.idUser === listMessage[index - 1]?.idUser) && styles.nonRadiusTopLeft, (mess.idUser === listMessage[index + 1]?.idUser) && styles.nonRadiusBottomLeft]}>
                                            {mess.message}
                                        </Text>                        
                                    </View>
                                )
                            } else{
                                return(
                                    <View key={index} style={[styles.wrapFlex, styles.subMess]}>
                                        <Text style={[styles.dataMess, (mess.idUser === listMessage[index - 1]?.idUser) && styles.nonRadiusTopLeft, (mess.idUser === listMessage[index + 1]?.idUser) && styles.nonRadiusBottomLeft]}>
                                            {mess.message}
                                        </Text>                        
                                    </View>
                                )
                            }
                        } else{
                            return(
                                <View key={index} style={[styles.wrapFlex, styles.myMess]}>                                   
                                    <Text style={[styles.dataMess, styles.dataMyMess, (mess.idUser === listMessage[index - 1]?.idUser) && styles.nonRadiusTopRight, (mess.idUser === listMessage[index + 1]?.idUser) && styles.nonRadiusBottomRight]}>
                                        {mess.message}
                                    </Text>                        
                                </View>
                            )
                        }
                    })
                }
            </ScrollView>
            <View style={styles.wrapperSearch}>
                <TextInput
                    value={""}
                    style={styles.input}
                    placeholder={"Aa"}
                />
                <TouchableOpacity>
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
        gap: 2
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
    }
})