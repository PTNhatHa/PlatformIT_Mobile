import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import { formatDateTime } from "../utils/utils";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const initNoti=  {
    "idNotification": 1,
    "idSender": null,
    "content": "Your qualification: AWS Certification has been approved.",
    "isRead": 0,
    "notificationType": 1,
    "idCourse": null,
    "relativeTime": "2 days ago"
  }
export const CardNoti = ({data = initNoti, isScreen = false, role = 0})=>{
    return(
        <View style={styles.container}>
            {isScreen && <Image style={styles.img} source={{ uri: data.senderAvatar}}/>}
            <View style={{flexDirection: "column", flex: 1}}>
                <Text style={styles.title}>{data.content}</Text>
                <Text style={styles.dataDate}>{data.relativeTime}</Text>
            </View>
            {role === 1 &&
                <TouchableOpacity>
                    <FontAwesome6 name="delete-left" size={24} color={COLORS.red} />
                </TouchableOpacity>
            }
        </View>
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
        // fontWeight: "bold",
        // alignSelf: "flex-end"
    },
    img:{
        width: 50,
        height: 50,
        borderRadius: 90,
        backgroundColor: COLORS.lightText
    }
})