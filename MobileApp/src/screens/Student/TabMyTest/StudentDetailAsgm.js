import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles, typeAssignment } from "../../../utils/constants"
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ButtonGreen } from "../../../components/Button";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { getAssignmentInfo, getDetailAssignmentForStudent, getQuizAnswer } from "../../../services/assignment";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime, formatTime } from "../../../utils/utils";
import { RadioView } from "../../../components/RadioBtn";
import CheckBox from "react-native-check-box";

export const StudentDetailAsgm = ({route})=>{
    const navigation = useNavigation()
    const {idAssignment, isPastDue, isCompleted} = route?.params || null
    const [loading, setLoading] = useState(true);
    const {state} = useUser()
    const [data, setData] = useState({})

    const [listQuestion, setListQuestion] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const numberItem = 2
    const [selectFile, setSelectFile] = useState("")
    const [isShowAnswer, setIsShowAnswer] = useState(false)

    const fetchDetailAsgm = async()=>{
        try {
            const response = await getDetailAssignmentForStudent(idAssignment, state.idUser)
            if(response){
                setData(response)
                if(true){
                    const answers = await getQuizAnswer(idAssignment, state.idUser)
                    if(answers){
                        setListQuestion([...answers.map(question => {
                            return{
                                ...question,
                                items: question.items.map(item => {
                                    return{
                                        ...item,
                                        isSelected: question.selectedOptions.includes(item.idMultipleAssignmentItem),
                                        isCorect: question.correctOptions.includes(item.idMultipleAssignmentItem),
                                    }
                                })
                            }
                        })])
                    }
                }
            } else {
                Alert.alert("Error", "Please try again")
                navigation.goBack()
            }
        } catch (error) {
            console.log("Error fetch data: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchDetailAsgm()
    }, [])

    const getPagination = () => {
        const totalPages = Math.ceil(listQuestion.length / numberItem)
        if (totalPages <= 5) {
        // Show all pages if there are 5 or fewer
        return Array.from({ length: totalPages }, (_, index) => index + 1);
        } else {
        // Logic for more than 5 pages
        if (currentPage <= 3) {
            // Show first few pages if current page is near the start
            return [1, 2, 3, 4, "...", totalPages];
        } else if (currentPage >= totalPages - 2) {
            // Show last few pages if current page is near the end
            return [
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        } else {
            // Show current page in the middle with surrounding pages
            return [
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages,
            ];
        }
        }
    }

    const getPageData = () => {
        return listQuestion.slice((currentPage-1) * numberItem, currentPage * numberItem);
    };

    const handleStartAsgm = ()=>{
        Alert.alert(
            "Confirm Start Assignment",
            "Are you sure you want to start this assignment?",
            [
                {
                    text: "Yes",
                    onPress: ()=> {
                        navigation.navigate("Do Assignment", {
                            idAssignment: idAssignment,
                            assignmentType: data.assignmentType,
                            initduration: data.duration,
                            isShufflingQuestion: data.isShufflingQuestion === 1 ? true : false,
                            isShufflingAnswer: data.isShufflingAnswer === 1 ? true : false,
                            dueDate: data.dueDate || data.courseEndDate || null,
                            reload: fetchDetailAsgm
                        })
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
        <View style={styles.wrapContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.wrapDetail}>
                        <Text style={styles.title}>{data?.courseTitle}</Text>
                        {data.isTest !== 1 &&
                            <>
                                <View style={styles.wrapFlex}>
                                    <AntDesign name="right" size={12} color="black" />
                                    <Text style={styles.textBlack16}>{data.nameSection}</Text>
                                </View>
                                <View style={styles.wrapFlex}>
                                    <AntDesign name="right" size={12} color="black" />
                                    <Text style={styles.textBlack16}>{data.nameLecture}</Text>
                                </View>
                            </>
                        }
                    </View>
                    <View style={styles.wrapContent}>
                        <View style={styles.containerInner}>
                            <View>
                                <Text style={styles.title}>{data.title}</Text>
                                <View style={styles.wrapFlex}>
                                    <Octicons name="dot-fill" size={10} color="black" />
                                    <Text style={styles.textBBlack12}>{data.questionQuantity} {data.questionQuantity > 1 ? "questions" : "question"}</Text>
                                </View>
                            </View>
                            <View style={styles.wrapDetail}>
                                <View style={styles.wrapFlex}>
                                    <Text style={styles.textGray16}>Type</Text>
                                    <Text style={styles.textBlack16}>{typeAssignment[data.assignmentType]}</Text>
                                </View>
                                {data.duration > 0 &&
                                    <View style={styles.wrapFlex}>
                                        <Text style={styles.textGray16}>Duration</Text>
                                        <Text style={styles.textBlack16}>{data.duration} minutes</Text>
                                    </View>
                                }
                                {data.startDate &&
                                    <>
                                        <View style={styles.wrapFlex}>
                                            <Text style={styles.textGray16}>Start date</Text>
                                            <Text style={styles.textBlack16}>{formatDateTime(data.startDate, true)}</Text>
                                        </View>
                                        <View style={styles.wrapFlex}>
                                            <Text style={styles.textGray16}>End date</Text>
                                            <Text style={styles.textBlack16}>{formatDateTime(data.dueDate, true)}</Text>
                                        </View>
                                    </>
                                }
                            </View>
                            {data.submittedDate === null && new Date() <= new Date(data.dueDate || data.courseEndDate) &&
                                <TouchableOpacity style={styles.btn} onPress={()=>handleStartAsgm()}>
                                    <Text style={styles.textWhite14}>Start</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        {data.submittedDate !== null &&
                            <>
                                <View style={styles.line}/>
                                {/* Detail result */}
                                <View style={styles.containerInner}>
                                    <View style={styles.wrapFlex}>
                                        <Text style={styles.textGray16}>Submitted at</Text>
                                        <Text style={styles.textBlack16}>{formatDateTime(data.submittedDate, true)}</Text>
                                    </View>
                                    <View style={styles.wrapFlex}>
                                        <Text style={styles.textGray16}>Status</Text>
                                        {data.resultStatus === 1 ?
                                            <Text style={[styles.boxStatus, styles.boxGreen]}>On time</Text>
                                            :
                                            <Text style={[styles.boxStatus, styles.boxYellow]}>Late</Text>
                                        }
                                    </View>
                                    <View style={styles.wrapFlex}>
                                        <Text style={styles.textGray16}>Marks</Text>
                                        <Text style={styles.textBlack16}>{data.totalMark}</Text>
                                    </View>
                                    <View style={styles.wrapFlex}>
                                        <Text style={styles.textGray16}>Duration</Text>
                                        <Text style={styles.textBlack16}>{formatTime(data.resultDuration)} minutes</Text>
                                    </View>   
                                </View>
                                {data.showAnswer === 1 &&
                                    <View style={styles.containerInner}>
                                        <TouchableOpacity style={styles.btn} onPress={()=>setIsShowAnswer(!isShowAnswer)}>
                                            <Text style={styles.textWhite14}>{isShowAnswer ? "Hide my answer" : "Show my answer"}</Text>
                                        </TouchableOpacity>  
                                    </View>
                                }                            
                                {isShowAnswer &&
                                    <View style={styles.containerInner}>
                                        {/* Answers */}
                                        {(data.assignmentType === 2 && listQuestion !== null) && 
                                            getPageData()?.map((question, index) =>     
                                                <View style={styles.wrapQuestion} key={question.idAssignmentItem}> 
                                                    <View style={styles.headerQ}>
                                                        <Text style={styles.title}>Question {index + (currentPage - 1) * numberItem + 1}</Text>
                                                        <Text style={styles.textGray12}>{question.studentMark}/{question.questionMark} mark</Text>
                                                    </View>
                                                    <Text style={styles.questionContent}>{question.question}</Text>
                                                    {question.attachedFile && 
                                                        <TouchableOpacity onPress={()=>setSelectFile(question.attachedFile)}>
                                                            <Image source={{uri: question.attachedFile}} style={styles.questionImg}/>
                                                        </TouchableOpacity>
                                                    }
                                                    <View>
                                                        <Text style={styles.textGray12}>Choices:</Text>
                                                        {question.isMultipleAnswer === 0 ?
                                                            question.items.map(item => 
                                                                <View style={styles.wrapFlex} key={item.idMultipleAssignmentItem}>
                                                                    <RadioView selected={item.isSelected}/>  
                                                                    <Text style={item.isCorect ? styles.boxColorGreen : (item.isSelected && !item.isCorect) ? styles.boxColorRed : ""}>{item.content}</Text>
                                                                </View>
                                                            )
                                                            :
                                                            question.items.map(item => 
                                                                <View style={styles.wrapFlex} key={item.idMultipleAssignmentItem}>
                                                                    <CheckBox
                                                                        isChecked={item.isSelected}
                                                                        checkBoxColor={COLORS.secondMain}
                                                                        onClick={()=>{}}
                                                                    />
                                                                    <Text style={item.isCorect ? styles.boxColorGreen : (item.isSelected && !item.isCorect) ? styles.boxColorRed : ""}>{item.content}</Text>
                                                                </View>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            )
                                        }  
                                        
                                        {/* paginage */}
                                        <View style={styles.bottom}>
                                            {getPagination().map((page, index) => 
                                                page !== "..." ? 
                                                <TouchableOpacity 
                                                    style={[styles.wrapNumber, page === currentPage && {backgroundColor: COLORS.main}]} 
                                                    onPress={()=>setCurrentPage(page)}
                                                    key={index}
                                                >
                                                    <Text style={[styles.bottomNumber, page === currentPage && {color: "white"}]}>{page}</Text>
                                                </TouchableOpacity>
                                                :
                                                <View style={styles.wrapNumber} key={index}>
                                                    <Text style={styles.bottomNumber}>{page}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                }
                            </>
                        }
                    </View>
            </ScrollView>
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            } 
            <Modal
                visible={!!selectFile}
                transparent={true}
                animationType="fade"
                onRequestClose={()=>setSelectFile("")}
            >
                <View style={styles.selectImgWrapper}>
                    <TouchableOpacity style={styles.close} onPress={()=>setSelectFile("")}>
                        <AntDesign name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <Image source={{uri: selectFile}} style={styles.selectImg}/>
                </View>
            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    wrapContainer:{
        backgroundColor: "#FAFAFA",
        flex: 1
    },
    container:{
        padding: 16,
    },
    containerInner:{
        paddingHorizontal: 16,
        paddingVertical: 4
    },
    wrapContent:{
        ...commonStyles.shadow,
        backgroundColor: "white",
        borderRadius: 8,
        gap: 8,
        paddingVertical: 16
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    textBBlack12:{
        fontSize: 12,
        fontWeight: "bold"
    },
    textBlack16:{
        fontSize: 16,
    },
    textGray16:{
        fontSize: 16,
        color: COLORS.stroke,
        minWidth: 100
    },
    wrapFlex:{
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    wrapDetail:{
        marginVertical: 4,
    },
    btn:{
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        flex: 1,
        alignItems: "center",
        backgroundColor: COLORS.main
    },
    textWhite14:{
        fontSize: 14,
        color: "white",
        fontWeight: "bold"
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    line:{
        height: 1,
        backgroundColor: COLORS.lightText
    },
    boxStatus:{
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    boxGreen: {
        backgroundColor: "#14AE5C",
    },
    boxYellow: {
        backgroundColor: "#FFCC00",
    },

    wrapQuestion:{
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        padding: 8,
        marginBottom: 8,
        gap: 4
    },
    headerQ:{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        justifyContent: "space-between"
    },
    questionContent:{
        fontSize: 16,
        fontWeight: "500"
    },
    questionImg:{
        backgroundColor: COLORS.lightGray,
        width: "100%",
        height: 200,
        resizeMode: 'contain',
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
    bottom: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        margin: 10
    },
    bottomNumber:{
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },
    wrapNumber:{
        width: 32,
        height: 32,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    textGray12:{
        fontSize: 12,
        color: COLORS.stroke,
    },
    boxColorGreen:{
        backgroundColor: "#B2E0C8",
        flex: 1,
        borderRadius: 2
    },
    boxColorRed:{
        backgroundColor: "#E6B1B0",
        flex: 1,
        borderRadius: 2
    },
})