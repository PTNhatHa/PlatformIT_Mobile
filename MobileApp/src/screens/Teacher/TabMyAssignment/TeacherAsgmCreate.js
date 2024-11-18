import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../../../utils/constants"
import { TextInputLabelGray, TextInputSelectBox, TextInputSelectDate } from "../../../components/TextInputField"
import CheckBox from "react-native-check-box"
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllActiveCourseOfTeacher } from "../../../services/course"
import { useUser } from "../../../contexts/UserContext"

export const TeacherAsgmCreate = ({route})=>{
    const {idCourse, nameCourse, idSection, nameSection, idLecture, nameLecture} = route?.params || {}
    const {state} = useUser()
    const [selectBtn, setSelectBtn] = useState(0)

    const [isExercise, setIsExercise] = useState(false)
    const [titleAsgm, setTitleAsgm] = useState(null)
    const [selectCourse, setSelectCourse] = useState(null)
    const [selectSection, setSelectSection] = useState(null)
    const [selectLecture, setSelectLecture] = useState(null)
    const [type, setType] = useState(null)
    const [duration, setDuration] = useState(null)
    const [startDate, setStartDate] = useState(null)
    const [dueDate, setDueDate] = useState(null)

    const [isShuffling, setIsShuffling] = useState(false)
    const [questions, setQuestions] = useState([
        {
            question: "",
            material: {},
            typeOfAnswer: 1,
            mark: 2
        }
    ])

    const [listCourses, setListCourses] = useState([])
    const typeUnlimit = [
        { label: "Quiz", value: 2 },
        { label: "Code", value: 3 },
    ]
    const typeLimit = [
        { label: "Manual", value: 1 },
        { label: "Quiz", value: 2 },
        { label: "Code", value: 3 },
    ]

    useEffect(()=>{
        const getAllCourse = async()=>{
            try {
                const response = await getAllActiveCourseOfTeacher(6)
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
        getAllCourse()
        
    }, [])

    return(
        <>
            <ScrollView style={styles.container}>
                {idCourse &&
                    <>
                        <Text style={styles.title}>{"nameCourse"}</Text>
                        {idSection &&
                            <View style={styles.wrapFlex}>
                                <Text style={[styles.title, {fontSize: 14}]}>{"nameSection"}</Text>
                                <AntDesign name="right" size={14} color="black" style={{width: 18}}/>
                                <Text style={[styles.title, {fontSize: 14}]}>{"nameLecture"}</Text>
                            </View>
                        }
                    </>
                }
                <Text style={styles.textGray14}>0 question |   0 mark</Text>
                <View style={styles.wrapBtn}>
                    <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]} onPress={()=>handleSave()}>
                        <Text style={styles.textWhite14}>Publish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnBorderGray]} onPress={()=>navigation.goBack()}>
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
                                {isExercise &&
                                    <>
                                        <TextInputSelectBox label={"Section"} placeholder={"Select a section"} value={selectSection} onchangeText={setSelectSection}/>  
                                        <TextInputSelectBox label={"Lecture"} placeholder={"Select a lecture"} value={selectLecture} onchangeText={setSelectLecture}/>  
                                    </>
                                }
                            </>
                        }
                        <TextInputSelectBox label={"Type*"} placeholder={"Select a type"} value={type} onchangeText={setType} listSelect={typeLimit}/>
                        <TextInputLabelGray label={"Duration (minutes)"} type={"numeric"} placeholder={"Minutes"} value={duration} onchangeText={setDuration}/>
                        <TextInputSelectDate label={"Start date"} value={startDate} onchangeText={setStartDate}/>
                        <TextInputSelectDate label={"Due date"} value={dueDate} onchangeText={setDueDate}/>
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
                        <View style={styles.wrapContent}>
                            <View style={[styles.wrapFlex, {justifyContent: "space-between"}]}>
                                <Text style={styles.title}>Question 1*</Text>
                                <TouchableOpacity>
                                    <AntDesign name="close" size={24} color={COLORS.secondMain}/>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={[styles.inputLabelGray]}
                                placeholder="Question"
                                multiline={true}
                            />
                            <View style={styles.containerGray}>
                                <Text style={styles.label}>Reference material (maximum 1 file)</Text>
                                {true ?
                                    <View style={styles.inputLabelGray}>
                                        <Text style={{flex: 1}} numberOfLines={1}>namefilemmmmmmmmmmmmmmmmmmmmmmm</Text>
                                        <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                            <MaterialIcons name="delete" size={18} color={COLORS.red} />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <TouchableOpacity onPress={()=>{}} style={[styles.btnText]}>
                                        <MaterialIcons name="upload-file" size={20} color="black" />
                                        <Text>Attach file</Text>
                                    </TouchableOpacity>
                                }
                            </View> 
                            <View style={[styles.wrapFlex, styles.topBorder]}>
                                    <TextInputSelectBox label={"Type of answer"}/>
                                    <TextInputLabelGray label={"Mark"} type={"numeric"}/>
                            </View>  
                        </View>
                    </>
                }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 16,
        backgroundColor: "#FAFAFA",
        flex: 1,
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
        gap: 8
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
        paddingTop: 4
    }
})