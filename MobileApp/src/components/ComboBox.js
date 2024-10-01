import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import ArrowDown from "../../assets/icons/ArrowDown.png";
import { View } from "react-native";
import { TextInput } from "react-native";
import { COLORS } from "../constants";
import { useEffect, useState } from "react";

export const ComboBox = ({
    label, value, onchangeText = ()=>{}, isGender = true
}) => {
    const [show, setShow] = useState(false)
    const [textColor, setTextColor] = useState(COLORS.lightText)
    const [listNations, setNations] = useState([])
    useEffect(()=>{
        const fetchNation = async()=>{
            try{
                const response = await fetch("https://restcountries.com/v3.1/all")
                const data = await response.json()
                const allNations = data.map(item => item.name.common)
                setNations(allNations)
            } catch(e){
                console.log("Error fetch API Nation");
            }
        }
        fetchNation()
    }, [])
    const listGender = ["Male", "Female", "None"]
    const [listBox, setListBox] = useState(isGender?listGender:listNations)
    useEffect(() => {
        if (!isGender) {
            setListBox(listNations);
        }
    }, [isGender, listNations]);
    const handleOnchangeText = (v)=>{
        onchangeText(v)
        setTextColor("black")
        setShow(false)
    }
    return(
        <View>
            <Text style={styles.input}>{label}</Text>
            <View style={styles.container}>
                <TextInput 
                    style={[styles.input, {color: textColor}]}
                    value={value}
                    readOnly
                />
                <TouchableOpacity onPress={()=>setShow(!show)}>
                    <Image source={ArrowDown} style={{ width: 20, height: 20, transform: show?[{ rotate: '180deg' }] : [{ rotate: '0deg' }]}}/>
                </TouchableOpacity>
            </View>
            {show &&
                <FlatList
                    style={styles.box}
                    data={listBox}
                    keyExtractor={(item, index)=> index.toString()}
                    renderItem={({item})=>
                        <TouchableOpacity onPress={()=>handleOnchangeText(item)}>
                            <View style={styles.items}>
                                <Text>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    }
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