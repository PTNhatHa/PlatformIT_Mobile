import { StyleSheet, Text, View } from "react-native"
import { COLORS } from "../utils/constants"

export const Tag = ({label})=>{
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(20, 174, 92, 0.3)',
        alignSelf: "flex-start"
    },
    text:{
        color: COLORS.main,
        fontSize: 10,
    }
})