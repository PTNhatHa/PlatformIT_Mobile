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
                const response = await fetch("https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code&fbclid=IwY2xjawFwM6NleHRuA2FlbQIxMAABHW2K_vJUQRhGVQK2riWrcOBB7qbVU4hzIacUboX7epq6YvAcDw7oT02eVg_aem_YuZo8uFthUzAKAdLVN0y3w")
                const data = await response.json()
                const allNations = data.countries
                    .map(item => ({ label: item.label, value: item.value}))
                    .sort((a,b) => a.label.localeCompare(b.label))
                setNations(allNations)
            } catch(e){
                console.log("Error fetch API Nation");
            }
        }
        fetchNation()
    }, [])
    const listGender = [
        { label: "Male", value: 0},
        { label: "Female", value: 1},
        { label: "Other", value: 2},
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