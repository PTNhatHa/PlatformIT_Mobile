import { Image, StyleSheet, Text, TextInput, View } from "react-native"
import { COLORS } from "../utils/constants"
import { useState } from "react"

export const TextInputIcon = ({
    value, icon, placeholder, onchangeText, error, keyboardType, isPassword
}) => {
    return(
        <View>
            <View style={styles.containerIcon}>
                {icon}
                {/* <Image source={icon}/> */}
                <TextInput 
                    style={styles.input}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={(v)=>onchangeText(v)}
                    keyboardType={keyboardType || "default"}
                    secureTextEntry={isPassword}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    )
}

export const TextInputLabel = ({
    label, value, placeholder, onchangeText = ()=>{}, keyboardType, isPassword, error
}) => {
    const handleOnchangeText = (v)=>{
        onchangeText(v)
    }
    return(
        <>
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <TextInput 
                    style={[styles.inputLabel]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={(v)=>handleOnchangeText(v)}
                    keyboardType={keyboardType || "default"}
                    multiline={label === "Bio"}
                    editable={label !== "Affiliated Center" && label !== "Email"}
                    secureTextEntry={isPassword}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </>
    )
}

const styles = StyleSheet.create({
    containerIcon: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
    },
    container: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        paddingVertical: 8,
        width: "100%",
        columnGap: 8,
    },
    input:{
        fontSize: 16,
        width: "85%"
    },
    error:{
        color: COLORS.red
    },
    inputLabel:{
        fontSize: 16,
        width: "100%",
        color: "black"
    },
    label: {
        fontSize: 10,
        color: COLORS.stroke
    }
})