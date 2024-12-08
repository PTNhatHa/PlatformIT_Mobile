import { ActivityIndicator, Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { COLORS, typeAssignment } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime, getTime } from "../utils/utils";
import { useState } from "react";
import { Tag, TagMain30, TagNoColor, TagRed } from "./Tag";
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { deleteAssignment, publishAssignment } from "../services/assignment";
import { useUser } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";

const initAssignment =     {
    "idAssignment": 12,
    "assignmentTitle": "Asgm react",
    "assignmentIntroduction": null,
    "dueDate": new Date(),
    "isSubmitted": 1,
    "assignmentType": 1,
    "assignmentTypeDesc": "MANUAL",
    "duration": 20,
    "maxScore": 10,
    "numberQuestion": 5,
    "isPublish": 1,
    "isExercise": 1
  }

//   {
//     "idAssignment": 1,
//     "nameLecture": null,
//     "nameCourse": "Agile and Scrum Methodologies",
//     "assignmentType": 2,
//     "title": "Agile & Scrum Methodologies Quiz 1",
//     "startDate": null,
//     "dueDate": null,
//     "duration": 0,
//     "questionQuantity": 1,
//     "isPublish": 0,
//     "isTest": 1,
//     "createdDate": "2024-11-20T11:23:31.7661598",
//     "isPastDue": 0
//   },
export const CardAssignment = ({
    data = initAssignment, role = 2, isNoBoder = false, isPastDue = false, getAllAsgm=()=>{}, isDetail = false,
    isStudentExercise = false
})=>{
    const navigation = useNavigation()
    const [longPress, setLongPress] = useState(false);
    const [loading, setLoading] = useState(false);
    const {state} = useUser()

    const deleteAsgm = async()=>{
        setLoading(true)
        try {
            const response = await deleteAssignment(data.idAssignment, state.idUser)
            if(response){
                Alert.alert("Delete", response)
                setLongPress(false)
                getAllAsgm()
            } else {
                Alert.alert("Error", "Please try again.")
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false)
        }
    }
    const handleDeleteAsgm = ()=>{
        Alert.alert(
            "Confirm Delete Assignment",
            "Are you sure you want to delete this assignment?",
            [
                {
                    text: "Yes",
                    onPress: ()=> {
                        deleteAsgm()
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

    const handelDuplicate = ()=>{
        navigation.navigate("Create Assignment", { 
            reload: getAllAsgm,
            idAssignment: data.idAssignment
        })
    }
    const handelEdit = ()=>{
        navigation.navigate("Edit Assignment", { 
            reload: getAllAsgm,
            idAssignment: data.idAssignment,
            isEdit: true
        })
    }
    const handlePublish = async()=>{
        const callPublish = async()=>{
            setLoading(true)
            try {
                const response = await publishAssignment(data.idAssignment, state.idUser)
                if(response){
                    Alert.alert("Publish assignment", response)
                    setLongPress(false)
                    getAllAsgm()
                } else{
                    Alert.alert("Warning", "Something went wrong!")
                }
            } catch (error) {
                console.log("Error: ", error);
            } finally{
                setLoading(false)
            }
        }
        Alert.alert(
            "Confirm Publish Assignment",
            "Are you sure you want to publish this assignment?",
            [
                {
                    text: "Yes",
                    onPress: ()=> {
                        callPublish()
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
    return(
        <>
            <TouchableOpacity 
                style={isNoBoder ? styles.containerNoBoder : styles.container} 
                key={data.idAssignment}
                onLongPress={()=>{
                    if(role === 1){
                        setLongPress(true)
                    }
                }}    
                onPress={()=> {
                    if(role === 1 && !data.isPublish){
                        handelEdit()
                    }
                    if(role === 1 && data.isPublish){
                        navigation.navigate("Detail Assignment", { 
                            idAssignment: data.idAssignment,
                            isPastDue: data.isPastDue,
                            isCompleted: data.isCompleted
                        })
                    }
                    if(isStudentExercise === true){
                        navigation.navigate("Detail Exercise", { 
                            idAssignment: data.idAssignment,
                            isPastDue: data.isPastDue,
                            isCompleted: data.isCompleted
                        })
                    } else if(role === 2){
                        navigation.navigate("Detail Test", { 
                            idAssignment: data.idAssignment,
                            isPastDue: data.isPastDue,
                            isCompleted: data.isCompleted
                        })
                    }
                }}
            >
                <View style={styles.wrapContent}>
                    <Text style={styles.title}>{data.assignmentTitle || data.title}</Text>
                    <View style={styles.wrapDetail}>
                        <View style={styles.content}>
                            <Foundation name="page-edit" size={12} color={COLORS.main} />
                            <Text style={styles.dataText}>{typeAssignment[data.assignmentType] || "Unknown"}</Text>
                        </View>
                        {data.duration !== 0 && data.duration !== null &&
                            <View style={styles.content}>
                                <Feather name="clock" size={11} color={COLORS.main} />
                                <Text style={styles.dataText}>{data.duration} min</Text>
                            </View>
                        }
                        {data.questionQuantity !== null &&
                            <View style={styles.content}>
                                <FontAwesome6 name="circle-question" size={12} color={COLORS.main} />
                                <Text style={styles.dataText}>{data.questionQuantity} {data.questionQuantity > 1 ? "questions" : "question"}</Text>
                            </View>
                        }
                    </View>
                    {role === 1 && data.dueDate !== null &&
                        <View style={styles.content}>
                            <FontAwesome6 name="calendar" size={12} color={COLORS.main} />
                            <Text style={styles.dataText}>Due: {formatDateTime(data.dueDate, true)}</Text>
                        </View>
                    }
                    <View>
                        {data.nameCourse && <Text style={styles.dataText}>Course: {data.nameCourse}</Text>}
                        {data.nameLecture && <Text style={styles.dataText}>Lecture: {data.nameLecture}</Text>}
                    </View>
                    {role === 2 && 
                        <View style={[styles.content, {justifyContent: "flex-end"}]}>
                            {data.isCompleted ?
                                <Tag label={"Submited at " + getTime(data.submittedDate)}/>                                
                            : data.dueDate !== null && (new Date(data.dueDate) < new Date() ) ?
                                <TagRed label={"Past due"}/>                    
                            : data.dueDate !== null ?
                                <TagMain30 label={"Due: " + formatDateTime(data.dueDate, true)}/>   
                            :""
                            }
                        </View>
                    }
                    {role === 1 && 
                        <View style={[styles.content, {justifyContent: "flex-end"}]}>
                            {(isPastDue || isDetail) &&
                                <TagNoColor label={data.isPublish ? "Publish" : "Unpublish"}/>
                            }
                            {data.isTest !== null && !isDetail &&
                                <TagNoColor label={data.isTest ? "Test" : "Exercise"}/>
                            }
                        </View>
                    }
                    {role === 0 && data.dueDate !== null &&
                        <TagNoColor label={"Due: " + formatDateTime(data.dueDate, true)}/>  
                    }
                </View>
            </TouchableOpacity>

            <Modal
                visible={longPress}
                transparent={true}
                animationType="fade"
            >
                <TouchableWithoutFeedback onPress={() => {
                    setLongPress(false)
                }}>
                    <View style={styles.modalWrapper}>
                        <View style={styles.container}>
                            <Text style={styles.title}>{data.assignmentTitle || data.title}</Text>
                            <View style={styles.wrapDetail}>
                                <View style={styles.content}>
                                    <Foundation name="page-edit" size={12} color={COLORS.main} />
                                    <Text style={styles.dataText}>{typeAssignment[data.assignmentType] || "Unknown"}</Text>
                                </View>
                                {data.duration !== 0 && data.duration !== null &&
                                    <View style={styles.content}>
                                        <Feather name="clock" size={11} color={COLORS.main} />
                                        <Text style={styles.dataText}>{data.duration} min</Text>
                                    </View>
                                }
                                {data.questionQuantity !== null &&
                                    <View style={styles.content}>
                                        <FontAwesome6 name="circle-question" size={12} color={COLORS.main} />
                                        <Text style={styles.dataText}>{data.questionQuantity} {data.questionQuantity > 1 ? "questions" : "question"}</Text>
                                    </View>
                                }
                            </View>
                            {data.dueDate !== null &&
                                <View style={styles.content}>
                                    <FontAwesome6 name="calendar" size={12} color={COLORS.main} />
                                    <Text style={styles.dataText}>Due: {formatDateTime(data.dueDate, true)}</Text>
                                </View>
                            }
                            <View>
                                {data.nameCourse && <Text style={styles.dataText}>Course: {data.nameCourse}</Text>}
                                {data.nameLecture && <Text style={styles.dataText}>Lecture: {data.nameLecture}</Text>}
                            </View>
                            <View style={[styles.content, {justifyContent: "flex-end"}]}>
                                {data.isPublish !== null && isPastDue &&
                                    <TagNoColor label={data.isPublish === 1 ? "Publish" : "Unpublish"}/>
                                }
                                {data.isTest !== null &&
                                    <TagNoColor label={data.isTest === 1 ? "Test" : "Exercise"}/>
                                }
                            </View>

                        </View>
                        <View style={styles.selectAsgm}>
                            {!data.isPublish &&
                                <>
                                    <TouchableOpacity style={[styles.btnSelectAsgm, {borderBottomWidth: 1}]} onPress={()=>handlePublish()}>
                                        <Text>Publish</Text>
                                        <MaterialIcons name="cloud-upload" size={24} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.btnSelectAsgm, {borderBottomWidth: 1}]} onPress={()=>handelEdit()}>
                                        <Text>Edit</Text>
                                        <Entypo name="edit" size={20} color="black" />
                                    </TouchableOpacity>
                                </>
                            }
                            <TouchableOpacity style={[styles.btnSelectAsgm, {borderBottomWidth: 1}]} onPress={()=>handelDuplicate()}>
                                <Text>Duplicate</Text>
                                <Ionicons name="duplicate" size={20} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSelectAsgm} onPress={()=>handleDeleteAsgm()}>
                                <Text>Delete</Text>
                                <MaterialIcons name="delete" size={20} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
    container: {
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "white",
    },
    containerNoBoder: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 4,
        marginBottom: 10,
        backgroundColor: COLORS.lightGray,
    },
    wrapContent:{
        gap: 2
    },
    title:{
        fontSize: 16,
        fontWeight: "bold"
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2, 
        minHeight: 13
    },
    dataText: {
        fontSize: 12,
        color: COLORS.stroke
    },
    circle: {
        height: 16,
        width: 16,
        borderRadius: 90,
    },
    wrapDetail:{
        flexDirection: "row",
        gap: 16
    },
    wrapFlex:{
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },

    modalWrapper: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },
    selectAsgm: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnSelectAsgm:{
        borderColor: COLORS.lightText,
        width: "100%",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.1)',
    },
})