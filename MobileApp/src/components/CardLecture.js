import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { COLORS } from "../utils/constants"

const initLecture = {
    title: "Title",
    introduction: "introduction",
    exercise: 3
}
export const CardLecture = ({data = initLecture})=>{
    return(
        <TouchableOpacity style={styles.container}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.body}>{data.introduction}</Text>
            {data.exercise === 1 ?
                <Text style={styles.exercise}>{data.exercise} exercise</Text>
                :
                data.exercise > 1 ? 
                <Text style={styles.exercise}>{data.exercise} exercises</Text>
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