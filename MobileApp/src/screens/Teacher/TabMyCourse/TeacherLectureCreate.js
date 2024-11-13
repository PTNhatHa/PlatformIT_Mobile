import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, commonStyles } from "../../../utils/constants";
import { useState } from "react";
import { ModalCourseContent } from "../../../components/ModalCourseContent";
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardAssignment } from "../../../components/CardAssignment";
import { Comments } from "../../../components/Comments";
import { TextInputLabel, TextInputLabelGray, TextInputSelectBox } from "../../../components/TextInputField";
import DefaultImg from "../../../../assets/images/DefaultImg.png"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ButtonIconLightGreen } from "../../../components/Button";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from 'expo-document-picker';
import { Video } from "expo-av";

const init = {
    idCourse: 1, 
    nameCourse: "ABC", 
    idSection: 1, 
    nameSection: "Section 1"
}
export const TeacherLectureCreate = ({route})=>{
    const {idCourse, nameCourse, idSection, nameSection} = init
    const navigation = useNavigation()
    const [lectureName, setLectureName] = useState()
    const [intro, setIntro] = useState()
    const [material, setMaterial] = useState(null)
    const [supportMaterial, setSupportMaterial] = useState([])
    const [idSupMaterial, setIdSupMaterial] = useState(1)
    const [video, setVideo] = useState(null)
    const pickFile = async(type = "*")=>{
        try{
            let result = await DocumentPicker.getDocumentAsync({
                type: [type + '/*'],
                copyToCacheDirectory: true,
            })
            return result.assets[0]
        }
        catch(error){
            console.log("==>Error picking file: ", error);
        }
    }
    const onChangeMaterial= async()=>{
        const result = await pickFile()
        if(result){
            setMaterial({
                nameFile: result.name,
                file: {
                    uri: result.uri,
                    name: result.name,
                    type: result.mimeType 
                }
            })
        }
    }
    const addSupportMaterial= async()=>{
        const result = await pickFile()
        if(result){
            const newMaterial = [...supportMaterial, {
                id: "id" + idSupMaterial.toString(),
                nameFile: result.name,
                file: {
                    uri: result.uri,
                    name: result.name,
                    type: result.mimeType 
                }
            }]
            setSupportMaterial(newMaterial)
            setIdSupMaterial(idSupMaterial + 1)
        }
    }
    const onChangeSupportMaterial= async(id, value)=>{
        const newMaterial = supportMaterial.map(item => {
            if(item.id === id){
                return{
                    ...item,
                    nameFile: value
                }
            }
            return item
        })
        setSupportMaterial(newMaterial)
    }
    const onDeleteSupportMaterial= async(id,)=>{
        const newMaterial = supportMaterial.filter(item => item.id !== id)
        setSupportMaterial(newMaterial)
    }
    const onChangeVideo = async ()=>{
        const result = await pickFile("video")
        if(result){
            setVideo({
                uri: result.uri,
                name: result.name,
                type: result.mimeType 
            })
        }
    }

    return(
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.title}>Create new lecture</Text>
                    <View style={styles.wrapBtn}>
                        <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]}>
                            <Text style={styles.textWhite14}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnBorderGray]} onPress={()=>navigation.goBack()}>
                            <Text style={styles.textGray14}>Cancel</Text>
                        </TouchableOpacity>
                    </View>  
                </View>
                <View style={styles.main}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Information</Text>
                    </View>
                    {/* Information */}
                    <View style={styles.wrapper}>
                        <TextInputLabelGray label={"Add to course"} value={nameCourse} editable={false}/>                            
                        <TextInputLabelGray label={"Add to section"} value={nameSection} editable={false}/>                       
                        <TextInputLabelGray placeholder={"Lecture name"} label={"Lecture name*"} value={lectureName} onchangeText={setLectureName}/>                            
                        <TextInputLabelGray placeholder={"Introduction"} label={"Introduction"} value={intro} onchangeText={setIntro}/>                       
                    </View>
                </View>

                <View style={styles.main}>
                    {/* Content */}
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Content</Text>
                    </View>
                    <View style={styles.wrapper}>
                        <View style={styles.containerGray}>
                            <View style={styles.wrapFlex}>
                                <Text style={styles.label}>Lecture video</Text>
                                {video &&
                                    <TouchableOpacity onPress={()=>{}} style={[styles.btnText]}>
                                        <MaterialIcons name="delete" size={20} color={COLORS.red} />
                                        {/* <Text>Delete</Text> */}
                                    </TouchableOpacity>
                                }
                                <TouchableOpacity onPress={()=>onChangeVideo()} style={[styles.btnText]}>
                                    <MaterialIcons name="upload-file" size={20} color="black" />
                                    {/* <Text>Upload video</Text> */}
                                </TouchableOpacity>
                            </View>
                            {video ? 
                                <Video
                                    source={{ uri: video.uri }}
                                    style={styles.contentVideo}
                                    useNativeControls
                                    resizeMode="contain"
                                />
                                :
                                <Image source={DefaultImg} style={styles.contentVideo}/>
                            }
                        </View>                         
                        <View style={styles.containerGray}>
                            <Text style={styles.label}>Material</Text>
                            {material ?
                                <View style={styles.wrapFlex}>
                                    <View style={[styles.inputLabelGray]}>
                                        <TextInput 
                                            style={styles.inputText}
                                            value={material.nameFile}
                                            onChangeText={(v)=>setMaterial({
                                                ...material,
                                                nameFile: v
                                            })}
                                            placeholder={"Materials"}
                                        />
                                        {/* <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                            <Entypo name="edit" size={18} color="black" />
                                        </TouchableOpacity> */}
                                    </View>
                                    <TouchableOpacity onPress={()=>setMaterial(null)} style={{margin: 4}}>
                                        <MaterialIcons name="delete" size={24} color={COLORS.red} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity onPress={()=>onChangeMaterial()} style={[styles.btnText]}>
                                    <MaterialIcons name="upload-file" size={20} color="black" />
                                    <Text>Attach file</Text>
                                </TouchableOpacity>
                            }
                        </View>                         
                        <View style={styles.containerGray}>
                            <Text style={styles.label}>Supporting materials</Text>
                            {supportMaterial.length > 0 &&
                                supportMaterial.map(item => 
                                    <View style={[styles.wrapFlex, {marginBottom: 4}]} key={item.id}>
                                        <View style={[styles.inputLabelGray]}>
                                            <TextInput 
                                                style={styles.inputText}
                                                value={item.nameFile}
                                                onChangeText={(v)=>onChangeSupportMaterial(item.id, v)}
                                                placeholder={"Supporting materials"}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={()=>onDeleteSupportMaterial(item.id)} style={{margin: 4}}>
                                            <MaterialIcons name="delete" size={24} color={COLORS.red} />
                                        </TouchableOpacity>
                                    </View>
                            )}
                            <TouchableOpacity onPress={()=>addSupportMaterial()} style={[styles.btnText]}>
                                <MaterialIcons name="upload-file" size={20} color="black" />
                                <Text>Attach file</Text>
                            </TouchableOpacity>
                        </View>                        
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FAFAFA",
        minHeight: "100%",
    },
    top:{
        // flexDirection: "row",
        // justifyContent: "space-between",
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    main: {
        ...commonStyles.shadow,
        borderRadius: 8,
        backgroundColor: "white",
        paddingBottom: 16,
        marginBottom: 16
    },
    contentVideo: {
        width: "100%",
        height: 200,
        backgroundColor: COLORS.lightText,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        // marginTop: 16,
        marginBottom: 8
    },
    textGray12:{
        fontSize: 12,
        color: COLORS.stroke
    },
    wrapper: {
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 8
    },
    nav:{
        paddingHorizontal: 16,
        borderBottomWidth: 0.7,
        borderColor: COLORS.lightText,
        flexDirection: "row",
        gap: 20
    },
    navText: {
        fontSize: 14,
        color: COLORS.lightText,
        paddingVertical: 8
    },
    navTextActive: {
        fontSize: 14,
        paddingVertical: 8,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderColor: COLORS.main,
    },
    textBlack16: {
        fontSize: 16,
        fontWeight: "bold",
    },
    wrapContent:{
        marginVertical: 8
    },
    modal: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16,
    },
    innerModal: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8
    },

    label: {
        fontSize: 10,
        color: COLORS.stroke,
        flex: 1
    },
    containerGray: {
        width: "100%",
        columnGap: 8,
    },
    inputLabelGray:{
        fontSize: 16,
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1
    },
    inputText:{
        // width: "90%"
    },
    textListTag: {
        margin: 4,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
    },

    textGray14: {
        fontSize: 14,
        color: COLORS.stroke
    },
    btn:{
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        flex: 1,
        alignItems: "center"
    },
    btnBorderGray:{
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        flex: 1,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.lightText
    },
    wrapBtn:{
        flexDirection: "row",
        gap: 8,
        marginVertical: 8
    },
    textWhite14:{
        fontSize: 14,
        color: "white",
    },
    wrapFlex:{
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    btnGray:{
        marginVertical: 4,
        backgroundColor: "white",
        borderRadius: 4,
        alignSelf: "flex-start",
        width: 35,
        height: 35,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.lightText
    },
    btnText:{
        fontSize: 16,
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginVertical: 4,
        gap: 4
    },
})