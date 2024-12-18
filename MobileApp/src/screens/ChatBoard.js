import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS, commonStyles } from "../utils/constants";
import { ButtonIconLightGreen } from "../components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';
import DefaultImg from "../../assets/images/DefaultImg.png"
import { changeReadStatus, readAllNotification } from "../services/notification";
import { useNavigation } from "@react-navigation/native";

// {
//     "idNotification": 6,
//     "senderAvatar": null,
//     "idSender": 9,
//     "idQualification": 14,
//     "content": "Your qualification: IELTS has been approved.",
//     "isRead": 0,
//     "notificationType": 1,
//     "idCourse": null,
//     "relativeTime": "8 days ago"
//   },

export const ChatBoard = (props)=>{
    const navigation = useNavigation()
    const {state} = useUser()
    const [currentIdChat, setCurrentIdChat] = useState(1)
    const [listChat, setListChat] = useState([
        {
            idUser: 1,
            fullName: "NhatHa",
            ava: "",
            message: "aaaaaaa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 2,
            fullName: "NhatHa",
            ava: "",
            message: "aaaaaaa",
            relativeTime: "1 day agos",
            isRead: true
        },
        {
            idUser: 2,
            fullName: "NhatHa",
            ava: "",
            message: "aaaaaaa",
            relativeTime: "1 day agos",
            isRead: false
        },
    ])
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

    useEffect(()=>{

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
        <>
            <View style={styles.header}>
                <Text style={commonStyles.title}>Conversation</Text>
            </View>
            <FlatList
                data={listChat}
                renderItem={({item}) => 
                    <TouchableOpacity 
                        style={[styles.container, (currentIdChat === item.idUser) && styles.bgBox]} 
                        onPress={()=>handleReadNoti(item.idNotification)}
                    >
                        <Image style={styles.img} source={item.senderAvatar ? { uri: item.senderAvatar} : DefaultImg}/>
                        <View style={{flexDirection: "column", flex: 1}}>
                            <Text style={styles.title}>{item.fullName}</Text>
                            <Text style={ !item.isRead ? styles.dataMess : styles.dataMessActive}>{item.message}</Text>
                            <Text style={ !item.isRead ? styles.dataMess : styles.dataMessActive}>{item.relativeTime}</Text>
                        </View>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.idNotification}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>}    
            />
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 12,
        flexDirection: "row",
        columnGap: 10,
    },
    title:{
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.stroke
    },
    dataDate: {
        fontSize: 12,
        color: COLORS.main,
    },
    dataMess: {
        fontSize: 12,
        color: COLORS.stroke,
    },
    dataMessActive: {
        fontSize: 12,
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
    bgBox: {
        backgroundColor: "#ECF2F2",
    }
})