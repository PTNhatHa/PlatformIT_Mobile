import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"
import { COLORS } from '../utils/constants';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { formatDateTime } from '../utils/utils';

export const DateTimePickerComponent = ({
    label, value , setValue
})=>{
    const [show, setShow] = useState(false)
    const [isChoose, setIsChoose] = useState(false)
    const handleOnChange = (e, selectDate)=>{
        const currentDate = selectDate || value || new Date()
        setValue(currentDate)
        setShow(false)
        setIsChoose(true)
    }
    return(
        <>
            <View style={styles.container}>
                {label ? <Text style={styles.label}>{label}</Text> : ""}
                <View style={styles.wrapField}>
                    <TextInput 
                        style={styles.input}
                        value={value ? formatDateTime(new Date(value)) : null}
                        editable={false}
                        placeholder='Pick a date'
                    />
                    <TouchableOpacity onPress={()=>setShow(true)}>
                        <Feather name="calendar" size={20} color={isChoose?"black":COLORS.lightText} />
                    </TouchableOpacity>
                </View>
            </View>
            {show &&
                <DateTimePicker 
                    mode="date" 
                    onChange={handleOnChange}
                    value={value instanceof Date ? new Date(value) : new Date()} 
                    display="default"
                />
            }
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        // paddingVertical: 8,
        // minWidth: 130,
    },
    input:{
        fontSize: 16,
        color: "black",
        flex: 1
    },
    error:{
        color: "#C00F0C"
    },
    label: {
        fontSize: 10,
        color: COLORS.stroke
    },
    wrapField: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})