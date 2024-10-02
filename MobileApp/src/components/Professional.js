import { useState } from "react"
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS } from "../constants"
import AntDesign from '@expo/vector-icons/AntDesign';

const initProfessions = [
    {
        id: 1,
        title: "aaa",
        description: "aaaaaaaaaa",
        image: "https://i.pinimg.com/originals/13/5d/7c/135d7c70b6eba155a057046f41b3501e.jpg"
    },
    {
        id: 2,
        title: "bbb",
        description: "bbbbbbbb",
        image: "https://i.pinimg.com/originals/6b/b0/72/6bb0727d93aaa98defc3f0d2364eb4df.jpg"
    },
]

export const Professional = ({
    label, value
}) => {
    const [professions, setProfessions] = useState(initProfessions)
    const [selectImg, setSelectImg] = useState("")
    const [textColor, setTextColor] = useState(COLORS.lightText)
    const handleOnchangeText = (v)=>{
        onchangeText(v)
        setTextColor("black")
    }
    const handleAddNew = ()=>{
        const idMax = Math.max(...professions.map(item => item.id), 0)
        const newProfessions = [...professions, { id: idMax + 1 }]
        setProfessions(newProfessions)
    }
    const handleDelete = (select)=>{
        const newProfessions = professions.filter(item => item.id !== select)
        setProfessions(newProfessions)
    }
    const handleSelectImg = (select)=>{
        setSelectImg(select)
    }
    return(
        <View>
            <ScrollView contentContainerStyle={{rowGap: 10}}>
                <Text>{label}</Text>
                {professions.map((item)=>
                <View style={styles.container} key={item.id}>
                    <TextInput 
                        style={[styles.input, {color: textColor}]}
                        value={item.title}
                        placeholder={"Title"}
                        onChangeText={(v)=>handleOnchangeText(v)}
                    />
                    <TextInput 
                        style={[styles.input, {color: textColor}]}
                        value={item.description}
                        placeholder={"Desciption"}
                        onChangeText={(v)=>handleOnchangeText(v)}
                    />
                    <View style={styles.wrapbtn}>
                        <TouchableOpacity style={styles.btn}>
                            <AntDesign name="file1" size={20} color={COLORS.stroke} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn} onPress={()=>handleDelete(item.id)}>
                            <AntDesign name="delete" size={20} color={COLORS.stroke} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleSelectImg(item.image)}>
                            <Image 
                                source={{uri: item.image}}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                )}
                <TouchableOpacity style={styles.btn} onPress={handleAddNew}>
                    <AntDesign name="plus" size={20} color={COLORS.stroke} />
                </TouchableOpacity>
            </ScrollView>
            {selectImg &&
                <View style={styles.selectImgWrapper}>
                    <TouchableOpacity style={styles.close} onPress={()=>setSelectImg("")}>
                        <AntDesign name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <Image source={{uri: selectImg}} style={styles.selectImg}/>
                </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: "column",
        columnGap: 8,
        rowGap: 10
    },
    input:{
        fontSize: 16,
        width: "100%",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
    },
    wrapbtn:{
        flexDirection: "row",
        columnGap: 10
    },
    btn:{
        padding: 12,
        borderRadius: 90,
        borderWidth: 1,
        alignSelf: "flex-start",
        borderColor: COLORS.lightText
    },
    image: {
        width: 245,
        height: 200,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
    },
    selectImgWrapper: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16
    },
    close:{
        alignSelf: "flex-end"
    },
    selectImg: {
        flex: 1,
        resizeMode: "contain",
    },
})