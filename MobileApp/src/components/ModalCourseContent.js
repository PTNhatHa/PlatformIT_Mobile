import { StyleSheet, Text, TouchableOpacity, View, Modal, Alert, ActivityIndicator, TouchableWithoutFeedback, TextInput, ScrollView } from "react-native"
import { COLORS } from "../utils/constants"
import { ButtonGreen, ButtonIconLightGreen } from "../components/Button";
import { CardLecture } from "../components/CardLecture";
import { useEffect, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TextInputLabel } from "./TextInputField";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from "@react-navigation/native";
import { addSection } from "../services/course";
import { useUser } from "../contexts/UserContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const initLecture = [
    {
        idSection: 1,
        sectionName: "Section 1",
        lectureCount: 1,
        lectures: [
            {
                "idLecture": 0,
                "lectureTitle": "Sample",
                "lectureIntroduction": "Sample",
                "exerciseCount": 1,
                "createdDate": "2024-11-06T13:58:50.7138603+07:00"
            },
    
        ]
    },
    {
        idSection: 2,
        sectionName: "Section 2",
        lectureCount: 1,
        lectures: [
            {
                "idLecture": 1,
                "lectureTitle": "Sample",
                "lectureIntroduction": "Sample",
                "exerciseCount": 1,
                "createdDate": "2024-11-06T13:58:50.7138603+07:00"
            },
    
        ]
    },
]

