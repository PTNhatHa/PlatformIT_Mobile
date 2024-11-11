import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"

export const ButtonBlu = ({title, action, fontSize})=>{
    return(
        <TouchableOpacity style={styles.btn_bl} onPress={action}>
            <Text style={[styles.btnText, { fontSize: fontSize || 16 }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export const ButtonWhite = ({title, action, fontSize})=>{
    return(
        <TouchableOpacity style={styles.btn_wh} onPress={action}>
            <Text style={[styles.btnTextWhite, { fontSize: fontSize || 16 }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export const ButtonGreen = ({title, action, fontSize})=>{
    return(
        <TouchableOpacity style={styles.btn_green} onPress={action}>
            <Text style={[styles.btnText, { fontSize: fontSize || 16 }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export const ButtonIcon = ({title, action, fontSize, icon})=>{
    return(
        <TouchableOpacity style={styles.btn_icon} onPress={action}>
            {icon}
            <Text style={[styles.btnTextWhite, { fontSize: fontSize || 12 }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export const ButtonIconLightGreen = ({title, action, fontSize, icon})=>{
    return(
        <TouchableOpacity style={[styles.btn_icon, {backgroundColor: COLORS.main30, borderWidth: 0,}]} onPress={action}>
            {icon}
            <Text style={[styles.btnTextWhite, { fontSize: fontSize || 12 }]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn_bl: {
        backgroundColor: COLORS.secondMain,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    btn_wh: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.main,
        alignSelf: "flex-start"
    },
    btn_green: {
        backgroundColor: COLORS.main,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.main,
        alignSelf: "flex-start"
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
    },
    btnTextWhite: {
        color: COLORS.main,
        fontWeight: "bold",
    },
    btn_icon: {
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.main,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4
    },
})