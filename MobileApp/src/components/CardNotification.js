import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime } from "../utils/utils";

const initNoti={
    title: "Notification 1",
    body: "body",
    onDate: new Date(),
}
export const CardNoti = ({data = initNoti})=>{
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.dataText}>{data.body}</Text>
            <Text style={styles.dataDate}>{formatDateTime(data.onDate)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        flexDirection: "column",
        columnGap: 10,
        backgroundColor: "white",
    },
    title:{
        fontSize: 16,
        fontWeight: "bold"
    },
    dataText: {
        fontSize: 12,
        color: COLORS.stroke
    },
    dataDate: {
        fontSize: 12,
        color: COLORS.main,
        fontWeight: "bold",
        alignSelf: "flex-end"
    },
})