import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, View } from "react-native"
import { getAllNotificationOfUser } from "../services/user";
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS } from "../utils/constants";

export const NotificationScreen = ()=>{
    const {state} = useUser()
    const [noti, setNoti] = useState([])
    const [loading, setLoading] = useState(true);
    const getAllNoti = async()=>{
        try{
            const response = await getAllNotificationOfUser(state.idUser)
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
            renderItem={({item}) => <CardNoti data={item} isScreen={true}/>}
            keyExtractor={item => item.idNotification}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        />
    )
}