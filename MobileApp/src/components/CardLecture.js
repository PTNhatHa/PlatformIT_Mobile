import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { COLORS } from "../utils/constants"
import { useNavigation } from "@react-navigation/native"

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
    // console.log(selectObject);
    return(
        <TouchableOpacity 
            style={styles.container} key={data.idLecture} 
            onPress={()=>{
                if(role !==0){
                    setSelected(section.idSection, section.sectionName, data.idLecture, data.lectureTitle)
                    if(!selectObject.idLecture){
                        navigation.navigate("Detail Lecture", {
                            idLecture: data.idLecture,
                            isLimitedTime: isLimitedTime, 
                            courseEndDate: courseEndDate,
                            idTeacher: idTeacher,
                            reload: reload
                        })
                    }
                }
            }}
        >
            <Text style={[styles.title, selectObject.idLecture === data.idLecture && {color: COLORS.main}]}>{data.lectureTitle}</Text>
            {data.lectureIntroduction !== "null" && data.lectureIntroduction !== null &&
                <Text style={styles.body}>{data.lectureIntroduction}</Text>
            }           
            {data.exerciseCount === 1 ?
                <Text style={styles.exercise}>{data.exerciseCount} exercise</Text>
                :
                data.exerciseCount > 1 ? 
                <Text style={styles.exercise}>{data.exerciseCount} exercises</Text>
                :
                ""
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
        fontWeight: "bold"
    },
    body:{
        fontSize: 12,
        color: COLORS.stroke
    },
    exercise:{
        fontSize: 12,
        color: COLORS.main,
        fontWeight: "bold",
        alignSelf: "flex-end"
    }
})