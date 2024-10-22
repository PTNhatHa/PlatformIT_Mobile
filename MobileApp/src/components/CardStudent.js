import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime } from "../utils/utils";

const initStudent={
    avatar: "",
    fullname: "NhatHa", 
    email: "nhatha@gmail.com",
    attended: new Date()
}
export const CardStudentAttendance = ({data = initStudent})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Attendance")}>
            <Image source={data.img} style={styles.avata}/>
            <View>
                <Text style={styles.title}>{data.fullname}</Text>
                <View style={styles.content}>
                    <Feather name="mail" size={14} color={COLORS.stroke} />
                    <Text style={styles.dataText}>{data.email}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.dataText}>Attended on: {formatDateTime(data.attended)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        flexDirection: "row",
        columnGap: 10,
        backgroundColor: "white"
    },
    title:{
        fontSize: 16,
        fontWeight: "bold"
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2, 
        minHeight: 13
    },
    dataText: {
        fontSize: 12,
        color: COLORS.stroke
    },
    avata: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 50,
        height: 50,
        backgroundColor: COLORS.lightText
    },
})