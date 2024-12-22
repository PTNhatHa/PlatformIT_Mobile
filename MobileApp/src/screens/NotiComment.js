import { StyleSheet, View } from "react-native"
import { Comments } from "../components/Comments"

export const NotiComment = ()=>{

    return(
        <View style={styles.container}>
            <Comments idLecture={1} idTeacher={4}/>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        margin: 16,
        flex: 1
    }
})