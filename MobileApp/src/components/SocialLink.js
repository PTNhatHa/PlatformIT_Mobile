import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import { useState} from "react"
import AntDesign from '@expo/vector-icons/AntDesign';

const iniSocial = [
    { id: 1, title: "Github", link: "aaaaaaa"},
    { id: 2, title: "Facebook", link: "bbbbbb"},
]
export const SocialLink = ({
    list = iniSocial, setList=()=>{}
}) => {
    const [textColor, setTextColor] = useState(COLORS.lightText)
    // const [list, setList] = useState(listSocial)
    const handleOnchangeText = (id, value, title)=>{
        const newList = list.map((item)=>{
            if(item.id === id && title === "title"){
                return{
                    ...item,
                    title: value,
                }
            }
            if(item.id === id && title === "link"){
                return{
                    ...item,
                    link: value,
                }
            }
            return item
        })
        setList(newList)
        setTextColor("black")
    }
    const handleDelete = (id)=>{
        const newList = list.filter((item)=> item.id !== id)
        setList(newList)
    }
    const handleAddNew = ()=>{
        const maxId = Math.max(...list.map(item => item.id), 0)
        const newList = [...list, { id: maxId + 1}]
        setList(newList)
    }
    return(
        <View>
            <Text style={styles.label}>Social/Professional Profile Links</Text>
            {list.map((item)=>
                <View style={styles.container} key={item.id}>
                    <TextInput 
                        style={[styles.title, {color: textColor}]}
                        value={item.title}
                        placeholder={"Title"}
                        onChangeText={(v)=>handleOnchangeText(item.id, v, "title")}
                    />
                    <TextInput 
                        style={[styles.link, {color: textColor}]}
                        value={item.link}
                        placeholder={"Link"}
                        onChangeText={(v)=>handleOnchangeText(item.id, v, "link")}
                    />
                    <TouchableOpacity onPress={()=>handleDelete(item.id)}>
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
        paddingHorizontal: 16,
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