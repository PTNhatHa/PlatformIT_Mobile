import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AssignmentItemAnswerType, COLORS } from "../utils/constants"
import { useEffect, useState } from "react"
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime } from "../utils/utils";
import DateTimePicker from '@react-native-community/datetimepicker';

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
    label, value, placeholder, onchangeText = ()=>{}, editable=true, type="Default", multiline = false
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
                    multiline={multiline}
                    editable={editable}
                    keyboardType={type}
                />
            </View>
        </>
    )
}

export const TextInputSelectBox = ({
    label, value, placeholder, onchangeText = ()=>{}, listSelect=[], index = null, field
}) => {
    const [isOpenBox, setIsOpentBox] = useState(false)
    const [currentList, setCurrentList] = useState(listSelect)
    const [currentValue, setCurrentValue] = useState(value?.label || value)
    useEffect(()=>{
        if (JSON.stringify(currentList) !== JSON.stringify(listSelect)) {
            setCurrentList(listSelect);
        }
    }, [listSelect])

    useEffect(()=>{
        setCurrentValue(value?.label || value)
    }, [value])

    const handleOnchangeText = (v)=>{
        setCurrentValue(v)
        const newList = listSelect.filter(item => item.label.toLowerCase().includes(v.toLowerCase()))
        if (JSON.stringify(newList) !== JSON.stringify(currentList)) {
            setCurrentList(newList);
        }
    }

    return(
        <>
            <View style={styles.containerGray}>
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.inputLabelBox]}>
                    <TextInput 
                        style={styles.inputText}
                        value={index !== null ? AssignmentItemAnswerType[currentValue] : currentValue}
                        onChangeText={(v)=>handleOnchangeText(v)}
                        placeholder={placeholder}
                        onFocus={()=>setIsOpentBox(true)}
                        // onBlur={()=>setIsOpentBox(false)}
                    />
                    <TouchableOpacity onPress={()=>setIsOpentBox(!isOpenBox)}>
                        <AntDesign name="caretdown" size={14} color="black" />
                    </TouchableOpacity>
                </View>
                {isOpenBox &&
                    <View style={styles.wrapList}>
                        <ScrollView >
                            {currentList?.map(item => 
                                <TouchableOpacity key={item?.value} onPress={()=>{
                                    if(index !== null){
                                        onchangeText(item.value, index, field)
                                    } else{
                                        onchangeText(item)
                                    }
                                    setIsOpentBox(false)
                                }}>
                                    <Text style={styles.textListTag}>{item?.label}</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                        <TouchableOpacity onPress={()=>setIsOpentBox(false)} style={styles.wrapClose}>
                            <AntDesign name="close" size={24} color={COLORS.secondMain}/>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </>
    )
}

export const TextInputSelectDate = ({
    label, value, placeholder, onchangeText = ()=>{}, listSelect=[]
}) => {
    const [show, setShow] = useState(false)
    const handleOnChange = (e, selectDate)=>{
        const currentDate = selectDate || value || new Date()
        onchangeText(currentDate)
        setShow(false)
    }
    return(
        <>
            <View style={styles.containerGray}>
                <Text style={styles.label}>{label}</Text>
                <View style={[styles.inputLabelBox]}>
                    <TextInput 
                        style={styles.inputText}
                        value={value ? formatDateTime(new Date(value)) : null}
                        editable={false}
                        placeholder="Select a date"
                    />
                    <TouchableOpacity onPress={()=>setShow(!show)} style={{margin: 4}}>
                        <Feather name="calendar" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                {show &&
                    <DateTimePicker 
                        mode="date" 
                        onChange={handleOnChange}
                        value={value instanceof Date ? new Date(value) : new Date()} 
                        display="default"
                    />
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
        // paddingVertical: 4,
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
        columnGap: 8,
        flex: 1
    },
    inputLabelGray:{
        fontSize: 14,
        width: "100%",
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
    },

    inputLabelBox:{
        fontSize: 16,
        width: "100%",
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        // paddingVertical: 8,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 36
    },
    inputText:{
        width: "90%"
    },
    wrapList:{
        maxHeight: 200,
        position: "absolute",
        backgroundColor: "white",
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: COLORS.lightText,
        alignSelf: "flex-end",
        width: "100%",
        top: 50,
        zIndex: 9999,
    },
    textListTag: {
        margin: 4,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
    },

    wrapClose:{
        justifyContent: 'center', 
        alignItems: 'center'
    }
})