export const ModalCourseContent = ({
    role=0, content=[], idCourse, nameCourse, getCourse, 
    selectLecture, setSelectLecture = ()=>{}, 
    isLimitedTime, courseEndDate
})=>{
    const [loading, setLoading] = useState(false);
    const {state, dispatch} = useUser()
    const navigation = useNavigation()
    const [showSections, setShowSections] = useState(content?.map(item => (
        {
            idSection: item.idSection,
            isShow: false
        }
    )) || [])
    const [isAddSection, setIsAddSection] = useState(false);
    const [newSection, setNewSection] = useState("");
    const [isEditSection, setIsEditSection] = useState(false);

    const [longPressSection, setLongPressSection] = useState(false);
    const [selectSection, setSelectSection] = useState("");

    const [selectObject, setSelectObject] = useState(selectLecture || {
        idLecture: 0,
        lectureTitle: "",
        idSection: 0,
        sectionName: ""
    });
    
    useEffect(()=>{
        setLoading(true)
        setShowSections(content.map(item => (
            {
                idSection: item.idSection,
                isShow: false
            }
        )) || [])
        setLoading(false)
    }, [content])

    const handleShowSection = (idSection)=>{
        const newShow = showSections.map(item => {
            if(item.idSection === idSection){
                return{
                    ...item,
                    isShow: !item.isShow
                }
            }
            return item
        })
        setShowSections(newShow)
    }

    const handleAddSection = async()=>{
        // setLoading(true)
        try {
            const response = await addSection(newSection, idCourse, state.idUser)
            if(response){
                Alert.alert("Add New Section", response)
                setIsAddSection(false)
                getCourse()
            } else {
                Alert.alert("Error", "Please try again.")
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const handleSelectLecture = (idSection, sectionName, idLecture, lectureTitle)=>{
        setSelectLecture({
            idLecture: idLecture,
            lectureTitle: lectureTitle,
            idSection: idSection,
            sectionName: sectionName
        })
        if(!selectLecture){
            setSelectObject({
                // idLecture: idLecture,
                // lectureTitle: lectureTitle,
                idSection: idSection,
                sectionName: sectionName
            })
        }
    }
    return(
        <>
        {loading ?
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color="white" />
            </View>
            :
                <ScrollView showsVerticalScrollIndicator={false}>
                {content?.length > 0 &&
                content?.map((item)=>{
                    let checkIsShow = showSections.find(section => section.idSection === item.idSection)?.isShow
                    return(
                        <View key={item.idSection} style={styles.wrapSectionLecture}>
                            <TouchableOpacity 
                                style={[styles.wrapSection, selectObject.idSection === item.idSection && {backgroundColor: COLORS.main30}]} 
                                onPress={()=>{
                                    handleShowSection(item.idSection)
                                    // setSelectLecture({
                                    //     ...selectObject,
                                    //     idSection: !checkIsShow ? item.idSection : 0,
                                    //     sectionName: item.sectionName,
                                    // })
                                    if(!selectLecture){
                                        setSelectObject({
                                            // ...selectObject,
                                            idSection: !checkIsShow ? item.idSection : 0,
                                            sectionName: item.sectionName,
                                        })
                                    }
                                }}
                                onLongPress={()=>{
                                    if(role === 1){
                                        setSelectSection({
                                            idSection: item.idSection,
                                            sectionName: item.sectionName
                                        })
                                        setLongPressSection(true)
                                    }
                                }}
                            >
                                <Text style={[styles.section, {flex: 1}]} numberOfLines={1}>
                                    {item.sectionName}
                                </Text>
                                <Text style={[styles.section, {fontSize: 12}]}>
                                    {item.lectureCount}
                                    {item.lectureCount > 1 ? " lectures" : " lecture"}
                                </Text>
                                { checkIsShow ?
                                    <Entypo name="chevron-up" size={20} color="black" />
                                    :
                                    <Entypo name="chevron-down" size={20} color="black" />
                                }
                            </TouchableOpacity>
                            <View style={[styles.wrapShow, {height: checkIsShow? "auto" : 0}]}>
                                {item.lectures?.map(lec => 
                                    <CardLecture 
                                        data={lec} key={lec.idLecture} role={role} idCourse={idCourse} 
                                        section={{
                                            idSection: item.idSection,
                                            sectionName: item.sectionName
                                        }}
                                        setSelected={handleSelectLecture} selectObject={selectObject}
                                        isLimitedTime={isLimitedTime}
                                        courseEndDate={courseEndDate}
                                    />
                                )}
                                {role === 1 &&
                                    <View style={{flexDirection: "row", justifyContent: "space-between", backgroundColor: "white"}}>
                                        <TouchableOpacity style={styles.addLec} onPress={()=>{
                                            if(selectLecture){
                                                setSelectLecture({
                                                    idSection: item.idSection,
                                                    nameSection: item.sectionName,
                                                })
                                            }
                                            navigation.navigate("Create Lecture", {
                                                idCourse: idCourse, 
                                                nameCourse: nameCourse, 
                                                idSection: item.idSection, 
                                                nameSection: item.sectionName,
                                                getCourse: getCourse,

                                            })
                                        }}>
                                            <Entypo name="plus" size={14} color={COLORS.main} />
                                            <Text style={styles.addLecText}>Add new lecture</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    )}
                )}
                {role === 1 &&
                    <View style={{marginVertical: 4}}>
                        <ButtonIconLightGreen 
                            title={"Add new section"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}
                            action={()=>setIsAddSection(true)}    
                        />
                    </View>
                }
                {isAddSection &&
                    <View style={styles.addSection}>
                        <TextInput
                            style={styles.textSection}
                            placeholder="Name section"
                            value={newSection}
                            onChangeText={(v)=>setNewSection(v)}
                        />
                        <TouchableOpacity onPress={()=>{
                            setIsAddSection(false)
                            setNewSection("")
                        }}>
                            <FontAwesome name="close" size={24} color={COLORS.stroke} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>handleAddSection()}>
                            <FontAwesome name="check" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                }

                {/* LongPress Section */}
                <Modal
                    visible={longPressSection}
                    transparent={true}
                    animationType="fade"
                >
                    <TouchableWithoutFeedback onPress={() => {
                        setLongPressSection(false)
                        setSelectSection("")
                        setIsEditSection(false)
                        setNewSection("")
                    }}>
                        <View style={styles.selectImgWrapper}>
                            {isEditSection ?
                                <View style={styles.addSection}>
                                    <TextInput
                                        style={styles.textSection}
                                        placeholder="Name section"
                                        value={newSection}
                                        onChangeText={(v)=>setNewSection(v)}
                                    />
                                    <TouchableOpacity onPress={()=>{
                                        setIsEditSection(false)
                                        setNewSection("")
                                    }}>
                                        <FontAwesome name="close" size={24} color={COLORS.stroke} />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <FontAwesome name="check" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                            :
                                <View style={[styles.wrapSection, {borderRadius: 8}]} >
                                    <Text style={[styles.section, {flex: 1}]}>
                                        {selectSection?.sectionName}
                                    </Text>
                                </View>
                            }
                            
                            <View style={styles.selectSection}>
                                <TouchableOpacity style={[styles.btnSelectSection, {borderBottomWidth: 1}]} 
                                    onPress={()=>{
                                        setNewSection(selectSection?.sectionName)
                                        setIsEditSection(true)
                                    }}
                                >
                                    <Text>Edit name section</Text>
                                    <Entypo name="edit" size={20} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnSelectSection}>
                                    <Text>Delete section</Text>
                                    <MaterialIcons name="delete" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </ScrollView>
        }  
        </>
    )
}

const styles = StyleSheet.create({
    section:{
        fontSize: 16,
        fontWeight: "bold",   
    },
    wrapSection:{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,
        backgroundColor: COLORS.lightText,
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8
    },
    wrapShow: {
        overflow: "hidden",
        height: "auto"
    },
    wrapSectionLecture:{
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.lightText,
        marginVertical: 2
    },

    addLec: {
        padding: 12,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4
    },
    addLecText:{
        fontSize: 14,
        color: COLORS.main,
        fontWeight: "bold"
    },
    selectImgWrapper: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },
    close:{
        alignSelf: "flex-end"
    },
    addNoti: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        rowGap: 12,
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    selectSection: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnSelectSection:{
        borderColor: COLORS.lightText,
        width: "100%",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    addSection:{
        backgroundColor: COLORS.main30,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
    },
    textSection:{
        fontSize: 16,
        borderBottomWidth: 1,
        flex: 1,
        padding: 0,
        height: 24
    }
})

