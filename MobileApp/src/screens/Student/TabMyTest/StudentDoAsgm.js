import { ActivityIndicator, Alert, BackHandler, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AssignmentItemAnswerType, COLORS, commonStyles, typeAssignment } from "../../../utils/constants"
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ButtonGreen } from "../../../components/Button";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { getAssignmentInfo, getDetailAssignmentItemForStudent, submitManualAssignment, submitQuizAssignment } from "../../../services/assignment";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime, formatTime } from "../../../utils/utils";
import { RadioBtn, RadioView } from "../../../components/RadioBtn";
import CheckBox from "react-native-check-box";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';

export const StudentDoAsgm = ({route})=>{
    const navigation = useNavigation()
    const {idAssignment, assignmentType, initduration, isShufflingQuestion, isShufflingAnswer, dueDate, reload} = route?.params || null
    const [loading, setLoading] = useState(true);
    const {state} = useUser()
    const [selectFile, setSelectFile] = useState("")
    const [listQuestion, setListQuestion] = useState([])
    const [manualAnswer, setManualAnswer] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const numberItem = 3

    const [duration, setDuration] = useState(initduration*60);
    const [totalTime, setTotalTime] = useState(0);

    const handleSubmitQuiz = async()=>{
        setLoading(true)
        try {
            const listAnswers = listQuestion.map(question => {
                return{
                    idAssignmentItem: question.idAssignmentItem,
                    selectedOptions: question.items.filter(item => item.isCorrect === 1).map(item => item.idMultipleAssignmentItem)
                }
            })
            const result = {
                idAssignment: idAssignment,
                idStudent: state.idUser,
                duration: totalTime,
                assignmentResultStatus: dueDate ? (new Date() <= new Date(dueDate) ? 1 : 2) : 3 , //1: On time, 2: Late, 3: Submitted
                submittedDate: new Date(),
                answers: listAnswers
            }
            const response = await submitQuizAssignment(result)
            if(response){
                Alert.alert("Submit assignment", response)
                reload()
                navigation.goBack()
            } else{
                Alert.alert("Warning", "Please try again.")
            }
        } catch (error) {
            console.log("Error submit: ", error);
        } finally{
            setLoading(false)
        }
    }

    const handleSubmitManual = async()=>{
        console.log("zooo");
        setLoading(true)
        try {
            const result = {
                idAssignment: idAssignment,
                idStudent: state.idUser,
                duration: totalTime,
                assignmentResultStatus: dueDate ? (new Date() <= new Date(dueDate) ? 1 : 2) : 3 , //1: On time, 2: Late, 3: Submitted
                submittedDate: new Date(),
                answers: manualAnswer
            }
            const response = await submitManualAssignment(result)
            console.log("response: ", response);
            if(response){
                Alert.alert("Submit assignment", response)
                reload()
                navigation.goBack()
            } else{
                Alert.alert("Warning", "Please try again.")
            }
        } catch (error) {
            console.log("Error submit: ", error);
        } finally{
            setLoading(false)
        }
    }

    const handleSubmit = ()=>{
        Alert.alert(
            "Submit",
            "Are you sure you want to submit now? All your current answers will be submitted.",
            [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel",
                },
                { text: "Submit", onPress: () => {
                    if(assignmentType === 1){
                        handleSubmitManual()
                    }
                    if(assignmentType === 2){
                        handleSubmitQuiz()
                    }
                    navigation.goBack()
                } },
            ]
        );
    }

    useEffect(() => {
        if(duration === 0 && initduration){
            Alert.alert(
                "Submit",
                "Time is up, please submit your assignment.",
                [
                    { text: "Submit", onPress: () => {
                        if(assignmentType === 1){
                            handleSubmitManual()
                        }
                        if(assignmentType === 2){
                            handleSubmitQuiz()
                        }
                        navigation.goBack()
                    } },
                ]
            );
        } else if (duration > 0) {
            const timer = setInterval(() => {
                setDuration((prev) => prev - 1);
                setTotalTime((prev) => prev + 1)
            }, 1000);
            return () => clearInterval(timer);
        } else{
            const totalDuration = setInterval(() => {
                setTotalTime((prev) => prev + 1)
            }, 1000);
            return () => clearInterval(totalDuration);
        }
    }, [duration]);

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí
        }
        return array;
    }

    const getPageData = () => {
        return listQuestion.slice((currentPage-1) * numberItem, currentPage * numberItem);
    };

    const fetchDetailAsgm = async()=>{
        try {
            const response = await getDetailAssignmentItemForStudent(idAssignment)
            if(response){
                let shuffledResponse = response
                if(isShufflingQuestion){
                    shuffledResponse = shuffle(response)
                    // console.log(shuffledResponse);
                }
                if(assignmentType === 1){
                    setListQuestion(response)
                    setManualAnswer([...shuffledResponse.map(question =>{
                        return{
                            idAssignmentItem: question.idAssignmentItem,
                            answer: "",
                            attachedFile: ""
                        }
                    })])
                }
                if(assignmentType === 2){
                    setListQuestion([...shuffledResponse.map(question =>{
                        return{
                            ...question,
                            items: question.items.map(item=>{
                                return{
                                    ...item,
                                    isCorrect: 0
                                }
                            })
                        }
                    })])
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
        // console.log("idAssignment: ", idAssignment);
        fetchDetailAsgm()
    }, [])

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

    const getPagination = () => {
        const totalPages = Math.ceil(listQuestion.length / numberItem);
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
    
    useEffect(() => {
        const backAction = () => {
            Alert.alert(
                "Exit and Submit",
                "Are you sure you want to exit now? All your current answers will be submitted.",
                [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel",
                    },
                    { text: "Submit", onPress: () => {
                        if(typeAssignment === 1){
                            handleSubmitManual()
                        }
                        if(typeAssignment === 2){
                            handleSubmitQuiz()
                        }
                        navigation.goBack()
                    } },
                ]
            );
            return true; // Ngăn hành động mặc định (quay lại màn trước).
        };

        // Đăng ký sự kiện
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        // Gỡ bỏ sự kiện khi component bị unmount
        return () => backHandler.remove();
    }, []);

    const handleChangeChoice = (idAssignmentItem, idMultipleAssignmentItem, value)=>{
        let newQuestions = listQuestion.map((question) =>{
            if(question.idAssignmentItem === idAssignmentItem){
                let selectedCount = 0;
                const newItems = question.items.map((choice)=>{
                    if (choice.isCorrect === 1) {
                        selectedCount++;
                    }
                    if(choice.idMultipleAssignmentItem === idMultipleAssignmentItem){
                        return{
                            ...choice,
                            "isCorrect": value
                        }
                    }
                    if(value === 1 && question.isMultipleAnswer === 0){
                        return{
                            ...choice,
                            "isCorrect": 0
                        }
                    }
                    return choice
                })
                if (value === 1) {
                    selectedCount++; // Tăng số lượng đã chọn khi giá trị mới được đặt là 1
                }
    
                if (selectedCount > question.totalCorrect && question.isMultipleAnswer === 1) {
                    // Tìm và reset câu đầu tiên có isCorrect === 1 thành 0
                    for (let i = 0; i < newItems.length; i++) {
                        if (newItems[i].isCorrect === 1) {
                            newItems[i].isCorrect = 0;
                            break;
                        }
                    }
                }
                return{
                    ...question,
                    items: [...newItems]
                }
            }
            return question
        })
        setListQuestion(newQuestions)
    }     

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
    const uploadFile = async(idAssignmentItem)=>{
        const result = await pickFile()
        if(result){
            const updateAnswer = [...manualAnswer.map(answer =>{
                if(answer.idAssignmentItem === idAssignmentItem){
                    return{
                        ...answer,
                        attachedFile: {
                            uri: result.uri,
                            name: result.name,
                            type: result.mimeType 
                        }
                    }
                }
                return answer
            })]    
            setManualAnswer(updateAnswer)
        }

    }
    const textAnswer = (idAssignmentItem, value, field)=>{
        const updateAnswer = [...manualAnswer.map(answer =>{
            if(answer.idAssignmentItem === idAssignmentItem){
                return{
                    ...answer,
                    [field]: value
                }
            }
            return answer
        })]    
        setManualAnswer(updateAnswer)
    }
    return(
        <View style={styles.wrapContainer}>
            {(!loading && duration > 0) &&
                <View style={styles.wrapTime}>
                    <Text  style={styles.textTime}>{formatTime(duration)}</Text>
                </View>
            }
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.innerContent}>
                    {(assignmentType === 1 && listQuestion !== null) ? 
                        getPageData()?.map((question, indexQuestion) =>     
                            { const currentAnswer = manualAnswer.find(answer => answer.idAssignmentItem === question.idAssignmentItem)
                            return (
                            <View style={styles.wrapQuestion} key={question.idAssignmentItem}>
                                <View style={styles.headerQ}>
                                    <Text style={styles.title}>Question {indexQuestion + currentPage}</Text>
                                </View>
                                <Text style={styles.questionContent}>{question.question}</Text>
                                {question.attachedFile &&
                                    <View>
                                        <Text style={styles.textGray12}>Reference material:</Text>
                                        <TouchableOpacity style={styles.wrapFile} onPress={()=>openURL(question.attachedFile)}>
                                            <Text>{question.nameFile}</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                <View>
                                    <Text style={styles.textGray12}>Your answer:</Text>
                                    {question.assignmentItemAnswerType === 1 ?                                       
                                        <TextInput
                                            style={[styles.inputLabelGray]}
                                            placeholder="Your answer"
                                            multiline={true}
                                            value={currentAnswer.answer}
                                            onChangeText={(v)=>textAnswer(question.idAssignmentItem, v, "answer")}
                                        />
                                        :
                                        <>
                                        {currentAnswer.attachedFile ? 
                                            <View style={styles.wrapFile}>
                                                <TouchableOpacity style={{flex: 1}} onPress={()=>openURL(currentAnswer.attachedFile.uri)}>
                                                    <Text>{currentAnswer.attachedFile.name}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={()=>textAnswer(currentAnswer.idAssignmentItem, null, "attachedFile")} style={{margin: 4}}>
                                                    <MaterialIcons name="delete" size={18} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <TouchableOpacity onPress={()=>uploadFile(currentAnswer.idAssignmentItem)} style={[styles.btnText]}>
                                                <MaterialIcons name="upload-file" size={20} color="black" />
                                                <Text>Attach file</Text>
                                            </TouchableOpacity>
                                        }
                                        </>
                                    }
                                </View>
                            </View>)}
                        ) :""
                    }
                    {(assignmentType === 2 && listQuestion !== null) && 
                        getPageData()?.map((question, indexQuestion) =>     
                            <View style={styles.wrapQuestion} key={question.idAssignmentItem}> 
                                <View style={styles.headerQ}>
                                    <Text style={styles.title}>Question {indexQuestion + (currentPage - 1) * numberItem + 1}</Text>
                                </View>
                                <Text style={styles.questionContent}>{question.question}</Text>
                                {question.attachedFile && 
                                    <TouchableOpacity onPress={()=>setSelectFile(question.attachedFile)}>
                                        <Image source={{uri: question.attachedFile}} style={styles.questionImg}/>
                                    </TouchableOpacity>
                                }
                                <View>
                                    <Text style={styles.textGray12}>Choices: {question.isMultipleAnswer === 1 && "(Select exactly " + question.totalCorrect + " correct answers)"}</Text>
                                    {question.isMultipleAnswer === 0 ?
                                        question.items.map((item) => 
                                            <View style={styles.wrapFlex} key={item.idMultipleAssignmentItem}>
                                                <RadioBtn 
                                                    selected={item.isCorrect === 1 ? true : false} 
                                                    onPress={()=>handleChangeChoice(question.idAssignmentItem, item.idMultipleAssignmentItem, item.isCorrect === 1 ? 0 : 1)}
                                                />  
                                                <Text>{item.content}</Text>
                                            </View>
                                        )
                                        :
                                        question.items.map(item => 
                                            <View style={styles.wrapFlex} key={item.idMultipleAssignmentItem}>
                                                <CheckBox
                                                    isChecked={item.isCorrect === 1 ? true : false}
                                                    checkBoxColor={COLORS.secondMain}
                                                    onClick={()=>handleChangeChoice(question.idAssignmentItem, item.idMultipleAssignmentItem, item.isCorrect === 1 ? 0 : 1)}
                                                />
                                                <Text>{item.content}</Text>
                                            </View>
                                        )
                                    }
                                </View>
                            </View>
                        )
                    }  
                    
                    <TouchableOpacity style={styles.btn} onPress={()=>handleSubmit()}>
                        <Text style={styles.textWhite14}>Submit</Text>
                    </TouchableOpacity>
                    {/* paginage */}
                    <View style={styles.bottom}>
                        {getPagination().map(page => 
                            page !== "..." ? 
                            <TouchableOpacity 
                                style={[styles.wrapNumber, page === currentPage && {backgroundColor: COLORS.main}]} 
                                onPress={()=>setCurrentPage(page)}
                                key={page}
                            >
                                <Text style={[styles.bottomNumber, page === currentPage && {color: "white"}]}>{page}</Text>
                            </TouchableOpacity>
                            :
                            <View style={styles.wrapNumber} key={page}>
                                <Text style={styles.bottomNumber}>{page}</Text>
                            </View>
                        )}
                    </View>
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
        paddingVertical: 8
    },
    wrapQuestion:{
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        padding: 12,
        marginBottom: 8,
        gap: 4,
        backgroundColor: "white"
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
        marginVertical: 10
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
    inputLabelGray:{
        fontSize: 16,
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 4,
        minHeight: 100,
        textAlignVertical: "top"
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
    wrapTime:{
        ...commonStyles.shadow,
        position: "absolute",
        paddingHorizontal: 16,
        paddingVertical: 8,
        zIndex: 1,
        backgroundColor: COLORS.main30,
        borderRadius: 4,
        top: 16,
        right: 16
    },
    textTime:{
        fontSize: 16,
        fontWeight: "bold"
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
})