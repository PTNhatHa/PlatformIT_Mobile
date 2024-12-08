import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime, formatTime } from "../utils/utils";
import DefaultAva from "../../assets/images/DefaultAva.png"
import { Tag } from "./Tag";

const initStudent={
    idUser: 1,
    avatar: "",
    fullname: "NhatHa", 
    email: "nhatha@gmail.com",
    attended: new Date(),
    learned: 7,
    lectures: 12,
    doneAsgm: 4,
    assignment: 10
}
export const CardStudentAttendance = ({data = initStudent})=>{
    const navigation = useNavigation()
    const progressLecture = data.learned/data.lectures*100 + "%"
    const progressAsgm = data.doneAsgm/data.assignment*100 + "%"
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Attendance")}>
            <Image source={data.img || DefaultAva} style={styles.avata}/>
            <View>
                <Text style={styles.title}>{data.fullname}</Text>
                <View style={styles.content}>
                    <Feather name="mail" size={14} color={COLORS.stroke} />
                    <Text style={styles.dataText}>{data.email}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.dataText, {width: 80}]}>Lectures</Text>
                    <View style={styles.wrapProgress}>
                        <View style={[styles.fullProgress, {width: progressLecture}]}/>
                    </View>
                    <Text style={[styles.dataText, { width: 40, textAlign: "right"}]}>{data.learned}/{data.lectures}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.dataText, {width: 80}]}>Assignments</Text>
                    <View style={styles.wrapProgress}>
                        <View style={[styles.fullProgress, {width: progressAsgm}]}/>
                    </View>
                    <Text style={[styles.dataText, { width: 40, textAlign: "right"}]}>{data.doneAsgm}/{data.assignment}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}
export const CardStudentDetailAsgm = ({data = initStudent})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Attendance")}>
            <Image source={data.img || DefaultAva} style={styles.avata}/>
            <View style={styles.wrapFull}>
                <Text style={styles.title}>{data.fullname}</Text>
                {true &&
                    <View style={styles.content}>                    
                        <Text style={styles.dataText}>Submitted on: </Text>
                        <Text style={styles.dataText}>{formatDateTime(new Date(), true)}</Text>
                    </View>
                }
                {true &&
                    <View style={styles.content}>                    
                        <Text style={styles.dataText}>Duration: </Text>
                        <Text style={styles.dataText}>{formatTime(1234)}</Text>
                    </View>
                }
                {true &&
                    <View style={styles.content}>                    
                        <Text style={styles.dataText}>Mark: </Text>
                        <Text style={styles.dataText}>{`25`}</Text>
                    </View>
                }
                {false ?
                    <View style={[styles.wrapTag, styles.bgGreen]}>
                        <Text style={styles.textTag}>Submited</Text>
                    </View>
                    :
                    <View style={[styles.wrapTag, styles.bgYellow]}>
                        <Text style={styles.textTag}>Late</Text>
                    </View>
                }
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
        backgroundColor: "white",
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
    wrapProgress: {
        borderRadius: 90,
        overflow: "hidden",
        width: 150,
        backgroundColor: COLORS.lightText
    },
    fullProgress: {
        borderRadius: 90,
        height: 8,
        backgroundColor: COLORS.secondMain
    },
    wrapTag:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
        alignSelf: "flex-end"
    },
    textTag:{
        color: "white",
        fontSize: 10,
        fontWeight: "bold"
    },
    bgGreen:{
        backgroundColor: COLORS.green,
    },
    bgYellow:{
        backgroundColor: COLORS.yellow,
    },
    wrapFull:{
        flex: 1
    }
})