import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../constants"

export const ButtonBlu = ({title, action})=>{
    return(
        <TouchableOpacity style={styles.btn_bl}>
            <Text style={styles.btnText}>{title}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn_bl: {
        backgroundColor: COLORS.secondMain,
        padding: 8,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
    }
})