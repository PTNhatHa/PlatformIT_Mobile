import { ActivityIndicator, Alert, Image, Linking, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, commonStyles } from "../../../utils/constants";
import { useEffect, useRef, useState } from "react";
import { ModalCourseContent } from "../../../components/ModalCourseContent";
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardAssignment } from "../../../components/CardAssignment";
import { Comments } from "../../../components/Comments";
import { TextInputLabel, TextInputLabelGray, TextInputSelectBox } from "../../../components/TextInputField";
import DefaultImg from "../../../../assets/images/DefaultImg.png"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ButtonIconLightGreen } from "../../../components/Button";
import * as DocumentPicker from 'expo-document-picker';
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { calculateRelativeTime, getMimeType, parseRelativeTime } from "../../../utils/utils";
import { getLectureDetail, inactiveLecture, updateLecture } from "../../../services/lecture";
import { getCourseContentStructure, getSectionDetail } from "../../../services/course";
import { GetExerciseOfLecture } from "../../../services/assignment";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from "../../../contexts/UserContext";

const init = {
    idLecture: 1,
    idCourse: 1, 
    nameCourse: "ABC", 
    idSection: 1, 
    nameSection: "Section 1"
}
// Chỉ truyền idLecture vào thôi còn mấy kia getDetail trả thêm về
export const TeacherLectureDetail = ({route})=>{
    const {state} = useUser()
    const {idLecture, isLimitedTime, courseEndDate, reload} = route?.params || init
    const navigation = useNavigation()
    const [index, setIndex] = useState(1) //1: Information, 2: Content, 3: Exercise, 4: Comment
    const [currentLecture, setCurrentLecture] = useState(idLecture)
    const [isOpenMenu, setIsOpentMenu] = useState(false)
    const [selectLecture, setSelectLecture] = useState({
        idLecture: idLecture,
        lectureTitle: "",
        idSection: null,
        sectionName: ""
    });

    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true);
    const [courseContent, setCourseContent] = useState([])
    const [isEditMode, setIsEditMode] = useState(false)
    const [exercises, setExercises] = useState([])
    const [isOpenSetting, setIsOpentSetting] = useState(false)
    const intervalRef = useRef(null);
    const [editData, setEditData] = useState({})
    const [error, setError] = useState(null)

    const handleDiscardChange = ()=>{
        setEditData({...data})
    }

    const fetchDetailLecture = async()=>{
        try {
            const response = await getLectureDetail(selectLecture.idLecture)
            if(response){
                setEditData({
                    ...response,
                    videoMaterial: response.videoMaterial ? {
                        uri: response.videoMaterial.path,
                        name: response.videoMaterial.fileName,
                        type: getMimeType(response.videoMaterial.fileName) 
                    } : null,
                    mainMaterials: response.mainMaterials[0] ? {
                        uri: response.mainMaterials[0].path,
                        name: response.mainMaterials[0].fileName,
                        type: getMimeType(response.mainMaterials[0].fileName) 
                    } : null,
                    supportMaterials: response.supportMaterials ? [...response.supportMaterials.map(sup => {
                        return{
                            uri: sup.path,
                            name: sup.fileName,
                            type: getMimeType(sup.fileName) 
                        }
                    })] : []
                })
                setData({
                    ...response,
                    timestamp: parseRelativeTime(response.relativeTime),
                    videoMaterial: response.videoMaterial ? {
                        uri: response.videoMaterial.path,
                        name: response.videoMaterial.fileName,
                        type: getMimeType(response.videoMaterial.fileName) 
                    } : null,
                    mainMaterials: response.mainMaterials[0] ? {
                        uri: response.mainMaterials[0].path,
                        name: response.mainMaterials[0].fileName,
                        type: getMimeType(response.mainMaterials[0].fileName) 
                    } : null,
                    supportMaterials: response.supportMaterials ? [...response.supportMaterials.map(sup => {
                        return{
                            uri: sup.path,
                            name: sup.fileName,
                            type: getMimeType(sup.fileName) 
                        }
                    })] : []
                })

                if(!selectLecture.idSection){
                    setSelectLecture({
                        idLecture: idLecture,
                        lectureTitle: "",
                        idSection: response.idSection,
                        sectionName: ""
                    })
                }
                if(currentLecture !== selectLecture.idLecture){
                    setCurrentLecture(selectLecture.idLecture)
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }
    const fetchExercise = async()=>{
        setLoading(true)
        try {
            const response = await GetExerciseOfLecture(selectLecture.idLecture)
            if(response){
                setExercises([...response])
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        setLoading(true)
        fetchDetailLecture()
        fetchExercise()
        intervalRef.current = setInterval(() => {
            setData((prevData) => ({
                ...prevData,
                relativeTime: calculateRelativeTime(prevData.timestamp),
            }))
        }, 60000);
        return () => clearInterval(intervalRef.current);
    }, [])

    useEffect(()=>{
        if(currentLecture !== selectLecture.idLecture){
            setLoading(true)
            clearInterval(intervalRef.current)
            fetchDetailLecture()        
            .then(() => {
                intervalRef.current = setInterval(() => {
                    setData((prevData) => ({
                        ...prevData,
                        relativeTime: calculateRelativeTime(prevData.timestamp),
                    }));
                }, 60000);
            });
            fetchExercise() 
            setLoading(false)
        }
    }, [selectLecture])

    const handleSelectLecture = (v)=>{
        setSelectLecture(v)
        setIsOpentMenu(false) 
    }

    const openURL = (url) => {  
        Linking.canOpenURL(url)  
        .then((supported) => {  
            if (supported) {  
                return Linking.openURL(url);  
            } else {  
                console.log("Can't open URL: " + url);  
            }  
        })  
        .catch((err) => console.error('Error occurred', err));  
    };  

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
            setEditData({
                ...editData,
                mainMaterials: {
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
            setEditData({
                ...editData,
                supportMaterials: [
                    ...editData.supportMaterials,
                    {
                        uri: result.uri,
                        name: result.name,
                        type: result.mimeType 
                    }
                ]
            })
        }
    }
    const onDeleteSupportMaterial= async(index)=>{
        const newMaterial = editData.supportMaterials.filter((item, i) => index !== i)
        setEditData({
            ...editData,
            supportMaterials: newMaterial
        })
    }
    const onChangeVideo = async ()=>{
        const result = await pickFile("video")
        if(result){
            setEditData({
                ...editData,
                videoMaterial: {
                    uri: result.uri,
                    name: result.name,
                    type: result.mimeType 
                }
            })
        }
    }

    const handleDeleteLecture = ()=>{
        Alert.alert(
            "Confirm Delete Lecture",
            "Are you sure you want to delete this lecture?",
            [
                {
                    text: "Yes",
                    onPress: async()=> {
                        try {
                            const response = await inactiveLecture(idLecture, state.idUser)
                            if(response){
                                reload()
                                navigation.goBack()
                            }
                        } catch (error) {
                            console.log("Error: ", error);
                        }
                    },
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

    const handleUpdateLecture = async()=>{
        if(!editData.lectureTitle){
            setError("Please fill the lecture name.")
            return
        }
        if(!editData.mainMaterials && !editData.videoMaterial){
            setError("Please fill upload a video or a material.")
            return
        }
        setLoading(true)
        try {
            const response = await updateLecture(
                state.idUser, idLecture, editData.idCourse, editData.idSection, "", editData.lectureTitle, editData.lectureIntroduction, 
                editData.videoMaterial, editData.mainMaterials, editData.supportMaterials)
            if(response){
                Alert.alert("Update Lecture Successfully", response)
                fetchDetailLecture()
            } else {
                Alert.alert("Warning", "Please try again.")
            }
        } catch (error) {
            console.log("Error update lecture: ", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        setError(null)
    }, [editData])

    if (loading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }

    return(
        <>
            <TouchableOpacity style={styles.btnMenu} onPress={()=>setIsOpentMenu(true)}>
                <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSetting} onPress={()=>setIsOpentSetting(!isOpenSetting)}>
                <Ionicons name="settings-sharp" size={24} color="black" />
            </TouchableOpacity>
            {isOpenSetting &&
                <>
                    <TouchableOpacity style={[styles.btnSetting, styles.btnEdit, isEditMode && styles.btnActive]} onPress={()=>{
                        setIndex(1)
                        setIsEditMode(!isEditMode)
                    }}>
                        <MaterialIcons name="mode-edit" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnSetting, styles.btnDelete]} onPress={()=>handleDeleteLecture()}>
                        <MaterialIcons name="delete" size={24} color="black" />
                    </TouchableOpacity>
                </>
            }
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.title}>{data.courseTitle}</Text>
                </View>                
                <View style={styles.main}>
                    <View style={styles.wrapper}>
                        <View>
                            <Text style={styles.title}>{isEditMode ? "Edit lecture" : data.lectureTitle}</Text>
                            {isEditMode ?                                 
                                <View style={styles.wrapBtn}>
                                    <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]} onPress={()=>handleUpdateLecture()}>
                                        <Text style={styles.textWhite14}>Save changes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btn]} onPress={()=>handleDiscardChange()}>
                                        <Text style={styles.textGray14}>Discard changes</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <>
                                    <Text style={styles.textGray12}>{data.relativeTime}</Text>
                                </>
                            }
                            {error && <Text style={{color: COLORS.red}}>{error}</Text>}
                        </View>
                        {isEditMode && 
                            <TextInputLabelGray 
                                placeholder={"Lecture name"} label={"Lecture name*"} value={editData.lectureTitle} 
                                onchangeText={(v)=>setEditData({
                                    ...editData,
                                    lectureTitle: v
                                })}
                            />
                        }
                        <View style={styles.containerGray}>
                            <View style={styles.wrapFlex}>
                                {isEditMode && <Text style={styles.label}>Lecture video</Text>}
                                {(editData.videoMaterial && isEditMode) &&
                                    <TouchableOpacity 
                                        onPress={()=>setEditData({
                                            ...editData,
                                            videoMaterial: null
                                        })} 
                                        style={[styles.btnText]}
                                    >
                                        <MaterialIcons name="delete" size={20} color={COLORS.red} />
                                    </TouchableOpacity>
                                }
                                {isEditMode &&
                                    <TouchableOpacity onPress={()=>onChangeVideo()} style={[styles.btnText]}>
                                        <MaterialIcons name="upload-file" size={20} color="black" />
                                    </TouchableOpacity>
                                }
                            </View>
                            {(data.videoMaterial && !isEditMode) ? 
                                <Video
                                    source={{ uri: data.videoMaterial?.uri }}
                                    style={styles.contentVideo}
                                    useNativeControls
                                    resizeMode="contain"
                                />
                                : isEditMode ?
                                    editData.videoMaterial ?
                                    <Video
                                        source={{ uri: editData.videoMaterial.uri }}
                                        style={styles.contentVideo}
                                        useNativeControls
                                        resizeMode="contain"
                                    />
                                    :
                                    <Image source={DefaultImg} style={styles.contentVideo}/>
                                :""
                            }
                        </View>                     
                        <View style={styles.containerGray}>
                            {isEditMode && <Text style={styles.label}>Material</Text>}
                            {(data.mainMaterials && !isEditMode) ?
                                <View style={styles.wrapFlex}>
                                    <TouchableOpacity style={[styles.inputLabelGray]} onPress={()=>openURL(data.mainMaterials?.uri)}>
                                        <Text numberOfLines={1}>{data.mainMaterials?.name}</Text>
                                    </TouchableOpacity>                                    
                                </View>
                                : (editData.mainMaterials && isEditMode) ? 
                                    <View style={styles.wrapFlex}>
                                        <TouchableOpacity style={[styles.inputLabelGray]} onPress={()=>openURL(editData.mainMaterials?.uri)}>
                                            <Text numberOfLines={1}>{editData.mainMaterials?.name}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={()=>setEditData({
                                                ...editData,
                                                mainMaterials: null
                                            })}  
                                            style={{margin: 4}}
                                        >
                                            <MaterialIcons name="delete" size={24} color={COLORS.red} />
                                        </TouchableOpacity>                                      
                                    </View>
                                    : isEditMode ?
                                        <TouchableOpacity onPress={()=>onChangeMaterial()} style={[styles.btnText]}>
                                            <MaterialIcons name="upload-file" size={20} color="black" />
                                            <Text>Attach file</Text>
                                        </TouchableOpacity> 
                                        : ""
                            }
                        </View>  
                    </View>
                    <View style={styles.nav}>
                        <TouchableOpacity onPress={()=>setIndex(1)}>
                            <Text style={index === 1 ? styles.navTextActive : styles.navText}>Introduction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setIndex(2)}>
                            <Text style={index === 2 ? styles.navTextActive : styles.navText}>Sup materials</Text>
                        </TouchableOpacity>
                        {!isEditMode &&
                            <>
                                <TouchableOpacity onPress={()=>setIndex(3)}>
                                    <Text style={index === 3 ? styles.navTextActive : styles.navText}>Exercise</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>setIndex(4)}>
                                    <Text style={index === 4 ? styles.navTextActive : styles.navText}>Comment</Text>
                                </TouchableOpacity>
                            </>
                        }
                    </View>

                    {/* Information */}
                    {index === 1 &&
                        <View style={styles.wrapper}> 
                            {isEditMode ?
                                <TextInputLabelGray 
                                    placeholder={"Introduction"} value={editData.lectureIntroduction} multiline={true}
                                    onchangeText={(v)=>setEditData({
                                        ...editData,
                                        lectureIntroduction: v
                                    })} 
                                /> 
                                :
                                <Text style={styles.textGray12}>{data.lectureIntroduction}</Text>                              
                            }                                                   
                                                      
                        </View>
                    }

                    {/* Content */}
                    {index === 2 &&
                        <View style={styles.wrapper}>                                                   
                            <View style={styles.containerGray}>
                                {isEditMode && <Text style={styles.label}>Supporting materials</Text>}                                
                                {(data.supportMaterials?.length > 0 && !isEditMode) &&
                                    data.supportMaterials.map((item, index) => 
                                        <View style={[styles.wrapFlex, {marginBottom: 4}]} key={index}>
                                            <TouchableOpacity style={[styles.inputLabelGray]} onPress={()=>openURL(item.uri)}>
                                                <Text numberOfLines={1}>{item.name}</Text>
                                            </TouchableOpacity>                                            
                                        </View>
                                )}
                                {(editData.supportMaterials?.length > 0 && isEditMode) &&
                                    editData.supportMaterials.map((item, index) => 
                                        <View style={[styles.wrapFlex, {marginBottom: 4}]} key={index}>
                                            <TouchableOpacity style={[styles.inputLabelGray]} onPress={()=>openURL(item.uri)}>
                                                <Text numberOfLines={1}>{item.name}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>onDeleteSupportMaterial(index)} style={{margin: 4}}>
                                                <MaterialIcons name="delete" size={24} color={COLORS.red} />
                                            </TouchableOpacity>                                            
                                        </View>
                                )}
                                {isEditMode && 
                                    <TouchableOpacity onPress={()=>addSupportMaterial()} style={[styles.btnText]}>
                                        <MaterialIcons name="upload-file" size={20} color="black" />
                                        <Text>Attach file</Text>
                                    </TouchableOpacity>
                                }
                            </View>                                                       
                        </View>
                    }

                    {/* Exercise */}
                    {(index === 3 && !isEditMode) &&
                        <View style={styles.wrapper}>
                            <ButtonIconLightGreen 
                                title={"Add new exercise"} icon={<Entypo name="plus" size={18} color={COLORS.main}/>}
                                action={()=>navigation.navigate("Create Exercise", {
                                    idCourse: data.idCourse, 
                                    nameCourse: data.courseTitle,
                                    isLimitedTime: isLimitedTime === true ? 1 : 0,
                                    courseEndDate: courseEndDate || "",
                                    reload: ()=>{
                                        fetchDetailLecture()
                                    },
                                    idSection: selectLecture.idSection, 
                                    nameSection: selectLecture.sectionName, 
                                    idLecture: selectLecture.idLecture, 
                                    nameLecture: selectLecture.lectureTitle
                                })}
                            />
                            {exercises.map(exercise => 
                                <CardAssignment role={1} isDetail={true} data={exercise} isNoBoder={true} key={exercise.idAssignment} isStudentExercise={true}/>
                            )}
                        </View>
                    }

                    {/* Comment */}
                    {(index === 4 && !isEditMode) &&
                        <Comments idLecture={selectLecture.idLecture} idTeacher={state.idUser}/>
                    }
                </View>
            </ScrollView>

            <Modal
                visible={isOpenMenu}
                transparent={true}
                animationType="slide"
                onRequestClose={()=>setIsOpentMenu(true)}
            >
                <View style={styles.modal}>
                    <ScrollView contentContainerStyle={styles.innerModal}>
                        <TouchableOpacity style={{alignSelf: "flex-end"}} onPress={()=>setIsOpentMenu(false)}>
                            <AntDesign name="close" size={30} color={COLORS.secondMain} />
                        </TouchableOpacity>
                        <ModalCourseContent 
                            role={1} selectLecture={selectLecture} setSelectLecture={handleSelectLecture} content={courseContent}
                            idCourse={data.idCourse}
                        />
                    </ScrollView>
                </View>
            </Modal>
            
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            } 
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FAFAFA",
        minHeight: "100%"
    },
    top:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1
    },
    main: {
        ...commonStyles.shadow,
        borderRadius: 8,
        backgroundColor: "white",
        paddingBottom: 16,
        marginBottom: 100
    },
    contentVideo: {
        width: "100%",
        height: 200,
        backgroundColor: COLORS.lightText,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        marginBottom: 8
    },
    textGray12:{
        fontSize: 12,
        color: COLORS.stroke
    },
    wrapper: {
        paddingHorizontal: 16,
        marginVertical: 16,
        gap: 8
    },
    nav:{
        paddingHorizontal: 16,
        borderWidth: 0.7,
        borderBottomColor: COLORS.lightText,
        borderTopColor: "white",
        borderLeftColor: "white",
        borderRightColor: "white",
        flexDirection: "row",
        gap: 16,

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
        // width: "100%",
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
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.3)',
    },
    btnMenu:{
        ...commonStyles.shadow,
        backgroundColor: COLORS.main30,
        width: 50,
        height: 50,
        borderRadius: 90,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 16,
        zIndex: 1
    },
    btnSetting:{
        ...commonStyles.shadow,
        backgroundColor: COLORS.main30,
        width: 50,
        height: 50,
        borderRadius: 90,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 60,
        right: 0,
        margin: 16,
        zIndex: 1
    },
    btnEdit:{
        bottom: 120,
        backgroundColor: COLORS.lightText,
    },
    btnDelete:{
        bottom: 180,
        backgroundColor: COLORS.lightText,
    },
    btnActive:{
        backgroundColor: "#F8E9AC"
    }

})