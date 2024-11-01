import { StyleSheet, Text, View } from "react-native"
import { COLORS } from "../utils/constants"

export const Tag = ({label})=>{
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{label}</Text>
        </View>
    )
}

export const TagNoColor = ({label})=>{
    return(
        <View style={[styles.container, {backgroundColor: COLORS.lightText}]}>
            <Text style={[styles.text, {color: COLORS.stroke}]}>{label}</Text>
        </View>
    )
}

export const TagYellow = ({label})=>{
    return(
        <View style={[styles.container, {backgroundColor: 'rgba(255, 204, 0, 0.3)'}]}>
            <Text style={[styles.text, {color: COLORS.yellow}]}>{label}</Text>
        </View>
    )
}

export const TagRed = ({label})=>{
    return(
        <View style={[styles.container, {backgroundColor: 'rgba(192, 15, 12, 0.3)'}]}>
            <Text style={[styles.text, {color: COLORS.red}]}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: '#B9E7CF',
        alignSelf: "flex-start"
    },
    text:{
        color: COLORS.main,
        fontSize: 10,
    }
})