import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import { useState } from "react"
import AntDesign from '@expo/vector-icons/AntDesign';
export const TextInputIcon = ({
    value, icon, placeholder, onchangeText, error, keyboardType, isPassword, isMultiline = false
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
                    multiline={isMultiline}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    )
}

export const TextInputLabel = ({
    label, value, placeholder, onchangeText = ()=>{}, keyboardType, isPassword, error, isEditable = true
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
                    multiline={label === "Bio" || label === "Content"}
                    editable={label !== "Affiliated Center" && label !== "Email" && isEditable}
                    secureTextEntry={isPassword}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </>
    )
}

export const TextInputLabelGray = ({
    label, value, placeholder, onchangeText = ()=>{}, editable=true
}) => {
    const handleOnchangeText = (v)=>{
        onchangeText(v)
    }
    return(
        <>
            <View style={styles.containerGray}>
                <Text style={styles.label}>{label}</Text>
                <TextInput 
                    style={[styles.inputLabelGray]}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={(v)=>handleOnchangeText(v)}
                    multiline={label === "Introduction"}
                    editable={editable}
                />
            </View>
        </>
    )
}

export const TextInputSelectBox = ({
    label, value, placeholder, onchangeText = ()=>{}, listSelect=[]
}) => {
    const [isOpenBox, setIsOpentBox] = useState(false)
    const handleOnchangeText = (v)=>{
        onchangeText(v)
    }
    return(
        <>
            <View style={styles.containerGray}>
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.inputLabelBox]}>
                    <TextInput 
                        style={styles.inputText}
                        value={value}
                        onChangeText={(v)=>handleOnchangeText(v)}
                        placeholder={placeholder}
                        onFocus={()=>setIsOpentBox(true)}
                        onBlur={()=>setIsOpentBox(false)}
                    />
                    <TouchableOpacity onPress={()=>setIsOpentBox(!isOpenBox)} style={{margin: 4}}>
                        <AntDesign name="caretdown" size={18} color="black" />
                    </TouchableOpacity>
                </View>
                {isOpenBox &&
                    <ScrollView style={styles.wrapList}>
                        {listSelect?.map((item, index) => 
                            <TouchableOpacity key={index}>
                                <Text style={styles.textListTag}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    containerIcon: {
        borderRadius: 4,
        paddingHorizontal: 16,
        // paddingVertical: 4,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
        backgroundColor: COLORS.lightGray,
        alignItems: "center"
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
        width: "85%",
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
    },

    containerGray: {
        width: "100%",
        columnGap: 8,
    },
    inputLabelGray:{
        fontSize: 16,
        width: "100%",
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4
    },

    inputLabelBox:{
        fontSize: 16,
        width: "100%",
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    inputText:{
        width: "90%"
    },
    wrapList:{
        height: 200,
        position: "absolute",
        backgroundColor: "white",
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: COLORS.lightText,
        alignSelf: "flex-end",
        width: "100%",
        top: 50,
        zIndex: 1
    },
    textListTag: {
        margin: 4,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
    }
})