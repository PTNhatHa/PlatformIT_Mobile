import { useState } from "react"
import { Alert, FlatList, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tag, TagYellow } from "./Tag";
import * as DocumentPicker from 'expo-document-picker';
import { determineFileType } from "../utils/utils";
import { ButtonGreen, ButtonIconLightGreen, ButtonWhite } from "./Button";
import { addQualification, deleteQualification } from "../services/user";
import { useUser } from "../contexts/UserContext";

const initProfessions = [
    {
        "idQualification": 1,
        "path": "",
        "qualificationName": null,
        "description": null,
        "status": 2
    }

]

export const Professional = ({
    value=initProfessions
}) => {
    const {state, dispatch} = useUser()
    const [professions, setProfess] = useState(value || [])
    const [selectImg, setSelectImg] = useState("")
    const [textColor, setTextColor] = useState(COLORS.lightText)

    const handleAddNew = ()=>{
        let idMax = 0
        if(professions){
            idMax = Math.max(...professions.map(item => item.idQualification), 0)
        }
        const newProfessions = [...professions, { 
            idQualification: idMax + 1 , 
            qualificationName: "",
            description: "",
            path: "",
            isNew: true,
        }]
        setProfess(newProfessions)
    }
    const handleDelete = (select)=>{
        const newProfessions = professions.map((item)=>{
            if(item.idQualification === select){
                return{
                    ...item,
                    delete: true
                }
            }
            return item
        })
        setProfess(newProfessions)
    }
    const handleSelectImg = (select)=>{
        setSelectImg(select)
    }
    const handleChangeData = (idQualification, value, key)=>{
        setTextColor("black")
        const newProfessions = professions.map((item)=>{
            if(item.idQualification === idQualification && key === "qualificationName"){
                return{
                    ...item,
                    qualificationName: value,
                }
            }
            if(item.idQualification === idQualification && key === "description"){
                return{
                    ...item,
                    description: value,
                }
            }
            return item
        })
        setProfess(newProfessions)
    }
    const pickFile = async(itemId)=>{
        try{
            let result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
            })
            if(result){
                const newList = professions.map((item)=>{
                    if(item.idQualification  === itemId){
                        return{
                            ...item,
                            path: result.assets[0],
                        }
                    }
                    return item
                })
                setProfess(newList)
            }
        }
        catch(error){
            console.log("==>Error picking file: ", error);
        }
    }
    const openPdf = async(uri)=>{
        try{
            await Linking.openURL(uri)
        }
        catch(e){
            console.log("==>Error opening pdf: ", e);
        }
    }
    const handleSave = async ()=>{
        try {
            // Add
            const dataAdd = professions.filter(item => item.isNew)
            await Promise.all(dataAdd.map( async (item)=>{
                try{
                    const response = await addQualification(state.idUser, item.qualificationName, item.description, item.path)
                    if(response.error){
                        Alert.alert("Warning", response.data)
                    }else{
                        Alert.alert("Noti", "Add professionals done ^3^")
                    }
                } catch(e){
                    console.log("Error add professionals: ", e);
                }
            }))
            console.log(dataAdd);
            // Delete
            const dataDelete = professions.filter(item => item.delete === true && item.new !== true)
            await Promise.all(dataDelete.map( async (item)=>{
                try{
                    const response = await deleteQualification(item.idQualification)
                    if(response.error){
                        Alert.alert("Warning", response.data)
                    }else{
                        Alert.alert("Noti", "Delete professionals done ^3^")
                    }
                } catch(e){
                    console.log("Error delete professionals: ", e);
                }
            })) 
        } catch (error) {
            
        }
    }
    return(
        <View style={styles.wrapContainer}>
            <Text style={[commonStyles.title]}>Professional Qualifications</Text>
            <ButtonIconLightGreen title={"Add"} icon={<AntDesign name="plus" size={14} color={COLORS.main} />} action={()=>handleAddNew()}/>
            <View style={{rowGap: 10, paddingTop: 10}}>
                {professions ? 
                professions.map((item)=> !item.delete ?
                <View style={styles.container} key={item.idQualification}>
                    {item.status === 2 ? 
                        <TagYellow label={"Pending"}/>
                        :
                        !item.isNew ? 
                        <Tag label={"Approved"}/> : ""
                    }
                    <TextInput 
                        style={[styles.input, {color: textColor}]}
                        value={item.qualificationName}
                        placeholder={"*Title"}
                        placeholderTextColor={COLORS.red}
                        onChangeText={(v)=>handleChangeData(item.idQualification, v, "qualificationName")}
                        editable={item.new === true}
                    />
                    <TextInput 
                        style={[styles.input, {color: textColor}]}
                        value={item.description}
                        placeholder={"*Desciption"}
                        placeholderTextColor={COLORS.red}
                        onChangeText={(v)=>handleChangeData(item.idQualification, v, "description")}
                        editable={item.new === true}
                    />
                    <View style={styles.wrap}>
                        <View style={styles.wrapbtn}>
                            {item.isNew ? 
                                <TouchableOpacity style={styles.btn} onPress={() => pickFile(item.idQualification)}>
                                    <AntDesign name="file1" size={20} color={COLORS.stroke} />
                                </TouchableOpacity>
                                : ""  
                            }
                            <TouchableOpacity style={styles.btn} onPress={()=>handleDelete(item.idQualification)}>
                                <AntDesign name="delete" size={20} color={COLORS.stroke} />
                            </TouchableOpacity>
                        </View> 
                        { item.isNew ? 
                                determineFileType(item.path.uri) === "Image" ?
                                <TouchableOpacity onPress={()=>handleSelectImg(item.path.uri)}>
                                    <Image 
                                        source={{uri: item.path.uri}}
                                        style={styles.image}
                                    />
                                </TouchableOpacity> 
                                : 
                                determineFileType(item.path.uri) === "Pdf" ?
                                <TouchableOpacity onPress={()=>openPdf(item.path.uri)}>
                                    <Text style={styles.pdf}>Open pdf</Text>
                                </TouchableOpacity>
                                :""
                            : 
                                determineFileType(item.path) === "Image" ?
                                <TouchableOpacity onPress={()=>handleSelectImg(item.path)}>
                                    <Image 
                                        source={{uri: item.path}}
                                        style={styles.image}
                                    />
                                </TouchableOpacity> 
                                : 
                                determineFileType(item.path) === "Pdf" ?
                                <TouchableOpacity onPress={()=>openPdf(item.path)}>
                                    <Text style={styles.pdf}>Open pdf</Text>
                                </TouchableOpacity>
                                :"" 
                        }
                         
                    </View>
                </View>
                :""): ""}
                <View style={styles.bottom}>
                    <ButtonWhite title={"Discard Changes"} action={()=>setProfess(value)}/>
                    <ButtonGreen title={"Save Changes"} action={handleSave}/>
                </View>
            </View>
            <Modal
                visible={!!selectImg}
                transparent={true}
                animationType="fade"
                onRequestClose={()=>setSelectImg("")}
            >
                <View style={styles.selectImgWrapper}>
                    <TouchableOpacity style={styles.close} onPress={()=>setSelectImg("")}>
                        <AntDesign name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <Image source={{uri: selectImg}} style={styles.selectImg}/>
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapContainer: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8
    },
    container: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: "column",
        columnGap: 8,
        rowGap: 10,
        
    },
    input:{
        fontSize: 16,
        width: "100%",
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
    },
    wrap:{
        flexDirection: "row",
        justifyContent: "space-between"
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
        width: 200,
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
    pdf:{
        color: COLORS.main,
        fontStyle: "italic",
        fontWeight: "bold"
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
})