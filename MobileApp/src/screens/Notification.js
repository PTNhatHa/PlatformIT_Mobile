import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getAllNotificationOfUser } from "../services/user";
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS } from "../utils/constants";

export const NotificationScreen = (props)=>{
    const {state} = useUser()
    const [noti, setNoti] = useState([])
    const [unReadNoti, setUnReadNoti]= useState(0)
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false)
    const handleRefresh = async ()=>{
        setRefreshing(true)
        try {
            await getAllNoti()
        } catch (error) {
            console.log("Error refresh");
        } finally{
            setRefreshing(false)
        }
    }
    const getAllNoti = async()=>{
        try{
            const response = await getAllNotificationOfUser(state.idUser)
            let notiUnRead = 0
            if(response){
                response.forEach(item => {
                    if(item.isRead === 0){
                        notiUnRead +=1
                    }
                });
            }
            setUnReadNoti(notiUnRead)
            props.setUnReadNoti(notiUnRead)
            setNoti(response)
        } catch(e){
            console.log("Error: ", e);
        } finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        getAllNoti()
    }, [])

    const handleOnPress = ()=>{
        setUnReadNoti(unReadNoti-1)
        props.setUnReadNoti(unReadNoti-1)
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
        <FlatList
            data={noti}
            renderItem={({item}) => 
                <TouchableOpacity style={styles.container} onPress={()=>handleOnPress()}>
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
    )
}


const styles = StyleSheet.create({
    container: {
        padding: 12,
        flexDirection: "row",
        columnGap: 10,
        backgroundColor: "white",
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
    }
})