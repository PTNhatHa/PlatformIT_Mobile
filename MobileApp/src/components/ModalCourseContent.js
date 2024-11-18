import { StyleSheet, Text, TouchableOpacity, View, Modal, Alert, ActivityIndicator } from "react-native"
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

export const ModalCourseContent = ({role=0, content=[], idCourse, nameCourse, getCourse})=>{
    const [loading, setLoading] = useState(false);
    const {state, dispatch} = useUser()
    const navigation = useNavigation()
    const [showSections, setShowSections] = useState(content.map(item => (
        {
            idSection: item.idSection,
            isShow: true
        }
    )) || [])
    const [isAddSection, setIsAddSection] = useState(false);
    const [newSection, setNewSection] = useState("");

    useEffect(()=>{
        setLoading(true)
        setShowSections(content.map(item => (
            {
                idSection: item.idSection,
                isShow: true
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
        setLoading(true)
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
        } finally{
            setLoading(false)
        }
    }
    return(
        <>
        {loading ?
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color="white" />
            </View>
            :
                <>
                {role === 1 &&
                    <ButtonIconLightGreen 
                        title={"Add new section"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}
                        action={()=>setIsAddSection(true)}    
                    />
                }
                {content?.length > 0 &&
                content?.map((item)=>{
                    let checkIsShow = showSections.find(section => section.idSection === item.idSection)?.isShow
                    return(
                        <View key={item.idSection} style={styles.wrapSectionLecture}>
                            <TouchableOpacity style={styles.wrapSection} onPress={()=>handleShowSection(item.idSection)}>
                                <Text style={[styles.section, {flex: 1}]}>
                                    {item.sectionName} 
                                </Text>
                                <Text style={styles.section}>
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
                                    <CardLecture data={lec} key={lec.idLecture} role={role}/>
                                )}
                                {role === 1 &&
                                    <View style={{flexDirection: "row", justifyContent: "space-between", backgroundColor: "white"}}>
                                        <TouchableOpacity style={styles.addLec} onPress={()=>navigation.navigate("Create Lecture", {
                                            idCourse: idCourse, 
                                            nameCourse: nameCourse, 
                                            idSection: item.idSection, 
                                            nameSection: item.sectionName,
                                            getCourse: getCourse

                                        })}>
                                            <Entypo name="plus" size={14} color={COLORS.main} />
                                            <Text style={styles.addLecText}>Add new lecture</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.addLec}>
                                            <Text style={[styles.addLecText, {color: COLORS.red}]}>Delete this section</Text>
                                            <MaterialIcons name="delete" size={14} color={COLORS.red} />
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    )}
                )}

                {/* Add Section */}
                <Modal
                    visible={isAddSection}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={()=>setIsAddSection(false)}
                >
                    <View style={styles.selectImgWrapper}>
                        <View style={styles.addNoti}>
                            <TouchableOpacity style={styles.close} onPress={()=>{
                                setIsAddSection(false)
                                setNewSection("")
                            }}>
                                <AntDesign name="close" size={30} color={COLORS.secondMain} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20, fontWeight: "bold"}}>Add new section</Text>
                            <TextInputLabel label={"Name section"} value={newSection} placeholder={"Name section"} onchangeText={setNewSection}/>
                            <ButtonGreen title={"Save"} action={()=>handleAddSection()}/>
                        </View>
                    </View>
                </Modal>
            </>
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
        backgroundColor: COLORS.main30,
        paddingHorizontal: 16,
        paddingVertical: 8
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
        marginVertical: 8
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
        alignItems: "center"
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
    }
})

