import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import { useState} from "react"
import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';

const iniSocial = [
    { idProfileLink: 1, name: "Github", url: "aaaaaaa"},
    { idProfileLink: 2, name: "Facebook", url: "bbbbbb"},
]
export const SocialLink = ({
    value = iniSocial, setValue=()=>{}
}) => {
    const [textColor, setTextColor] = useState(COLORS.lightText)
    const [list, setList] = useState(value)
    const handleOnchangeText = (idProfileLink, value, name)=>{
        const newList = list.map((item)=>{
            if(item.idProfileLink === idProfileLink && name === "name"){
                return{
                    ...item,
                    name: value,
                }
            }
            if(item.idProfileLink === idProfileLink && name === "url"){
                return{
                    ...item,
                    url: value,
                }
            }
            return item
        })
        setList(newList)
        setValue(newList)
        setTextColor("black")
    }
    const handleDelete = (idProfileLink)=>{
        const newList = list.filter((item)=> item.idProfileLink !== idProfileLink)
        setList(newList)
        setValue(newList)
    }
    const handleAddNew = ()=>{
        const maxId = Math.max(...list.map(item => item.idProfileLink), 0)
        const newList = [...list, { idProfileLink: maxId + 1, name: "", url: "", isNew: true}]
        setList(newList)
        setValue(newList)
    }
    const listTitle = [
        { label: "Github", value: "Github"},
        { label: "LinkedIn", value: "LinkedIn"},
        { label: "Youtube", value: "Youtube"},
        { label: "Facebook", value: "Facebook"},
        { label: "Portfolio", value: "Portfolio"},
    ]
    return(
        <View>
            <Text style={styles.label}>Social/Professional Profile Links</Text>
            {list.map((item)=>
                <View style={styles.container} key={item.idProfileLink}>
                    <View style={styles.title}>
                        <RNPickerSelect
                            items={listTitle}
                            onValueChange={(v)=>handleOnchangeText(item.idProfileLink, v, "name")}
                            style={{
                                inputAndroid: {
                                    color: textColor,
                                }
                            }}
                            value={item.name}
                            useNativeAndroidPickerStyle={false}
                            disabled={item.isNew !== true}
                        />
                    </View>
                    <TextInput 
                        style={[styles.link, {color: textColor}]}
                        value={item.url}
                        placeholder={"url"}
                        onChangeText={(v)=>handleOnchangeText(item.idProfileLink, v, "url")}
                        editable={item.isNew === true}
                    />
                    <TouchableOpacity onPress={()=>handleDelete(item.idProfileLink)}>
                        <AntDesign name="delete" size={20} color={COLORS.stroke} />
                    </TouchableOpacity>
                </View>
                    
            )}
            
            <TouchableOpacity style={styles.btn} onPress={()=>handleAddNew()}>
                <AntDesign name="plus" size={20} color={COLORS.stroke} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: "row",
        columnGap: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    label:{
        fontSize: 16,
        width: "85%"
    },
    link:{
        fontSize: 16,
        width: "55%",
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 16,
        width: "30%",
        borderRightWidth: 1,
        borderColor: COLORS.lightText,
    },
    btn:{
        padding: 12,
        borderRadius: 90,
        borderWidth: 1,
        alignSelf: "flex-start",
        borderColor: COLORS.lightText,
    },
})