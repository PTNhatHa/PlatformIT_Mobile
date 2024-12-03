
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { AssignmentItemAnswerType, COLORS, commonStyles, typeAssignment } from "../../../utils/constants"
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ButtonGreen } from "../../../components/Button";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { getAssignmentInfo } from "../../../services/assignment";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime } from "../../../utils/utils";
import { RadioView } from "../../../components/RadioBtn";
import CheckBox from "react-native-check-box";

export const TeacherDetailAsgm = ({route})=>{
    const navigation = useNavigation()
    const {idAssignment, isPastDue, isCompleted} = route?.params || null
    console.log(idAssignment);
    const [loading, setLoading] = useState(true);
    const {state} = useUser()
    const [data, setData] = useState({})
    const [totalMark, setTotalMark] = useState(0)

    const [index, setIndex] = useState(1)

    const fetchDetailAsgm = async()=>{
        try {
            const response = await getAssignmentInfo(idAssignment)
            if(response){
                setData(response)
                const totalMark = response.assignmentItems?.reduce((total, item) => total + parseInt(item.mark) || 0, 0);
                setTotalMark(totalMark)
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
                        <View style={styles.container}>
                            <View>
                                <Text style={styles.title}>{data.title}</Text>
                                <View style={styles.wrapFlex}>
                                    <Text style={styles.textBBlack12}>{data.assignmentItems?.length} {data.assignmentItems?.length > 1 ? "questions" : "question"}</Text>
                                    <Octicons name="dot-fill" size={10} color="black" />
                                    <Text style={styles.textBBlack12}>{totalMark} {totalMark > 1 ? "marks" : "mark"}</Text>
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
                        </View>
                        <View style={styles.nav}>
                            <TouchableOpacity onPress={()=>setIndex(1)}>
                                <Text style={index === 1 ? styles.navTextActive : styles.navText}>Questions</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setIndex(2)}>
                                <Text style={index === 2 ? styles.navTextActive : styles.navText}>Overview</Text>
                            </TouchableOpacity>                            
                        </View>
                        {index === 1 ?
                            <View style={styles.innerContent}>
                                {data.assignmentType === 1 ? 
                                    data.assignmentItems.map((question, index) =>     
                                        <View style={styles.wrapQuestion} key={question.idAssignmentItem}>
                                            <View style={styles.headerQ}>
                                                <Text style={styles.title}>Question {index + 1}</Text>
                                                <Text style={styles.textGray12}>{question.mark} {question.mark > 1 ? "marks" : "mark"}</Text>
                                            </View>
                                            <Text style={styles.questionContent}>{question.question}</Text>
                                            {question.attachedFile &&
                                                <View>
                                                    <Text style={styles.textGray12}>Reference material:</Text>
                                                    <TouchableOpacity style={styles.wrapFile}>
                                                        <Text>{question.nameFile}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                            <View style={styles.wrapFlex}>
                                                <Text style={styles.textGray12}>Type of answer:</Text>
                                                <Text style={styles.textBlack12}>{AssignmentItemAnswerType[question.assignmentItemAnswerType]}</Text>
                                            </View>
                                        </View>
                                    ) :""
                                }
                                {data.assignmentType === 2 && 
                                    data.assignmentItems.map((question, index) =>     
                                        <View style={styles.wrapQuestion} key={question.idAssignmentItem}> 
                                            <View style={styles.headerQ}>
                                                <Text style={styles.title}>Question {index + 1}</Text>
                                                <Text style={styles.textGray12}>{question.mark} {question.mark > 1 ? "marks" : "mark"}</Text>
                                            </View>
                                            <Text style={styles.questionContent}>{question.question}</Text>
                                            {question.attachedFile && 
                                                <TouchableOpacity>
                                                    <Image source={question.attachedFile} style={styles.questionImg}/>
                                                </TouchableOpacity>
                                            }
                                            <View>
                                                <Text style={styles.textGray12}>Choices:</Text>
                                                {question.isMultipleAnswer === 0 ?
                                                    question.items.map(item => 
                                                        <View style={styles.wrapFlex} key={item.idMultipleAssignmentItem}>
                                                            <RadioView selected={item.isCorrect}/>  
                                                            <Text>{item.content}</Text>
                                                        </View>
                                                    )
                                                    :
                                                    question.items.map(item => 
                                                        <View style={styles.wrapFlex} key={item.idMultipleAssignmentItem}>
                                                            <CheckBox
                                                                isChecked={item.isCorrect}
                                                                checkBoxColor={COLORS.secondMain}
                                                                onClick={()=>{}}
                                                            />
                                                            <Text>{item.content}</Text>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        </View>
                                    )
                                }                                
                            </View>
                            :
                            <>
                            
                            </>
                        }
                        
                    </View>
            </ScrollView>
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            } 
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
    wrapContent:{
        ...commonStyles.shadow,
        backgroundColor: "white",
        borderRadius: 8,
        gap: 8
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
    textGray12:{
        fontSize: 12,
        color: COLORS.stroke,
    },
    textBlack12:{
        fontSize: 12,
        color: "black",
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
    innerContent:{
        paddingHorizontal: 16
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
    wrapFile:{
        fontSize: 16,
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    questionImg:{
        backgroundColor: COLORS.lightGray,
        width: "100%",
        height: 200,
        resizeMode: 'contain',
    },
})