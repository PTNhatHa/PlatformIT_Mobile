import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { COLORS, commonStyles, typeAssignment } from "../../../utils/constants"
import { SelectCourseBox, TextInputLabelGray, TextInputSelectBox, TextInputSelectDate } from "../../../components/TextInputField"
import CheckBox from "react-native-check-box"
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllActiveCourseOfTeacher, getAllActiveSectionOfCourse } from "../../../services/course"
import { useUser } from "../../../contexts/UserContext"
import { getAllActiveLecturesOfCourse } from "../../../services/lecture"
import Entypo from '@expo/vector-icons/Entypo';
import * as DocumentPicker from 'expo-document-picker';
import { createManualAssignment, createQuizAssignment, deleteAssignment, getAssignmentInfo, updateAssignment } from "../../../services/assignment"
import { useNavigation } from "@react-navigation/native"
import { CustomSwitch } from "../../../components/CustomSwitch"
import { RadioBtn } from "../../../components/RadioBtn"
import { formatDateTime, getFileTypeFromUrl, getMimeType } from "../../../utils/utils"
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';

export const TeacherAsgmCreate = ({route})=>{
    const {idCourse, nameCourse, isLimitedTime, courseEndDate, idSection, nameSection, idLecture, nameLecture, reload} = route?.params || {}
    const idAssignment = route?.params?.idAssignment || null
    const isEdit = route?.params?.isEdit || false
    const [detailAsgm, setDetailAsgm] = useState([])

    const {state} = useUser()
    const navigation = useNavigation()
    const [selectBtn, setSelectBtn] = useState(0)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);

    const [isExercise, setIsExercise] = useState(idLecture ? true : false)
    const [titleAsgm, setTitleAsgm] = useState("")
    const [selectCourse, setSelectCourse] = useState(idCourse ? {
        value: idCourse,
        label: nameCourse,
        isLimitedTime: isLimitedTime,
        courseEndDate: courseEndDate,
    } : "")
    const [selectSection, setSelectSection] = useState(idSection ? {
        value: idSection,
        label: nameSection
    }: "")
    const [selectLecture, setSelectLecture] = useState(idLecture ? {
        value: idLecture,
        label: nameLecture
    }: "")
    const [type, setType] = useState(null)
    const [duration, setDuration] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")

    const [isShufflingQuestion, setIsShufflingQuestion] = useState(false)
    const [isShufflingAnswer, setIsShufflingAnswer] = useState(false)
    const [isShowAnswer, setIsShowAnswer] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)

    const [questions, setQuestions] = useState([])
    const [totalMark, setTotalMark] = useState(0)
    const [totalQuestion, setTotalQuestion] = useState(0)

    const [listCourses, setListCourses] = useState([])
    const [listSections, setListSections] = useState([])
    const [listLectures, setListLectures] = useState([])
    const [listCurrentLectures, setListCurrentLectures] = useState([])
    const typeUnlimit = [
        { label: "Quiz", value: 2 },
        { label: "Code", value: 3 },
    ]
    const typeLimit = [
        { label: "Manual", value: 1 },
        { label: "Quiz", value: 2 },
        { label: "Code", value: 3 },
    ]
    const typeOfAnswer = [
        { label: "Text", value: 1 },
        { label: "Attach file", value: 2 },
    ]
    const [questionCode, setQuestionCode] = useState({
        problem: "",
        language: 1,
        example: [
            {
                input: "a",
                output: "1"
            },
            {
                input: "b",
                output: "2"
            },
        ],
        testCase: [
            {
                input: "aa",
                output: "11"
            },
            {
                input: "bb",
                output: "22"
            },
        ],
        isPastTestCase: true,
        isLimitTime: false,
        limitTime: 2,
        isLimitMemory: true,
        limitMemory: 0.2,
        isShowOnSubmission: false
    })
    const [teacherCode, setTeacherCode] = useState({
        code: "",
        language: 1,
        testCase: [
            {
                input: "",
                output: ""
            },
        ],
        isPastTestCase: true,
        isLimitTime: false,
        limitTime: 2,
        isLimitMemory: false,
        limitMemory: 0.2,
    })
    

    const fetchAsgm = async()=>{
        setLoading(true)
        try {
            const response = await getAssignmentInfo(idAssignment)
            if(response){
                // console.log("response: ", response);
                setTitleAsgm(response.title + " (Duplicate)")
                if(isEdit === true){
                    setTitleAsgm(response.title)
                    setDetailAsgm(response)
                    setSelectCourse({
                        value: response.idCourse,
                        label: response.courseTitle,
                        isLimitedTime: response.isLimitedTime,
                        courseStartDate: response.courseStartDate,
                        courseEndDate: response.courseEndDate
                    })
                    setSelectSection({
                        value: response.idSection || "",
                        label: response.nameSection || ""
                    })
                    setSelectLecture({
                        value: response.idLecture || "",
                        label: response.nameLecture || ""
                    })
                }
                setIsExercise(response.isTest === 1 ? false : true)
                setStartDate(response.startDate || "")
                setDueDate(response.dueDate || "")
                setDuration(response.duration?.toString() || "")
                setType({
                    label: typeAssignment[response.assignmentType], 
                    value: response.assignmentType
                })
                setIsShufflingQuestion(response.isShufflingQuestion ? false : true)
                setIsShufflingAnswer(response.isShufflingAnswer ? false : true)
                setIsShowAnswer(response.showAnswer ? false : true)
                setQuestions([...response.assignmentItems?.map(question=>{
                    let realQuestion
                    if(response.assignmentType === 1){
                        // Manual
                        realQuestion = {
                            ...question,
                            mark: question.mark.toString(),
                            attachedFile: question.attachedFile !== null && {
                                uri: question.attachedFile,
                                name: question.nameFile,
                                type: getMimeType(question.attachedFile)
                            },
                            isDeletedFile: 0,
                        }
                    }
                    if(response.assignmentType === 2){
                        // Quiz
                        const listItems = question.items.map(item=>{
                            return{
                                ...item,
                                isCorrect: item.isCorrect === 0 ? false : true
                            }
                        })
                        realQuestion = {
                            ...question,
                            mark: question.mark.toString(),
                            attachedFile: question.attachedFile !== null && {
                                uri: question.attachedFile,
                                name: question.nameFile,
                                type: getMimeType(question.attachedFile)
                            },
                            isDeletedFile: 0,
                            isMultipleAnswer: question.isMultipleAnswer === 0 ? false : true,
                            items: listItems
                        }
                    }
                    // console.log(realQuestion);
                    return realQuestion
                })] || [])
                const totalMark = response.assignmentItems?.reduce((total, item) => total + parseInt(item.mark) || 0, 0);
                setTotalMark(totalMark)
                setTotalQuestion(response.assignmentItems.length)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        const getAllCourse = async()=>{
            try {
                const response = await getAllActiveCourseOfTeacher(state.idUser)
                setListCourses([...response?.map(item=>{
                    return{
                        value: item.idCourse,
                        label: item.courseTitle,
                        isLimitedTime: item.isLimitedTime,
                        courseStartDate: item.courseStartDate,
                        courseEndDate: item.courseEndDate
                    }
                })])
            } catch (error) {
                console.log("Error getAllCourse: ", error);
            }
        }
        if(!idCourse){
            if(!isEdit){
                getAllCourse()
            }
            if(idAssignment){
                fetchAsgm()
            }
        }
    }, [])

    useEffect(()=>{
        const getAllSection = async()=>{
            try {
                if(selectCourse){
                    const response = await getAllActiveSectionOfCourse(selectCourse.value)
                    setListSections([...response?.map(item=>{
                        return{
                            value: item.idSection,
                            label: item.title,
                        }
                    })])
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        }
        const getAllLecture = async()=>{
            try {
                if(selectCourse){
                    const response = await getAllActiveLecturesOfCourse(selectCourse.value)
                    setListLectures([...response?.map(item=>{
                        return{
                            value: item.idLecture,
                            label: item.titleLecture,
                            idSection: item.idSection,
                            titleSection: item.titleSection
                        }
                    })])
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        }
        if(!idCourse){
            if(type && type?.value === 1 && selectCourse.isLimitedTime !== 1){
                setType(null)
                setQuestions([])
            }
            getAllSection()
            getAllLecture()
            if(!isEdit){
                setSelectSection(null)
                setSelectLecture(null)
            }
            if(selectCourse && selectCourse.isLimitedTime !== 1) setIsExercise(true)
        }
    }, [selectCourse])

    useEffect(()=>{
        if(selectSection && isEdit === false){
            const current = listLectures.filter(item => item.idSection === selectSection.value)
            setListCurrentLectures(current)
        }
        if(!isEdit && !idLecture){
            setSelectLecture(null)
        }
    }, [selectSection])

    useEffect(()=>{
        if(startDate && dueDate){
            if(new Date(startDate) >= new Date(dueDate)){
                setError("The start date must be before the due date.")
            } else {
                setError(null)
            }
        }
        if(dueDate !== null && new Date(dueDate) > new Date(selectCourse.courseEndDate)){
            setError("The due date must be before " + formatDateTime(selectCourse.courseEndDate) + " (the course end date).")
        }
    }, [startDate, dueDate])

    const handleChangeType = (v)=>{
        setType(v)
        setQuestions([])
        setTotalQuestion(0)
    }

    useEffect(()=>{
        setError(null)
    }, [titleAsgm, selectCourse, selectSection, selectLecture, type])

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
    const handleChangeQuestion = (v, index, field)=>{
        const newList = questions.map((item, i) =>{
            if(isEdit && field === "attachedFile" && i === index && v === null){
                return{
                    ...item,
                    [field]: v,
                    isDeletedFile: 1
                }
            }
            if(i === index){
                return{
                    ...item,
                    [field]: v
                }
            }
            return item
        })
        if(field === "mark"){
            const totalMark = newList?.reduce((total, item) => total + parseInt(item.mark) || 0, 0);
            setTotalMark(totalMark)
        }
        setQuestions(newList)
    }
    const handleChangeQuestionMaterial = async(index, type = "*")=>{
        const result = await pickFile(type)
        if(result){
            handleChangeQuestion({
                uri: result.uri,
                name: result.name,
                type: result.mimeType 
            }, index, "attachedFile")
        }
    }
    const addQuestion = ()=>{
        if(!type){
            setError("Please choose a type first.")
            return
        }
        if(type?.value === 1){
            setQuestions([...questions, {
                question: null,
                mark: 0,
                assignmentItemAnswerType: 1,
                attachedFile: "",
                assignmentItemStatus: 1
            }])
        }
        if(type?.value === 2){
            setQuestions([...questions, {
                question: null,
                mark: 0,
                explanation: "",
                isMultipleAnswer: false,
                attachedFile: "",
                items: [],
                assignmentItemStatus: 1
            }])
        }
        setTotalQuestion(totalQuestion + 1)
    }
    const addNewChoice = (i)=>{
        const newList = questions.map((question, index) => {
            if(index === i){
                return{
                    ...question,
                    items: [
                        ...question.items,
                        {
                            content: null,
                            isCorrect: false,
                            multipleAssignmentItemStatus: 1
                        }
                    ]
                }
            }
            return question
        })
        setQuestions(newList)
    }
    const deleteQuestion = (index, idAssignmentItem = null)=>{
        let newQuestions 
        if(isEdit && idAssignmentItem){
            // console.log("zoo", idAssignmentItem);
            newQuestions = questions.map((item, i) => {
                if(i === index){
                    setTotalMark(totalMark - item.mark)
                    return{
                        ...item,
                        assignmentItemStatus: 0,
                    }
                }
                return item
            })
        } else{
            newQuestions = questions.filter((item, i) => i !==index)
        }
        setQuestions(newQuestions)
        setTotalQuestion(totalQuestion - 1)
    }
    const deleteChoice = (indexQuestion, indexChoice)=>{
        let newQuestions
        if(isEdit){
            newQuestions = questions.map((question, i) => {
                if(i === indexQuestion){
                    const newItems = question.items.map((choice, ichoice) => {
                        if(ichoice === indexChoice){
                            return{
                                ...choice,
                                multipleAssignmentItemStatus: 0
                            }
                        }
                        return choice
                    })
                    return{
                        ...question,
                        items: [...newItems]
                    }
                }
                return question
            })
        } else{
            newQuestions = questions.map((question, i) => {
                if(i === indexQuestion){
                    const newItems = question.items.filter((choice, ichoice) => ichoice !== indexChoice)
                    return{
                        ...question,
                        items: [...newItems]
                    }
                }
                return question
            })
        }
        setQuestions(newQuestions)
    }
    const handleChangeChoice = (indexQuestion, indexChoice, field, value)=>{
        const newQuestions = questions.map((question, i) => {
            if(i === indexQuestion){
                const newItems = question.items.map((choice, iChoice)=>{
                    if(iChoice === indexChoice){
                        return{
                            ...choice,
                            [field]: value
                        }
                    }
                    if(field === "isCorrect" && value === true && question.isMultipleAnswer === false){
                        return{
                            ...choice,
                            "isCorrect": false
                        }
                    }
                    return choice
                })
                return{
                    ...question,
                    items: [...newItems]
                }
            }
            return question
        })
        setQuestions(newQuestions)
    }
    const changeIsMultipleAnswer = (indexQ)=>{
        const newQuestions = questions.map((question, i) => {
            if(i === indexQ){
                const newItems = question.items.map((choice)=>{
                    return{
                        ...choice,
                        "isCorrect": false
                    }
                })
                return{
                    ...question,
                    isMultipleAnswer: !question.isMultipleAnswer,
                    items: [...newItems]
                }
            }
            return question
        })
        setQuestions(newQuestions)
    }

    const handleCreateAsgm = (isPublish)=>{
        setError(!titleAsgm || !selectCourse || !type)
        if(!titleAsgm || !selectCourse || !type){
            setError("Fill all *")
            return
        }
        if(isExercise){
            if(!selectSection || !selectLecture){
                setError("Fill all *")
                return
            }
        }
        if(startDate || dueDate){
            if(!startDate){
                setError("Please select a start date if you have chosen a due date.")
                return
            }
            if(!dueDate){
                setError("Please select a due date if you have chosen a start date.")
                return
            }
            }
        if(questions?.length === 0){
            setError("You need to add at least 1 question.")
            return
        }
        const check = questions.find(item => item.assignmentItemStatus !== 0 && (item.question === null || item.items?.length === 0 || item.mark === 0))
        if(check){
            setError("You need to fill all question.")
            return
        }

        if(type.value === 2){
            const checkItemContent = questions.every(question => {
                if (question.assignmentItemStatus !== 0) {
                    return question.items?.some(item => item.content === null || item.content === "");
                }
                return false;
            });
            if(checkItemContent){
                setError("You must fill all the choices")
                return
            }
            const checkIsCorrect = questions.every(question => {
                if(question.assignmentItemStatus !== 0){
                    return question.items?.some(item => item.isCorrect)
                }
                return true
              });
            if(!checkIsCorrect){
                setError("You must provide at least one choice for each question.")
                return
            }
        }

        let textStatus = "create"
        if(isEdit) textStatus = "update"
        if(isPublish){
            textStatus = "create and publish"
            if(isEdit) textStatus = "update and publish"
        }
        textStatus += " this " + type.label
        if(isExercise){
            textStatus += " exercise"
        } else {
            textStatus += " test"
        }
        if(totalQuestion > 1){
            textStatus += " with " + totalQuestion + " questions?"
        } else {
            textStatus += " with " +  totalQuestion + " question?"
        }
        
        Alert.alert(
            "Confirm Create Assignment",
            "Are you sure you want to " + textStatus,
            [
                {
                    text: "Yes",
                    onPress: ()=> {
                        postAsgm(isPublish)
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
    const postAsgm = async(isPublish)=>{
        setLoading(true)
        try {
            let response = null
            if(isEdit){
                const editData = {
                    idAssignment: detailAsgm.idAssignment,
                    title: titleAsgm,
                    isTest: detailAsgm.isTest,
                    startDate: startDate || "",
                    dueDate: dueDate || "",
                    duration: duration || 0,
                    assignmentType: detailAsgm.assignmentType,
                    isPublish: isPublish,
                    isShufflingQuestion: isShufflingQuestion ? 1 : 0,
                    isShufflingAnswer: isShufflingAnswer ? 1 : 0,
                    showAnswer: isShowAnswer ? 1 : 0,
                    assignmentStatus: detailAsgm.assignmentStatus,
                    assignmentItems: questions.map(asgmItem => {
                        return{
                            idAssignmentItem: asgmItem.idAssignmentItem || "",
                            question: asgmItem.question,
                            mark: asgmItem.mark,                            
                            explanation: (asgmItem.explanation === null || asgmItem.explanation === "null") ? "" : asgmItem.explanation ,
                            isMultipleAnswer: asgmItem.isMultipleAnswer === true ? 1 : 0,
                            attachedFile: asgmItem.attachedFile || "",
                            isDeletedFile: (asgmItem.attachedFile === null && asgmItem.isDeletedFile === 1) ? 1 : 0,
                            assignmentItemAnswerType: asgmItem.assignmentItemAnswerType || "",
                            assignmentItemStatus: asgmItem.assignmentItemStatus,
                            items: asgmItem.items?.map(item => {
                                return{
                                    idMultipleAssignmentItem: item.idMultipleAssignmentItem || "",
                                    content: item.content,
                                    isCorrect: item.isCorrect === true ? 1 : 0,
                                    multipleAssignmentItemStatus: item.multipleAssignmentItemStatus
                                }
                            }) || []
                        }
                    })
                }
                response = await updateAssignment(state.idUser, editData)
            } else{
                if(type.value === 1){
                    response = await createManualAssignment(
                        titleAsgm, selectCourse.value, isExercise ? 0 : 1, selectLecture?.value || "", startDate, dueDate,
                        duration, type.value, isPublish, isShufflingQuestion ? 1 : 0, questions, state.idUser
                    )
                }
                if(type.value === 2){
                    response = await createQuizAssignment(
                        titleAsgm, selectCourse.value, isExercise ? 0 : 1, selectLecture?.value || "", startDate, dueDate,
                        duration, type.value, isPublish, isShufflingQuestion ? 1 : 0, isShufflingAnswer ? 1 : 0, isShowAnswer ? 1 : 0,
                        questions, state.idUser
                    )
                }
            }
            if(response){
                Alert.alert("Done", response)
                reload()
                navigation.goBack()
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
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

    const deleteAsgm = async()=>{
        setLoading(true)
        try {
            const response = await deleteAssignment(idAssignment, state.idUser)
            if(response){
                Alert.alert("Delete", response)
                reload()
                navigation.goBack()
            } else {
                Alert.alert("Error", "Please try again.")
            }
        } catch (error) {
            
        } finally{
            setLoading(false)
        }
    }

    const handelDuplicate = ()=>{
        navigation.navigate("Create Assignment", { 
            reload: reload,
            idAssignment: idAssignment
        })
    }

    const handleChangeCode = (v, field, index, subField)=>{
        let newCode
        if(subField){
            newCode = {
                ...questionCode,
                [field]: questionCode[field].map((sub, i)=>{
                    if(index === i){
                        return{
                            ...sub,
                            [subField]: v
                        }
                    }
                    return sub
                })
            }
        }else{
            newCode = {
                ...questionCode,
                [field]: v
            }
        }
        setQuestionCode(newCode)
    }
    const handleDeleteCode = (field, index)=>{
        const newCode = {
            ...questionCode,
            [field]: questionCode[field].filter((sub, i)=> i !== index)
        }
        setQuestionCode(newCode)
    }
    const handleAddCode = (field)=>{
        const newCode = {
            ...questionCode,
            [field]: [...questionCode[field], {
                input: "",
                output: ""
            }]
        }
        setQuestionCode(newCode)
    }
    const handleChangeTeacherCode = (v, field)=>{
        const newCode = {
            ...questionCode,
            [field]: v
        }
        setTeacherCode(newCode)
    }
    return(
        <>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.inner}>
                    {(idCourse || isEdit) &&
                        <>
                            <Text style={styles.title}>{nameCourse || selectCourse?.label}</Text>                            
                            {selectSection?.value &&
                                <>
                                    <View style={styles.wrapFlex}>
                                        <AntDesign name="right" size={14} color="black" style={{width: 18}}/>
                                        <Text style={[styles.title, {fontSize: 14}]}>{selectSection?.label}</Text>
                                    </View>
                                    <View style={styles.wrapFlex}>
                                        <AntDesign name="right" size={14} color="black" style={{width: 18}}/>
                                        <Text style={[styles.title, {fontSize: 14}]}>{selectLecture?.label}</Text>
                                    </View>
                                </>
                            }
                        </>
                    }
                    {totalQuestion > 0 && <Text style={styles.textGray14}>{totalQuestion} {totalQuestion > 1 ? "questions" : "question"} |   {totalMark} mark</Text>}
                    {error &&
                        <Text style={styles.error}>{error}</Text>
                    }
                    <View style={styles.wrapBtn}>
                        {isEdit &&
                            <>
                                <TouchableOpacity style={styles.btnIcon} onPress={()=>handleDeleteAsgm()}>
                                    <MaterialIcons name="delete" size={24} color={COLORS.stroke} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnIcon} onPress={()=>fetchAsgm()}>
                                    <Fontisto name="redo" size={20} color={COLORS.stroke} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btnIcon} onPress={()=>handelDuplicate()}>
                                    <Ionicons name="duplicate" size={20} color={COLORS.stroke} />
                                </TouchableOpacity>
                                <View style={styles.line}/>
                            </>
                        }
                        <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]} onPress={()=>handleCreateAsgm(1)}>
                            <Text style={styles.textWhite14}>Publish</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnBorderGray]} onPress={()=>handleCreateAsgm(0)}>
                            <Text style={styles.textGray14}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.board}>
                        <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(0)}>
                            <Text style={[styles.normalBtn, selectBtn === 0 && styles.selectBtn]}>Detail assignment</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                            <Text style={[styles.normalBtn, selectBtn === 1 && styles.selectBtn]}>Questions</Text>
                        </TouchableOpacity>
                    </View>
                    {selectBtn === 0 ?
                        <View style={styles.wrapContent}>
                            <TextInputLabelGray label={"Title*"} placeholder={"Title assignment"} value={titleAsgm} onchangeText={setTitleAsgm}/>
                            {(!idCourse && !isEdit) &&
                                <>
                                    <SelectCourseBox
                                        value={selectCourse} 
                                        onchangeText={setSelectCourse}
                                        listSelect={listCourses}
                                    />
                                    {selectCourse ?
                                        selectCourse?.isLimitedTime ?
                                            <CheckBox
                                                isChecked={isExercise || false}
                                                onClick={()=>{
                                                    setIsExercise(!isExercise)
                                                    setSelectSection(null)
                                                    setSelectLecture(null)
                                                }}
                                                checkBoxColor={COLORS.secondMain}
                                                rightText="This is an exercise of a lecture."
                                            />
                                            :
                                            <Text style={styles.error}>You can only add exercises in unlimited courses.</Text>
                                        : ""
                                    }
                                    {isExercise &&
                                        <>
                                            <TextInputSelectBox 
                                                label={"Section*"} placeholder={"Select a section"} 
                                                value={selectSection} onchangeText={setSelectSection}
                                                listSelect={listSections}
                                            />  
                                            <TextInputSelectBox 
                                                label={"Lecture*"} placeholder={"Select a lecture"} 
                                                value={selectLecture} onchangeText={setSelectLecture}
                                                listSelect={listCurrentLectures}
                                            />  
                                        </>
                                    }
                                </>
                            }
                            <TextInputSelectBox 
                                label={"Type*"} placeholder={"Select a type"} 
                                value={type} onchangeText={handleChangeType} 
                                listSelect={idCourse ? 
                                    isLimitedTime === 1 ? typeLimit : typeUnlimit 
                                    :
                                    selectCourse.isLimitedTime === 1 ? typeLimit : typeUnlimit 
                                }
                                isDisable={isEdit}
                            />
                            <TextInputLabelGray label={"Duration (minutes)"} type={"numeric"} placeholder={"Minutes"} value={duration} onchangeText={setDuration}/>
                            {selectCourse?.isLimitedTime === 1 &&
                                <>
                                    <View style={styles.wrapFlex}>
                                        <TextInputSelectDate label={"Start date"} value={startDate} onchangeText={setStartDate}/>
                                        {startDate &&
                                            <TouchableOpacity onPress={()=>setStartDate(null)} style={{margin: 4, marginTop: 16}}>
                                                <MaterialIcons name="delete" size={24} color="black" />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                    <View style={styles.wrapFlex}>
                                        <TextInputSelectDate label={"Due date"} value={dueDate} onchangeText={setDueDate}/>
                                        {dueDate &&
                                            <TouchableOpacity onPress={()=>setDueDate(null)} style={{margin: 4, marginTop: 16}}>
                                                <MaterialIcons name="delete" size={24} color="black" />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </>
                            }
                            
                        </View>
                        :
                        <>
                            {questions && type ?
                                type.value === 1 ?
                                    <>
                                        <View style={{alignSelf: "flex-end", marginVertical: 8}}>
                                            <CustomSwitch label={"Question Shuffling"} value={isShufflingQuestion} onChangeText={setIsShufflingQuestion}/>   
                                        </View>
                                        {questions.map((item, index) => (item.assignmentItemStatus !== 0) &&
                                            <View style={styles.wrapContent} key={index}>
                                                <View style={[styles.wrapFlex, {justifyContent: "space-between"}]}>
                                                    <Text style={styles.title}>Question {index + 1}*</Text>
                                                    <TouchableOpacity onPress={()=>deleteQuestion(index, item.idAssignmentItem || null)}>
                                                        <AntDesign name="close" size={24} color={COLORS.secondMain}/>
                                                    </TouchableOpacity>
                                                </View>
                                                <TextInput
                                                    style={[styles.inputLabelGray]}
                                                    placeholder="Question"
                                                    multiline={true}
                                                    value={item.question}
                                                    onChangeText={(v)=>handleChangeQuestion(v, index, "question")}
                                                />
                                                <View style={styles.containerGray}>
                                                    <Text style={styles.label}>Reference material (maximum 1 file)</Text>
                                                    {item.attachedFile ?
                                                        <View style={styles.inputLabelGray}>
                                                            <Text style={{flex: 1}} numberOfLines={1}>{item.attachedFile?.name}</Text>
                                                            <TouchableOpacity onPress={()=>handleChangeQuestion(null, index, "attachedFile")} style={{margin: 4}}>
                                                                <MaterialIcons name="delete" size={18} color="black" />
                                                            </TouchableOpacity>
                                                        </View>
                                                        :
                                                        <TouchableOpacity onPress={()=>handleChangeQuestionMaterial(index)} style={[styles.btnText]}>
                                                            <MaterialIcons name="upload-file" size={20} color="black" />
                                                            <Text>Attach file</Text>
                                                        </TouchableOpacity>
                                                    }
                                                </View> 
                                                <View style={{width: "50%"}}>
                                                    <TextInputSelectBox 
                                                        label={"Type of answer*"} listSelect={typeOfAnswer} 
                                                        index={index} field={"assignmentItemAnswerType"} value={item.assignmentItemAnswerType}
                                                        onchangeText={handleChangeQuestion}
                                                    />
                                                </View>
                                                <View style={[styles.wrapFlex, styles.topBorder]}>
                                                    <View style={{width: "50%"}}>
                                                        <TextInputLabelGray 
                                                            label={"Mark*"} placeholder={"Mark"} type={"numeric"} value={item.mark} 
                                                            onchangeText={(v)=>handleChangeQuestion(v, index, "mark")}
                                                        />
                                                    </View>
                                                </View>  
                                            </View>
                                        )}
                                    </> 
                                : type.value === 2 ?
                                    <>
                                        <View style={{alignSelf: "flex-end", marginVertical: 8}}>
                                            <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                                                <MaterialIcons name="menu" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View> 
                                        {questions.map((question, index) => (question.assignmentItemStatus !== 0) &&
                                            <View style={styles.wrapContent} key={index}>
                                                <View style={[styles.wrapFlex, {justifyContent: "space-between"}]}>
                                                    <Text style={styles.title}>Question {index + 1}*</Text>
                                                    <TouchableOpacity onPress={()=>deleteQuestion(index, question.idAssignmentItem || null)}>
                                                        <AntDesign name="close" size={24} color={COLORS.secondMain}/>
                                                    </TouchableOpacity>
                                                </View>
                                                <TextInput
                                                    style={[styles.inputLabelGray]}
                                                    placeholder="Question"
                                                    multiline={true}
                                                    value={question.question}
                                                    onChangeText={(v)=>handleChangeQuestion(v, index, "question")}
                                                />
                                                <View style={styles.wrapFlex}>
                                                    <TouchableOpacity onPress={()=>handleChangeQuestionMaterial(index, "image")} style={[styles.btnText]}>
                                                        <MaterialIcons name="upload-file" size={20} color="black" />
                                                        <Text>Upload Image</Text>
                                                    </TouchableOpacity>
                                                    {question.attachedFile &&
                                                        <TouchableOpacity onPress={()=>handleChangeQuestion(null, index, "attachedFile")} style={{margin: 4}} >
                                                            <MaterialIcons name="delete" size={18} color="black" />
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                                {question.attachedFile &&
                                                    <Image source={{uri: question.attachedFile?.uri}} style={styles.questionImg}/>
                                                }

                                                {/* Answers */}
                                                <View style={[styles.wrapFlex, {justifyContent: "space-between"}]}>
                                                    <Text style={styles.textGray14}>Choices*</Text>
                                                    <CustomSwitch 
                                                        label={"Multiple answer"} 
                                                        value={question.isMultipleAnswer} 
                                                        onChangeText={(v)=>{
                                                            changeIsMultipleAnswer(index)
                                                        }}
                                                    />
                                                </View>
                                                <View style={{gap: 4}}>
                                                    {question.items &&
                                                        question.items.map((choice, indexChoice) => (choice?.multipleAssignmentItemStatus !== 0) &&
                                                                <View style={styles.wrapFlex} key={indexChoice}>
                                                                    {question.isMultipleAnswer ?
                                                                        <CheckBox
                                                                            isChecked={choice.isCorrect}
                                                                            onClick={()=>handleChangeChoice(index, indexChoice, "isCorrect", !choice.isCorrect)}
                                                                            checkBoxColor={COLORS.secondMain}
                                                                        />
                                                                        :
                                                                        <RadioBtn selected={choice.isCorrect} onPress={()=>handleChangeChoice(index, indexChoice, "isCorrect", !choice.isCorrect)}/>
                                                                    }
                                                                    <TextInput
                                                                        style={[[styles.inputLabelGray, {height: 38}]]}
                                                                        placeholder="Type a choice"
                                                                        value={choice.content}
                                                                        onChangeText={(v)=>handleChangeChoice(index, indexChoice, "content", v)}
                                                                    />
                                                                    <TouchableOpacity style={{margin: 4}} onPress={()=>deleteChoice(index, indexChoice)}>
                                                                        <MaterialIcons name="delete" size={20} color="black"/>
                                                                    </TouchableOpacity>
                                                                </View>
                                                        )
                                                    }
                                                    <TouchableOpacity style={styles.btnAddChoice} onPress={()=>addNewChoice(index)}>
                                                        <AntDesign name="plus" size={16} color="black" />
                                                        <Text style={styles.textGray14}>Add new choice</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[styles.topBorder]}>
                                                    <TextInputLabelGray 
                                                        label={"Answer explanation"} placeholder={"Explanation"} value={question.explanation}
                                                        onchangeText={(v)=>handleChangeQuestion(v, index, "explanation")}
                                                        multiline={true}
                                                    />
                                                    <View style={{width: "50%"}}>
                                                        <TextInputLabelGray 
                                                            label={"Mark*"} placeholder={"Mark"} type={"numeric"} value={question.mark} 
                                                            onchangeText={(v)=>handleChangeQuestion(v, index, "mark")}
                                                        />
                                                    </View>
                                                </View>  
                                            </View>
                                        )}
                                    </>   
                                : type.value === 3 ?
                                <>
                                    {/* CODE */}
                                    <View style={{alignSelf: "flex-end", marginVertical: 8}}>
                                        <CustomSwitch label={"Show test cases on submission"} value={questionCode.isShowOnSubmission} onChangeText={()=>{}}/>   
                                    </View>
                                    <View style={styles.wrapContent}>
                                        <Text style={styles.title}>Question</Text>
                                        <View>
                                            <Text style={styles.textGray14}>Problem</Text>
                                            <TextInput
                                                style={[styles.inputLabelGray, styles.minHeight]}
                                                placeholder="Problem"
                                                multiline={true}
                                                value={questionCode.problem}
                                                onChangeText={(v)=>handleChangeCode(v, "problem")}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.textGray14}>Language</Text>
                                            <TextInputSelectBox 
                                                placeholder={"Select a language"} 
                                                value={questionCode.language} onchangeText={()=>handleChangeCode(v, "language")} 
                                                listSelect={[]}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.textGray14}>Example</Text>
                                            <View>
                                                {/* Row */}
                                                <View style={[styles.wrapRow, styles.bgLightGray]}>
                                                    <Text style={styles.indexWidth}></Text>
                                                    <Text style={styles.wrapRowText}>Input</Text>
                                                    <Text style={styles.wrapRowText}>Output</Text>
                                                    <Text style={styles.indexWidth}></Text>
                                                </View>
                                                {questionCode.example ? questionCode?.example?.map((ex, indexEx) => 
                                                    <View style={styles.wrapRow} key={indexEx}>
                                                        <Text style={styles.indexWidth}>{indexEx + 1}</Text>
                                                        <TextInput style={styles.wrapRowText} value={ex.input} onChangeText={(v)=>handleChangeCode(v, "example", indexEx, "input")}/>
                                                        <TextInput style={styles.wrapRowText} value={ex.output} onChangeText={(v)=>handleChangeCode(v, "example", indexEx, "output")}/>
                                                        <TouchableOpacity style={styles.indexWidth} onPress={()=>handleDeleteCode("example", indexEx)}>
                                                            <MaterialIcons name="delete" size={16} color="black" style={{alignSelf: "center"}}/>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : ""}
                                                <TouchableOpacity onPress={()=>handleAddCode("example")}>
                                                    <Text style={styles.wrapRowText}>+ Add a record</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.wrapContent}>
                                        <Text style={styles.title}>Test Cases and Scoring Rules</Text>                                        
                                        <View>
                                            <Text style={styles.textGray14}>Test case</Text>
                                            <View>
                                                {/* Row */}
                                                <View style={[styles.wrapRow, styles.bgLightGray]}>
                                                    <Text style={styles.indexWidth}></Text>
                                                    <Text style={styles.wrapRowText}>Input</Text>
                                                    <Text style={styles.wrapRowText}>Output</Text>
                                                    <Text style={styles.indexWidth}></Text>
                                                </View>
                                                {questionCode.testCase?.map((test, indexTest) => 
                                                    <View style={styles.wrapRow} key={indexTest}>
                                                        <Text style={styles.indexWidth}>{indexTest + 1}</Text>
                                                        <TextInput style={styles.wrapRowText} value={test.input} onChangeText={(v)=>handleChangeCode(v, "testCase", indexTest, "input")}/>
                                                        <TextInput style={styles.wrapRowText} value={test.output} onChangeText={(v)=>handleChangeCode(v, "testCase", indexTest, "output")}/>
                                                        <TouchableOpacity style={styles.indexWidth} onPress={()=>handleDeleteCode("testCase", indexTest)}>
                                                            <MaterialIcons name="delete" size={16} color="black" style={{alignSelf: "center"}}/>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                                <TouchableOpacity onPress={()=>handleAddCode("testCase")}>
                                                    <Text style={styles.wrapRowText}>+ Add a test case</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.textGray14}>Scoring rules</Text>
                                            <CheckBox
                                                isChecked={questionCode.isPastTestCase}
                                                onClick={()=>handleChangeCode(!questionCode.isPastTestCase, "isPastTestCase")}
                                                checkBoxColor={COLORS.secondMain}
                                                rightText="Pass test cases"
                                            />
                                            <CheckBox
                                                isChecked={questionCode.isLimitTime}
                                                onClick={()=>handleChangeCode(!questionCode.isLimitTime, "isLimitTime")}
                                                checkBoxColor={COLORS.secondMain}
                                                rightText="Performance on time"
                                            />
                                            {questionCode.isLimitTime &&
                                                <View style={styles.paddingCheck}>
                                                    <TextInput
                                                        style={[styles.inputLabelGray]}
                                                        placeholder="Time limit (second)"
                                                        value={questionCode.limitTime}
                                                        onChangeText={(v)=>handleChangeCode(v, "limitTime")}
                                                        keyboardType={"numeric"}
                                                    />
                                                </View>
                                            }
                                            <CheckBox
                                                isChecked={questionCode.isLimitMemory}
                                                onClick={()=>handleChangeCode(!questionCode.isLimitMemory, "isLimitMemory")}
                                                checkBoxColor={COLORS.secondMain}
                                                rightText="Perfomance on memory"
                                            />
                                            {questionCode.isLimitMemory &&
                                                <View style={styles.paddingCheck}>
                                                    <TextInput
                                                        style={[styles.inputLabelGray]}
                                                        placeholder="Memory limit (MB)"
                                                        value={questionCode.limitMemory}
                                                        onChangeText={(v)=>handleChangeCode(v, "limitMemory")}
                                                        keyboardType={"numeric"}
                                                    />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                    <View style={styles.wrapContent}>
                                        <Text style={styles.title}>Testing with your code</Text>
                                        <View>
                                            <Text style={styles.textGray14}>Your code</Text>
                                            <TextInput
                                                style={[styles.minHeight, styles.textCode]}
                                                placeholder="Your code"
                                                multiline={true}
                                                value={teacherCode.code}
                                                onChangeText={(v)=>handleChangeTeacherCode(v, "code")}
                                            />
                                        </View>
                                        <View>
                                            <Text style={styles.textGray14}>Language</Text>
                                            <TextInputSelectBox 
                                                placeholder={"Select a language"} 
                                                value={teacherCode.language} onchangeText={()=>handleChangeTeacherCode(v, "language")} 
                                                listSelect={[]}
                                            />
                                        </View>
                                        {true &&
                                            <View>
                                                <Text style={styles.textGray14}>Result</Text>
                                                <View>
                                                    {/* Row */}
                                                    <View style={[styles.wrapRow, styles.bgLightGray]}>
                                                        <Text style={styles.wrapRowText}>Test case</Text>
                                                        <Text style={styles.wrapRowText}>Result</Text>
                                                    </View>
                                                    <View style={styles.wrapRow}>
                                                        <Text style={styles.wrapRowText}>...</Text>
                                                        <Text style={styles.wrapRowText}>...</Text>
                                                    </View>
                                                </View>
                                                <View style={styles.wrapFlex}>
                                                    <Text style={styles.textGray14}>Time</Text>
                                                    <Text style={styles.textBlack16}>0.2s</Text>
                                                </View>
                                                <View style={styles.wrapFlex}>
                                                    <Text style={styles.textGray14}>Memory</Text>
                                                    <Text style={styles.textBlack16}>0.2KB</Text>
                                                </View>
                                            </View>
                                        }
                                        <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]} onPress={()=>{}}>
                                            <Text style={styles.textWhite14}>Run code</Text>
                                        </TouchableOpacity>
                                    </View>
                                </> : ""
                            :""
                            }
                        </>
                    }
                </ScrollView>
                {selectBtn === 1 && type.value !== 3 &&
                    <TouchableOpacity style={styles.btnPlus} onPress={()=>addQuestion()}>
                        <Entypo name="plus" size={28} color="black" />
                    </TouchableOpacity>
                }
                {loading &&
                    <View style={styles.wrapLoading}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                }  
            </View>
            <Modal
                visible={isOpenModal}
                transparent={true}
                animationType="fade"
            >
                <TouchableWithoutFeedback onPress={() => setIsOpenModal(false)}>
                    <View style={styles.modalWrapper}>
                        <View style={styles.openModal}>
                            <View style={[styles.btnOpenModal, {borderBottomWidth: 1}]}>
                                <Text>Question Shuffling</Text>
                                <CustomSwitch value={isShufflingQuestion} onChangeText={setIsShufflingQuestion}/>  
                            </View>
                            <View style={[styles.btnOpenModal, {borderBottomWidth: 1}]}>
                                <Text>Answer Shuffling</Text>
                                <CustomSwitch value={isShufflingAnswer} onChangeText={setIsShufflingAnswer}/>  
                            </View>
                            <View style={styles.btnOpenModal}>
                                <Text>Show answer on submit</Text>
                                <CustomSwitch value={isShowAnswer} onChangeText={setIsShowAnswer}/>  
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#FAFAFA",
        flex: 1,
    },
    inner:{
        padding: 16,
    },
    board: {
        flexDirection: "row",
        columnGap: 4,
    },
    boardBtn: {
        justifyContent: "center",
        flex: 1,
    },
    normalBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 18,
        color: COLORS.lightText,
        fontWeight: "bold",
        textAlign: "center",
    },
    selectBtn: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.main,
        color: COLORS.main,
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

    wrapContent:{
        ...commonStyles.shadow,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        gap: 8,
        zIndex: -1,
    },

    wrapFlex:{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
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
        paddingVertical: 8,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        maxHeight: 200
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
    topBorder:{
        borderTopWidth: 1,
        borderColor: COLORS.lightText,
        marginTop: 8,
        paddingTop: 4,
        position: 'relative',
    },
    error:{
        color: COLORS.red
    },
    btnPlus:{
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
        margin: 16
    },

    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },

    questionImg:{
        backgroundColor: COLORS.lightGray,
        width: "100%",
        height: 200,
        resizeMode: 'contain',
    },
    btnAddChoice:{
        flexDirection: "row",
        borderColor: COLORS.stroke,
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: "dashed",
        paddingHorizontal: 8,
        paddingVertical: 4,
        alignItems: "center",
        gap: 8,
        alignSelf: "flex-start"
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
    openModal: {
        backgroundColor: "white",
        width: "100%",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnOpenModal:{
        borderColor: COLORS.lightText,
        width: "100%",
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    btnIcon:{
        alignItems: "center",
        justifyContent: "center",
        padding: 4
    },
    line:{
        width: 1,
        backgroundColor: COLORS.lightText
    },
    wrapRow:{
        flexDirection: "row",
        justifyContent: "space-between",        
        width: "100%"
    },
    wrapRowText:{
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        textAlign: "center",
        paddingVertical: 4
    },
    bgLightGray:{
        backgroundColor: COLORS.lightGray
    },
    paddingCheck:{
        marginLeft: 34
    },
    minHeight: {
        height: 200,
        textAlignVertical: "top"
    },
    indexWidth:{
        width: 40,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        textAlign: "center",
        paddingVertical: 4,
        justifyContent: "center"
    },
    textCode: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        fontFamily: 'monospace',
        backgroundColor: '#fff',
      },
})