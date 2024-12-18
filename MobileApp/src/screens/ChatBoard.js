import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useUser } from "../contexts/UserContext";
import { CardNoti } from "../components/CardNotification";
import { COLORS, commonStyles } from "../utils/constants";
import { ButtonIconLightGreen } from "../components/Button";
import AntDesign from '@expo/vector-icons/AntDesign';
import DefaultAva from "../../assets/images/DefaultAva.png"
import { changeReadStatus, readAllNotification } from "../services/notification";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export const ChatBoard = (props)=>{
    const navigation = useNavigation()
    const {state} = useUser()
    const [listChat, setListChat] = useState([
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
            fullName: "Hyy",
            ava: "",
            nameLastChat: null,
            message: "aduuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu uuuu uuuuummm mmmmmmmmmmmmmmmmmmmmmmmmmmmmmm",
            relativeTime: "1 day agos",
            isRead: true
        },
        {
            idUser: 3,
            fullName: "Taho",
            ava: "",
            nameLastChat: "Taho",
            message: "woa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 4,
            fullName: "NhatHa",
            ava: "",
            nameLastChat: "NhatHa",
            message: "aaaaaaa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 5,
            fullName: "Hyy",
            ava: "",
            nameLastChat: null,
            message: "noi ",
            relativeTime: "1 day agos",
            isRead: true
        },
        {
            idUser: 6,
            fullName: "Taho",
            ava: "",
            nameLastChat: "Taho",
            message: "woa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 7,
            fullName: "Taho",
            ava: "",
            nameLastChat: "Taho",
            message: "woa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 8,
            fullName: "Taho",
            ava: "",
            nameLastChat: "Taho",
            message: "woa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 9,
            fullName: "Taho",
            ava: "",
            nameLastChat: "Taho",
            message: "woa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 10,
            fullName: "Taho",
            ava: "",
            nameLastChat: "Taho",
            message: "woa",
            relativeTime: "1 day agos",
            isRead: false
        },
        {
            idUser: 11,
            fullName: "Taho",
            ava: "",
            nameLastChat: "Taho",
            message: "woa",
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
                        onPress={()=>{}}
                    >
                        <Image style={styles.img} source={item.senderAvatar ? { uri: item.senderAvatar} : DefaultAva}/>
                        <View style={styles.wrapContent}>
                            <Text style={styles.title}>{item.fullName}</Text>
                            <Text style={[styles.dataMess, item.isRead && styles.dataMessActive]} numberOfLines={1} ellipsizeMode="tail">
                                {item.nameLastChat === item.fullName ? item.fullName : "You"}: {item.message}
                            </Text>
                        </View>
                        <Text style={[styles.dataMess, item.isRead && styles.dataMessActive]}>{item.relativeTime}</Text>
                    </TouchableOpacity>
                }
                keyExtractor={item => item.idUser}
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