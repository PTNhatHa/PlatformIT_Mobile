import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import { useState } from "react"

export const CustomSwitch = ({label, value = false, onChangeText=()=>{}})=>{
    return(
        <View style={styles.wrapFlex}>
            <Text style={styles.textGray14}>{label}</Text>
            <TouchableOpacity 
                style={[styles.wrapSwitch, value && {backgroundColor: COLORS.main, alignItems: "flex-end"}]}
                onPress={()=>{
                    onChangeText(!value)
                }}    
            >
                <View style={[styles.innerSwitch]}/>
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapFlex:{
        flexDirection: "row",
        gap: 8,
    },
    textGray14: {
        fontSize: 14,
        color: COLORS.stroke
    },
    wrapSwitch: {
        backgroundColor: COLORS.lightText,
        width: 36,
        height: 20,
        borderRadius: 90,
        justifyContent: "center",
        padding: 2,
    },
    innerSwitch:{
        backgroundColor: COLORS.lightGray,
        width: 16,
        height: 16,
        borderRadius: 90
    },
})