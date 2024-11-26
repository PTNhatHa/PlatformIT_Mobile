import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"

export const RadioBtn =({label, selected = false, onPress=()=>{}})=>{
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.circle}>
                {selected ? <View style={styles.circleSelected}/> : ""}
            </View>
            {label &&
                <Text style={styles.label}>{label}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        columnGap: 4,
        alignItems: "center"
    },
    circle: {
        borderWidth: 2,
        width: 20,
        height: 20,
        borderRadius: 90,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
        margin: 2
    },
    circleSelected: {
        width: 12,
        height: 12,
        borderRadius: 90,
        backgroundColor: COLORS.secondMain,
    },
    label: {
        fontSize: 16,
        color: COLORS.stroke
    }
})