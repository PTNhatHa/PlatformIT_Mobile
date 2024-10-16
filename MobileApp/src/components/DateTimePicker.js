import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"
import { COLORS } from '../utils/constants';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { formatDateTime } from '../utils/utils';

export const DateTimePickerComponent = ({
    label, value = new Date(), setValue, width="100%"
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
        <View >
            {label ? <Text style={styles.input}>{label}</Text> : ""}
            <View style={[styles.container, {width: width}]}>
                <TextInput 
                    style={[styles.input, {color: isChoose?"black":COLORS.lightText}]}
                    value={formatDateTime(new Date(value))}
                    editable={false}
                />
                <TouchableOpacity onPress={()=>setShow(true)}>
                <Feather name="calendar" size={20} color={isChoose?"black":COLORS.lightText} />
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
    )
}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        paddingHorizontal: 16,
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
        justifyContent: "space-between",
        height: 40
    },
    input:{
        fontSize: 16,
    },
    error:{
        color: "#C00F0C"
    },
})