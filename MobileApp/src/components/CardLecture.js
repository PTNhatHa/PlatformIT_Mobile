import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import { useNavigation } from "@react-navigation/native"
import AntDesign from '@expo/vector-icons/AntDesign';
import { TagRed, TagYellow } from "./Tag";

const initLecture = {
    "idLecture": 0,
    "lectureTitle": "Sample",
    "lectureIntroduction": "Sample",
    "exerciseCount": 1,
    "createdDate": "2024-11-06T13:58:50.7138603+07:00"
  }
export const CardLecture = ({
    data = initLecture, role=0, setSelected = ()=>{}, 
    section, selectObject, isLimitedTime, courseEndDate, idTeacher,
    reload
})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity 
            style={styles.container} key={data.idLecture} 
            onPress={()=>{
                if(role !==0){
                    setSelected(section.idSection, section.sectionName, data.idLecture, data.lectureTitle)
                    if(data.lectureStatus === 2 || data.lectureStatus === 3){
                        navigation.navigate("Update Lecture", {
                            idLecture: data.idLecture,
                            // getCourse: reload,
                            nameSection: section.sectionName,
                            lectureStatus: data.lectureStatus
                        })
                    }else
                    if(!selectObject.idLecture){
                        navigation.navigate("Detail Lecture", {
                            idLecture: data.idLecture,
                            isLimitedTime: isLimitedTime, 
                            courseEndDate: courseEndDate,
                            idTeacher: idTeacher,
                            isFinishedLecture: data.isFinishedLecture
                            // reload: reload
                        })
                    }
                }
            }}
        >
            <View style={styles.wrapFlex}>
                <Text style={[styles.title, selectObject.idLecture === data.idLecture && {color: COLORS.main}]}>
                    {data.lectureTitle}
                </Text>
                {(role === 2 && data.isFinishedLecture) && <AntDesign name="checkcircle" size={16} color={COLORS.main}/>}
            </View>
            {data.lectureIntroduction !== "null" && data.lectureIntroduction !== null &&
                <Text style={styles.body}>{data.lectureIntroduction}</Text>
            }           
            {data.lectureStatus !== 1 ?
                <View style={{alignSelf: "flex-end"}}>
                    {data.lectureStatus === 2 && <TagYellow label={"Pending"}/>}
                    {data.lectureStatus === 3 && <TagRed label={"Reject"}/>}
                </View>
                :
                <>
                    {data.exerciseCount === 1 ?
                        <Text style={styles.exercise}>{data.exerciseCount} exercise</Text>
                        :
                        data.exerciseCount > 1 ? 
                        <Text style={styles.exercise}>{data.exerciseCount} exercises</Text>
                        :
                        ""
                    }
                </>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        columnGap: 10,
        backgroundColor: "white"
    },
    title:{
        fontSize: 18,
        fontWeight: "bold",
    },
    body:{
        fontSize: 12,
        color: COLORS.stroke,
    },
    exercise:{
        fontSize: 12,
        color: COLORS.main,
        fontWeight: "bold",
        alignSelf: "flex-end"
    },
    wrapFlex:{
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    }
})