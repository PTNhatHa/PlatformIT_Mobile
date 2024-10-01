import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native"
import { COLORS } from '../constants';
import DateIcon from "../../assets/icons/Calendar.png";
import { TouchableOpacity } from 'react-native';

export const DateTimePickerComponent = ({
    label="label"
})=>{
    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)
    const [isChoose, setIsChoose] = useState(false)
    const handleOnChange = (e, selectDate)=>{
        const currentDate = selectDate || date
        setDate(currentDate)
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
                    value={formatDateTime(date)}
                    readOnly
                />
                <TouchableOpacity onPress={()=>setShow(true)}>
                    <Image source={DateIcon} style={{ width: 20, height: 20}}/>
                </TouchableOpacity>
            </View>
            {show &&
                <DateTimePicker 
                    mode="date" 
                    onChange={handleOnChange}
                    value={date} 
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