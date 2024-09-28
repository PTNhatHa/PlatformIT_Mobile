import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../constants"

export const ButtonBlu = ({title, action, fontSize})=>{
    return(
        <TouchableOpacity style={styles.btn_bl} onPress={action}>
            <Text style={[styles.btnText, { fontSize: fontSize || 16 }]}>{title}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    btn_bl: {
        backgroundColor: COLORS.secondMain,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
    }
})