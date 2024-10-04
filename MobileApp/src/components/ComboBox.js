import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import ArrowDown from "../../assets/icons/ArrowDown.png";
import { View } from "react-native";
import { TextInput } from "react-native";
import { COLORS } from "../utils/constants";
import { useEffect, useState } from "react";
import RNPickerSelect from 'react-native-picker-select';
export const ComboBox = ({
    label, value, onchangeText = ()=>{}, isGender = true
}) => {
    const [textColor, setTextColor] = useState(COLORS.lightText)
    const [listNations, setNations] = useState([])
    useEffect(()=>{
        const fetchNation = async()=>{
            try{
                const response = await fetch("https://restcountries.com/v3.1/all")
                const data = await response.json()
                const allNations = data.map(item => ({ label: item.name.common, value: item.name.common}))
                setNations(allNations)
            } catch(e){
                console.log("Error fetch API Nation");
            }
        }
        fetchNation()
    }, [])
    const listGender = [
        { label: "Male", value: "Male"},
        { label: "Female", value: "Female"},
        { label: "None", value: "None"},
    ]
    const [listBox, setListBox] = useState(isGender?listGender:listNations)
    useEffect(() => {
        if (!isGender) {
            setListBox(listNations);
        }
    }, [isGender, listNations]);
    const handleOnchangeText = (v)=>{
        onchangeText(v || value)
        if(v !== value)
            setTextColor("black")
    }
    return(
        <View>
            <Text style={styles.input}>{label}</Text>
            <View style={styles.container}>
                <RNPickerSelect
                    items={listBox}
                    onValueChange={(v)=> handleOnchangeText(v)}
                    style={{
                        inputAndroid: {
                            color: textColor
                        }
                    }}
                    value={value}
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
    },
    input:{
        fontSize: 16,
        width: "90%",
    },
    box: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        padding: 16,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopWidth: 0,
        width: "100%",
        maxHeight: 200,
    },
    items: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        paddingVertical: 8
    }
})