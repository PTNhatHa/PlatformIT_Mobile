import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { changeReadStatus, getAllNotificationOfUser, readAllNotification } from "../services/user";
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS, commonStyles } from "../utils/constants";
import { ButtonIconLightGreen } from "../components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';

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

export const NotificationScreen = (props)=>{
    const {state} = useUser()
    const [noti, setNoti] = useState([])
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false)
    const handleRefresh = async ()=>{
        setRefreshing(true)
        try {
            await props.getNoti()
        } catch (error) {
            console.log("Error refresh");
        } finally{
            setRefreshing(false)
        }
    }

    useEffect(()=>{
        setNoti(props.allNoti)
    }, [props.allNoti])

    const handleReadNoti = async(idNotification)=>{
        const response = await changeReadStatus(idNotification, state.idUser)
        if(response){
            props.getNoti()
        }
    }

    const handleConfirm = ()=>{
        Alert.alert(
            "Confirm Read All Notification",
            "Are you sure you want to mark all notification as read?",
            [
                {
                    text: "Yes",
                    onPress: ()=> handleReadAllNoti(),
                    style: "destructive"
                },
                {
                    text: "No",
                    style: "cancel"
                },
            ],
            { cancelable: true }
        )
    }
    const handleReadAllNoti = async()=>{
        const response = await readAllNotification(state.idUser)
        if(response){
            props.getNoti()
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
        <>
            <View style={styles.header}>
                <Text style={commonStyles.title}>Notification</Text>
                <TouchableOpacity style={styles.btn} onPress={()=>handleConfirm()}>
                    <Text style={{color: COLORS.main}}>Mark All as Read</Text>
                    <AntDesign name="checkcircle" size={16} color={COLORS.main} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={noti}
                renderItem={({item}) => 
                    <TouchableOpacity style={[styles.container, item.isRead === 0 && {backgroundColor: "white",}]} onPress={()=>handleReadNoti(item.idNotification)}>
                        <Image style={styles.img} source={{ uri: item.senderAvatar}}/>
                        <View style={{flexDirection: "column", flex: 1}}>
                            <Text style={styles.title}>{item.content}</Text>
                            <Text style={styles.dataDate}>{item.relativeTime}</Text>
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
        // backgroundColor: "white",
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
})