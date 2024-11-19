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
export const CardLecture = ({data = initLecture, role=0})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity 
            style={styles.container} key={data.idLecture} 
            onPress={()=> role !==0 ? navigation.navigate("Detail Lecture", {idLecture: data.idLecture}) : {}}
        >
            <Text style={styles.title}>{data.lectureTitle}</Text>
            {data.lectureIntroduction !== "null" && 
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