import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, BackHandler, FlatList, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Tag, TagRed, TagYellow } from "./Tag";
import * as DocumentPicker from 'expo-document-picker';
import { determineFileType } from "../utils/utils";
import { ButtonGreen, ButtonIconLightGreen, ButtonWhite } from "./Button";
import { addQualification, deleteQualification } from "../services/user";
import { useUser } from "../contexts/UserContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

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
    value=initProfessions,
    fetchData = ()=>{}
}) => {
    const {state, dispatch} = useUser()
    const [professions, setProfess] = useState(value || [])
    const [selectImg, setSelectImg] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setProfess(value || [])
        setError("")
        setLoading(false)
    }, [value])

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
    const confirmDelete = (item)=>{
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this qualification?",
            [
                {
                    text: "Yes",
                    onPress: ()=> handleDelete(item),
                    style: "destructive"
                },
                {
                    text: "No",
                    style: "cancel"
                },
            ],
            { cancelable: true }
        )
    }
    const handleDelete = async(item)=>{
        if(!item.isNew){
            try{
                const response = await deleteQualification(item.idQualification)
                if(response.error){
                    Alert.alert("Warning", response.data)
                }else{
                    Alert.alert("Noti", "Delete professionals done.")
                    fetchData()
                }
            } catch(e){
                console.log("Error delete professionals: ", e);
            }
        }
        const newProfessions = professions.filter((current)=> current.idQualification !== item.idQualification)
        setProfess(newProfessions)
    }
    const handleSelectImg = (select)=>{
        setSelectImg(select)
    }
    const handleChangeData = (idQualification, value, key)=>{
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
    const checkIsNull = (item)=>{
        if(item.qualificationName === "" || item.description === "" || item.path === ""){
            setError("Please fill all.")
            return true
        }
        setError("")
        return false
    }
    const handleSave = async (item)=>{
        // Add
        if(checkIsNull(item)) return
        setLoading(true)
        try{
            let response 
            if(determineFileType(item.path.uri) === "Image"){
                response = await addQualification(state.idUser, item.qualificationName, item.description, {
                    uri: item.path.uri,
                    name: 'qualification.png',
                    type: item.path.mimeType 
                })
            } else {
                response = await addQualification(state.idUser, item.qualificationName, item.description, {
                    uri: item.path.uri,
                    name: 'qualification.pdf',
                    type: item.path.mimeType 
                })
            }
            if(response.error){
                Alert.alert("Warning", response.data)
            }else{
                Alert.alert("Noti", "Add professionals done")
                fetchData()
            }
        } catch(e){
            console.log("Error add professionals: ", e);
        }finally{
            setLoading(false)
        }
    }

    return(
        <>
            <View style={styles.wrapContainer}>
                <Text style={[commonStyles.title]}>Professional Qualifications</Text>
                <View style={{rowGap: 10, paddingTop: 10}}>
                    {professions ? 
                    professions.map((item)=>
                    <View style={styles.container} key={item.idQualification}>
                        {/* 1 approved, 2 pending, 0 rejected */}
                        {item.status === 2 ? 
                            <TagYellow label={"Pending"}/>
                            :
                            item.status === 1 ?
                            <Tag label={"Approved"}/> 
                            :
                            item.status === 0 ?
                            <TagRed label={"Reject. Reason: " + item.reason}/>
                            :""
                        }
                        <TextInput 
                            style={[styles.input]}
                            value={item.qualificationName}
                            placeholder={"*Title"}
                            placeholderTextColor={COLORS.red}
                            onChangeText={(v)=>handleChangeData(item.idQualification, v, "qualificationName")}
                            editable={item.isNew === true}
                        />
                        <TextInput 
                            style={[styles.input]}
                            value={item.description}
                            placeholder={"*Desciption"}
                            placeholderTextColor={COLORS.red}
                            onChangeText={(v)=>handleChangeData(item.idQualification, v, "description")}
                            editable={item.isNew === true}
                        />
                        <View style={styles.wrap}>
                            <View>
                                <View style={styles.wrapbtn}>
                                    {item.isNew ? 
                                        <TouchableOpacity style={styles.btn} onPress={() => pickFile(item.idQualification)}>
                                            <AntDesign name="file1" size={20} color={COLORS.stroke} />
                                        </TouchableOpacity>
                                        : ""  
                                    }
                                    <TouchableOpacity style={styles.btn} onPress={()=>confirmDelete(item)}>
                                        <AntDesign name="delete" size={20} color={COLORS.stroke} />
                                    </TouchableOpacity>
                                </View> 
                                {item.isNew &&
                                    <TouchableOpacity style={styles.btn} onPress={() => handleSave(item)}>
                                        <FontAwesome name="check" size={20} color={COLORS.stroke} />
                                    </TouchableOpacity>
                                }
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
                                    <TouchableOpacity onPress={()=>handleSelectImg(item.path.uri)}>
                                        <View style={styles.image}>
                                            <Text style={styles.pdf}>Open pdf</Text>
                                        </View>
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
                                    <TouchableOpacity onPress={()=>handleSelectImg(item.path)}>
                                        <View style={styles.image}>
                                            <Text style={styles.pdf}>Open pdf</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :"" 
                            }
                            
                        </View>
                    </View>
                    ): ""}
                    {error && <Text style={{ color: COLORS.red }}>{error}</Text>}
                    <ButtonIconLightGreen title={"Add"} icon={<AntDesign name="plus" size={14} color={COLORS.main} />} action={()=>handleAddNew()}/>
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
                    {determineFileType(selectImg) === "Pdf" ?
                        <View style={{ flex: 1 }}>
                            <WebView
                                source={{ uri: `https://docs.google.com/gview?embedded=true&url=${selectImg}` }}
                                style={{ flex: 1 }}
                                cacheMode="LOAD_NO_CACHE"
                            />
                        </View>
                        :
                        <Image source={{uri: selectImg}} style={styles.selectImg}/>
                    }
                </View>
            </Modal>
            {loading &&
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.wrapLoading}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                </Modal>
            }  
        </>
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
        color: "black"
    },
    wrap:{
        flexDirection: "row",
        justifyContent: "space-between"
    },
    wrapbtn:{
        flexDirection: "row",
        columnGap: 4,
        marginBottom: 4
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
        justifyContent: "center",
        alignItems: "center"
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
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    wrapPdf: {
        borderWidth: 10,
        borderColor: "red",
        flex: 1,
        backgroundColor: "pink"
    }
})