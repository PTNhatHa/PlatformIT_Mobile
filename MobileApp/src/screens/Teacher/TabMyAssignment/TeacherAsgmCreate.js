import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../../../utils/constants"
import { TextInputLabelGray, TextInputSelectBox, TextInputSelectDate } from "../../../components/TextInputField"
import CheckBox from "react-native-check-box"
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllActiveCourseOfTeacher, getAllActiveSectionOfCourse } from "../../../services/course"
import { useUser } from "../../../contexts/UserContext"
import { getAllActiveLecturesOfCourse } from "../../../services/lecture"
import Entypo from '@expo/vector-icons/Entypo';
import * as DocumentPicker from 'expo-document-picker';
import { createManualAssignment } from "../../../services/assignment"
import { useNavigation } from "@react-navigation/native"

export const TeacherAsgmCreate = ({route})=>{
    const {idCourse, nameCourse, isLimitedTime, idSection, nameSection, idLecture, nameLecture} = route?.params || {}
    const {state} = useUser()
    const navigation = useNavigation()
    const [selectBtn, setSelectBtn] = useState(0)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false);

    const [isExercise, setIsExercise] = useState(idLecture ? true : false)
    const [titleAsgm, setTitleAsgm] = useState("")
    const [selectCourse, setSelectCourse] = useState(nameCourse || "")
    const [selectSection, setSelectSection] = useState("")
    const [selectLecture, setSelectLecture] = useState("")
    const [type, setType] = useState("")
    const [duration, setDuration] = useState("")
    const [startDate, setStartDate] = useState("")
    const [dueDate, setDueDate] = useState("")

    const [isShuffling, setIsShuffling] = useState(false)
    const [questions, setQuestions] = useState([])
    const [totalMark, setTotalMark] = useState(0)

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

    useEffect(()=>{
        const getAllCourse = async()=>{
            try {
                const response = await getAllActiveCourseOfTeacher(state.idUser)
                // console.log("API response:", response);
                setListCourses([...response?.map(item=>{
                    return{
                        value: item.idCourse,
                        label: item.title,
                        isLimitedTime: item.isLimitedTime,
                        endDate: item.endDate
                    }
                })])
            } catch (error) {
                console.log("Error getAllCourse: ", error);
            }
        }
        if(!idCourse){
            getAllCourse()
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
            getAllSection()
            getAllLecture()
            setSelectSection(null)
            setSelectLecture(null)
            if(selectCourse && selectCourse.isLimitedTime !== 1) setIsExercise(true)
        }
    }, [selectCourse])

    useEffect(()=>{
        if(selectSection){
            const current = listLectures.filter(item => item.idSection === selectSection.value)
            setListCurrentLectures(current)
        }
        setSelectLecture(null)
    }, [selectSection])

    useEffect(()=>{
        if(startDate && dueDate){
            if(new Date(startDate) >= new Date(dueDate)){
                setError("The start date must be before the due date.")
            } else {
                setError(null)
            }
        }
    }, [startDate, dueDate])

    useEffect(()=>{
        setError(null)
    }, [titleAsgm, selectCourse, selectSection, selectLecture, type, startDate, dueDate])

    const pickFile = async()=>{
        try{
            let result = await DocumentPicker.getDocumentAsync({
                type: ['*/*'],
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
    const handleChangeQuestionMaterial = async(index)=>{
        const result = await pickFile()
        if(result){
            handleChangeQuestion({
                uri: result.uri,
                name: result.name,
                type: result.mimeType 
            }, index, "attachedFile")
        }
    }
    const addQuestion = ()=>{
        setQuestions([...questions, {
            question: null,
            mark: 0,
            assignmentItemAnswerType: 1,
            attachedFile: null,
        }])
    }
    const deleteQuestion = (index)=>{
        const newQuestions = questions.filter((item, i) => i !==index)
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
            if(!startDate) setError("Please select a start date if you have chosen a due date.")
            if(!dueDate) setError("Please select a due date if you have chosen a start date.")
        }
        if(questions.length === 0){
            Alert.alert("Warning", "You need to add at least 1 question.")
            return
        }
        const check = questions.find(item => item.question === null)
        if(check){
            Alert.alert("Warning", "You need to fill all question.")
            return
        }

        let textStatus = "create"
        if(isPublish){
            textStatus = "create and publish"
        }
        textStatus += " this " + type.label
        if(isExercise){
            textStatus += " exercise"
        } else {
            textStatus += " test"
        }
        if(questions.length > 1){
            textStatus += " with " + questions.length + " questions?"
        } else {
            textStatus += " with " +  questions.length + " question?"
        }
        
        Alert.alert(
            "Confirm Create Assignment",
            "Are you sure you want to " + textStatus,
            [
                {
                    text: "Yes",
                    onPress: ()=> {
                        if(type.value === 1){
                            postAsgm(isPublish)
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
    const postAsgm = async(isPublish)=>{
        setLoading(true)
        try {
            const response = await createManualAssignment(
                titleAsgm, selectCourse.value, isExercise ? 1 : 0, selectLecture?.value || "", startDate, dueDate,
                duration, type.value, isPublish, isShuffling ? 1 : 0, questions, state.idUser
            )
            if(response){
                Alert.alert("Done", response)
                navigation.goBack()
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }
    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.inner}>
                {idCourse &&
                    <>
                        <Text style={styles.title}>{nameCourse}</Text>
                        {idSection &&
                            <View style={styles.wrapFlex}>
                                <Text style={[styles.title, {fontSize: 14}]}>{nameSection}</Text>
                                <AntDesign name="right" size={14} color="black" style={{width: 18}}/>
                                <Text style={[styles.title, {fontSize: 14}]}>{nameLecture}</Text>
                            </View>
                        }
                    </>
                }
                <Text style={styles.textGray14}>{questions.length} {questions.length > 1 ? "questions" : "question"} |   {totalMark} mark</Text>
                <View style={styles.wrapBtn}>
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
                        {!idCourse &&
                            <>
                                <TextInputSelectBox 
                                    label={"Add to course*"} 
                                    placeholder={"Select a course"} 
                                    value={selectCourse} 
                                    onchangeText={setSelectCourse}
                                    listSelect={listCourses}
                                />
                                {selectCourse ?
                                    selectCourse?.isLimitedTime ?
                                        <CheckBox
                                            isChecked={isExercise}
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
                            value={type} onchangeText={setType} 
                            listSelect={idCourse ? 
                                isLimitedTime === 1 ? typeLimit : typeUnlimit 
                                :
                                selectCourse.isLimitedTime === 1 ? typeLimit : typeUnlimit 
                            }
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
                        {error &&
                            <Text style={styles.error}>{error}</Text>
                        }
                    </View>
                    :
                    <>
                        <View style={[styles.wrapFlex, {alignSelf: "flex-end"}]}>
                            <Text>Question Shuffling</Text>
                            <Switch
                                trackColor={{ false: COLORS.stroke, true: COLORS.main30 }}
                                thumbColor={isShuffling ? COLORS.secondMain : COLORS.lightGray}
                                value={isShuffling}
                                onValueChange={()=>setIsShuffling(!isShuffling)}
                            />
                        </View>
                        {questions &&
                            questions.map((item, index) =>
                                <View style={styles.wrapContent} key={index}>
                                    <View style={[styles.wrapFlex, {justifyContent: "space-between"}]}>
                                        <Text style={styles.title}>Question {index + 1}*</Text>
                                        <TouchableOpacity onPress={()=>deleteQuestion(index)}>
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
                                                <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
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
                                                label={"Mark"} placeholder={"Mark"} type={"numeric"} value={item.mark} 
                                                index={index} field={"mark"}
                                                onchangeText={handleChangeQuestion}
                                            />
                                        </View>
                                    </View>  
                                </View>
                            )
                        }
                    </>
                }
            </ScrollView>
            {selectBtn === 1 &&
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
    }
})