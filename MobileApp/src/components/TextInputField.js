import { Image, StyleSheet, Text, TextInput, View } from "react-native"
import { COLORS } from "../utils/constants"
import { useState } from "react"

export const TextInputIcon = ({
    value, icon, placeholder, onchangeText, error, keyboardType, isPassword
}) => {
    return(
        <View>
            <View style={styles.container}>
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
    label, value, placeholder, onchangeText = ()=>{}, keyboardType
}) => {
    const [textColor, setTextColor] = useState(COLORS.lightText)
    const handleOnchangeText = (v)=>{
        onchangeText(v)
        setTextColor("black")
    }
    return(
        <View>
            <Text style={styles.input}>{label}</Text>
            <View style={styles.container}>
                <TextInput 
                    style={[styles.inputLabel, {color: textColor}]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={(v)=>handleOnchangeText(v)}
                    keyboardType={keyboardType || "default"}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: "100%",
        flexDirection: "row",
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
        width: "100%"
    },
})