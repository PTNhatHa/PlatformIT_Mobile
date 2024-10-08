import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"
import { COLORS } from '../constants';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from 'react-native';

export const DateTimePickerComponent = ({
    label="label", value, setValue
})=>{
    const [show, setShow] = useState(false)
    const [isChoose, setIsChoose] = useState(false)
    const handleOnChange = (e, selectDate)=>{
        const currentDate = selectDate || value
        setValue(currentDate)
        setShow(false)
        setIsChoose(true)
    }
    const formatDateTime = (date) => {
        // Định dạng ngày theo chuẩn của Mỹ
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date ? date.toLocaleDateString('en-US', options) : '';
    };
    return(
        <View >
            <Text style={styles.input}>{label}</Text>
            <View style={styles.container}>
                <TextInput 
                    style={[styles.input, {color: isChoose?"black":COLORS.lightText}]}
                    value={formatDateTime(value)}
                    readOnly
                />
                <TouchableOpacity onPress={()=>setShow(true)}>
                <Feather name="calendar" size={24} color={isChoose?"black":COLORS.lightText} />
                </TouchableOpacity>
            </View>
            {show &&
                <DateTimePicker 
                    mode="date" 
                    onChange={handleOnChange}
                    value={value} 
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
        paddingVertical: 8,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center"
    },
    input:{
        fontSize: 16,
        width: "90%",
    },
    error:{
        color: "#C00F0C"
    },
})