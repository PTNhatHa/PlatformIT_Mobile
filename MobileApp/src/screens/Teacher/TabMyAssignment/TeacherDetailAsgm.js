
import { ActivityIndicator, Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { AssignmentItemAnswerType, COLORS, commonStyles, typeAssignment } from "../../../utils/constants"
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ButtonGreen } from "../../../components/Button";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { getAssignmentAnswer, getAssignmentInfo, getDetailAssignmentForStudent, getOverviewAssignment } from "../../../services/assignment";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime, formatTime } from "../../../utils/utils";
import { RadioView } from "../../../components/RadioBtn";
import CheckBox from "react-native-check-box";
import { SubmittedCircle } from "../../../components/SubmittedCircle";
import Feather from '@expo/vector-icons/Feather';
import { CardStudentDetailAsgm } from "../../../components/CardStudent";
import { FilterStudentOverview } from "../../../components/Filter";
import { CustomSwitch } from "../../../components/CustomSwitch";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TextInputLabelGray } from "../../../components/TextInputField";

export const TeacherDetailAsgm = ({route})=>{
    const navigation = useNavigation()
    const {idAssignment, isPastDue, isCompleted} = route?.params || 0
    const [loading, setLoading] = useState(true);
    const {state} = useUser()
    const [data, setData] = useState({})
    const [totalMark, setTotalMark] = useState(0)
    const [selectFile, setSelectFile] = useState("")
    const [listQuestion, setListQuestion] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [index, setIndex] = useState(1)
    const numberItem = 5

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [overviewData, setOverviewData] = useState({})
    const [overviewCircle, setOverviewCircle] = useState([
        { label: 'On Time', value: 0, color: COLORS.green }, // Xanh lá
        { label: 'Late', value: 0, color: COLORS.yellow }, // Vàng
        { label: 'Not Submitted', value: 0, color: COLORS.lightText }, // Đỏ
    ])
    const [currentPageStudent, setCurrentPageStudent] = useState(1)
    const [currentOverview, setCurrentOverview] = useState([])
    const [search, setSearch] = useState("")
    const [filterStudent, setFilterStudent] = useState([])
    const [isChangeSetting, setIsChangeSetting] = useState(false)
    const [currentStudent, setCurrentStudent] = useState(null)
    const [currentStudentAnswer, setCurrentStudentAnswer] = useState(null)
    const [currentPageStudentAnswer, setCurrentPageStudentAnswer] = useState(1)

    const getPageData = () => {
        return listQuestion.slice((currentPage-1) * numberItem, currentPage * numberItem);
    };
    const getPageDataStudent = () => {
        return currentOverview.slice((currentPageStudent-1) * numberItem, currentPageStudent * numberItem);
    };
    const getPageDataStudentAnswer = () => {
        return currentStudentAnswer.slice((currentPageStudentAnswer-1) * numberItem, currentPageStudentAnswer * numberItem);
    };
    
    const fetchDetailAsgm = async()=>{
        try {
            const response = await getAssignmentInfo(idAssignment)
            if(response){
                // console.log(idAssignment, "--", response.idCourse);
                setData(response)
                const totalMark = response.assignmentItems?.reduce((total, item) => total + parseInt(item.mark) || 0, 0);
                setTotalMark(totalMark)
                setListQuestion(response.assignmentItems)
                // Overview
                const overView = await getOverviewAssignment(idAssignment, response.idCourse)
                if(overView){
                    setOverviewData(overView)
                    setCurrentOverview(overView.submissions)
                    setOverviewCircle([
                        { label: 'On Time', 
                            value: overView.submittedCount, 
                            color: COLORS.green 
                        },
                        { label: 'Late', 
                            value: overView.totalStudents -overView.submittedCount - overView.notSubmittedCount, 
                            color: COLORS.yellow 
                        },
                        { label: 'Not Submitted', 
                            value: overView.notSubmittedCount, 
                            color: COLORS.lightText 
                        },
                    ])
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

    const getPagination = (listData = [], indexPage = 1) => {
        const totalPages = Math.ceil(listData.length / numberItem)
        if (totalPages <= 5) {
        // Show all pages if there are 5 or fewer
        return Array.from({ length: totalPages }, (_, index) => index + 1);
        } else {
        // Logic for more than 5 pages
        if (indexPage <= 3) {
            // Show first few pages if current page is near the start
            return [1, 2, 3, 4, "...", totalPages];
        } else if (indexPage >= totalPages - 2) {
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
                indexPage - 1,
                indexPage,
                indexPage + 1,
                "...",
                totalPages,
            ];
        }
        }
    }
    
    const handleFilter = (initData, filterList)=>{
        let newData = [...initData] || []
        if(filterList?.sortby !== null && filterList?.sortway !== null){
            newData = newData?.sort((a,b) => {
                const field = filterList?.sortby
                const aValue = a[field]
                const bValue = b[field]
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return filterList?.sortway === 1 ? aValue - bValue : bValue - aValue;
                }
                if(filterList?.sortway === 1){
                    //Asc
                    if(aValue === null) return -1
                    if(bValue === null) return 1
                    if(aValue === null && bValue === null) return 0
                    return aValue.localeCompare(bValue)
                }
                if(filterList?.sortway === 2){
                    //Desc
                    if(aValue === null) return 1
                    if(bValue === null) return -1
                    if(aValue === null && bValue === null) return 0
                    return bValue.localeCompare(aValue);
                }
                return 0
            })
        }
        // status
        newData = newData?.filter(item =>{
            if(filterList.status === "Not submitted"){
                return item.status === null
            }
            if(filterList.status === "Submitted" || filterList.status === "On time"){
                return item.status === 1 || item.status === 3
            }
            if(filterList.status === "Late"){
                return item.status === 2
            }
            return item
        })
        return newData || []
    }
    const handleSearch =(initData, searchText)=>{
        let newData = [...initData]
        if(searchText !== null){
            return newData.filter(item => {
                return item.nameStudent?.toLowerCase().includes(searchText.toLowerCase()) ||
                        formatDateTime(new Date(item.submittedDate), true).includes(searchText)
            })
        }
        return []
    }

    useEffect(()=>{
        if(index === 2){
            let result = overviewData.submissions ? [...overviewData.submissions] : []
            if(filterStudent){
                result = handleFilter(result, filterStudent)
            }
            result = handleSearch(result, search)
            setCurrentOverview(result)
        }
    }, [search, filterStudent])

    const getStudentAnswer = async(idStudent)=>{
        setLoading(true)
        try {
            // Student Answer
            const detail = await getDetailAssignmentForStudent(idAssignment, idStudent)
            if(detail){
                setCurrentStudent(prev => {
                    return{
                        ...prev,
                        ...detail
                    }
                })
                const answers = await getAssignmentAnswer(idAssignment, idStudent)
                if(answers){
                    if(data.assignmentType === 1){
                        setCurrentStudentAnswer([...answers.detailQuestionResponses])
                    }
                    if(data.assignmentType === 2){
                        setCurrentStudentAnswer([...answers.detailQuestionResponses.map(question => {
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
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
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
                                {(data.assignmentType === 1 && listQuestion !== null) && 
                                    <>
                                        <View style={styles.wrapSwitch}>
                                            <CustomSwitch label={"Question Shuffling"} value={data.isShufflingQuestion} onChangeText={()=>{}}/>   
                                        </View>
                                        {getPageData()?.map((question, index) =>     
                                            <View style={styles.wrapQuestion} key={question.idAssignmentItem}>
                                                <View style={styles.headerQ}>
                                                    <Text style={styles.title}>Question {index + currentPage}</Text>
                                                    <Text style={styles.textGray12}>{question.mark} {question.mark > 1 ? "marks" : "mark"}</Text>
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
                                                <View style={styles.wrapFlex}>
                                                    <Text style={styles.textGray12}>Type of answer:</Text>
                                                    <Text style={styles.textBlack12}>{AssignmentItemAnswerType[question.assignmentItemAnswerType]}</Text>
                                                </View>
                                            </View>
                                        )}
                                    </>
                                }
                                {(data.assignmentType === 2 && listQuestion !== null) && 
                                    <>
                                        <View style={styles.wrapSwitch}>
                                            <TouchableOpacity onPress={()=>setIsChangeSetting(true)}>
                                                <MaterialIcons name="menu" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                        {getPageData()?.map((question, index) =>     
                                            <View style={styles.wrapQuestion} key={question.idAssignmentItem}> 
                                                <View style={styles.headerQ}>
                                                    <Text style={styles.title}>Question {index + (currentPage - 1) * numberItem + 1}</Text>
                                                    <Text style={styles.textGray12}>{question.mark} {question.mark > 1 ? "marks" : "mark"}</Text>
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
                                                                <RadioView selected={item.isCorrect === 1 ? true : false}/>  
                                                                <Text style={styles.widthFlex1}>{item.content}</Text>
                                                            </View>
                                                        )
                                                        :
                                                        question.items.map(item => 
                                                            <View style={styles.wrapFlex} key={item.idMultipleAssignmentItem}>
                                                                <CheckBox
                                                                    isChecked={item.isCorrect === 1 ? true : false}
                                                                    checkBoxColor={COLORS.secondMain}
                                                                    onClick={()=>{}}
                                                                />
                                                                <Text style={styles.widthFlex1}>{item.content}</Text>
                                                            </View>
                                                        )
                                                    }
                                                </View>
                                            </View>
                                        )}
                                    </>
                                }  
                                
                                {/* paginage */}
                                <View style={styles.bottom}>
                                    {getPagination(listQuestion, currentPage).map((page, index) => 
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
                            :
                            <>                            
                                {/* Overview */}
                                <View style={[styles.container, styles.wrapTopOverview]}>
                                    <View style={styles.wrapFlex}>
                                        <SubmittedCircle data={overviewCircle}/>
                                        <View>
                                            <Text style={styles.textBBlack18}>{overviewData.totalStudents}</Text>
                                            <Text style={styles.textGray12}>Attendees</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.wrapFlex, styles.wrapAlignRight]}>
                                        <View style={styles.borderRight}>
                                            <Text style={[styles.textBBlack18, styles.textAlignRight]}>{overviewData.notSubmittedCount}</Text>
                                            <View style={styles.wrapFlex}>
                                                <View style={styles.circleStatus}/>
                                                <Text style={[styles.textGray12, styles.textAlignRight]}>Not submitted</Text>
                                            </View>
                                        </View>
                                        {((data.dueDate && new Date() > new Date(data.dueDate)) || (data.courseEndDate  && new Date() > new Date(data.courseEndDate))) &&
                                            <View style={styles.borderRight}>
                                                <Text style={[styles.textBBlack18, styles.textAlignRight]}>
                                                    {overviewData.totalStudents - overviewData.notSubmittedCount - overviewData.submittedCount}
                                                </Text>
                                                <View style={styles.wrapFlex}>
                                                    <View style={[styles.circleStatus, styles.bgYellow]}/>
                                                    <Text style={[styles.textGray12, styles.textAlignRight]}>Late</Text>
                                                </View>
                                            </View>
                                        }
                                        <View style={styles.borderRight}>
                                            <Text style={[styles.textBBlack18, styles.textAlignRight]}>{overviewData.submittedCount}</Text>
                                            <View style={styles.wrapFlex}>
                                                <View style={[styles.circleStatus, styles.bgGreen]}/>
                                                <Text style={[styles.textGray12, styles.textAlignRight]}>
                                                    {((data.dueDate && new Date() > new Date(data.dueDate)) || (data.courseEndDate  && new Date() > new Date(data.courseEndDate))) ? 
                                                        "On time" : "Submitted"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                
                                {!currentStudentAnswer ?
                                    <View style={styles.container}>
                                        <View style={styles.wrapperSearch}>
                                            <TextInput
                                                value={search}
                                                style={styles.input}
                                                placeholder={"Search"}
                                                onChangeText={(value)=>setSearch(value)}
                                            />
                                            <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                                                <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.wrapList}>
                                            {getPageDataStudent().map(student=>
                                                <CardStudentDetailAsgm 
                                                    data={student} key={student.idStudent} 
                                                    isPastDue={((data.dueDate && new Date() > new Date(data.dueDate)) || (data.courseEndDate  && new Date() > new Date(data.courseEndDate)))}
                                                    onPress={()=>{
                                                            if(!student.status){
                                                                Alert.alert("Noti", "This student has not submitted the assignment yet.")
                                                            } else {
                                                                getStudentAnswer(student.idStudent)
                                                                setCurrentStudent({
                                                                    idStudent: student.idStudent,
                                                                    nameStudent: student.nameStudent
                                                                })
                                                            }
                                                        }
                                                    }
                                                />
                                            )}
                                            {/* paginage */}
                                            <View style={styles.bottom}>
                                                {getPagination(currentOverview, currentPageStudent).map((page, index) => 
                                                    page !== "..." ? 
                                                    <TouchableOpacity 
                                                        style={[styles.wrapNumber, page === currentPageStudent && {backgroundColor: COLORS.main}]} 
                                                        onPress={()=>setCurrentPageStudent(page)}
                                                        key={index}
                                                    >
                                                        <Text style={[styles.bottomNumber, page === currentPageStudent && {color: "white"}]}>{page}</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <View style={styles.wrapNumber} key={index}>
                                                        <Text style={styles.bottomNumber}>{page}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                    :
                                    <>
                                        <View style={styles.container}>
                                            <View style={styles.wrapFlexJustify}>
                                                <TouchableOpacity style={styles.wrapFlex} onPress={()=>{
                                                    setCurrentStudent(null)
                                                    setCurrentStudentAnswer(null)    
                                                }}>
                                                    <AntDesign name="left" size={18} color="black" />
                                                    <Text style={styles.textBlack16}>Answer sheet</Text>
                                                </TouchableOpacity>
                                                {data.assignmentType === 1 &&
                                                    <TouchableOpacity style={styles.btnBorderGray} onPress={()=>{}}>
                                                        <Text style={styles.textWhite14}>Save Grade</Text>
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                            <View style={styles.wrapDetail}>
                                                <Text style={styles.textBBlack18}>{currentStudent.nameStudent}</Text>
                                                <View style={styles.wrapFlex}>
                                                    <Text style={styles.textGray16}>Submitted at</Text>
                                                    <Text style={styles.textBlack16}>{formatDateTime(currentStudent.submittedDate, true, true)}</Text>
                                                </View>
                                                <View style={styles.wrapFlex}>
                                                    <Text style={styles.textGray16}>Status</Text>
                                                    {currentStudent.resultStatus === 1 ?
                                                        <Text style={[styles.boxStatus, styles.boxGreen]}>On time</Text>
                                                        : currentStudent.resultStatus === 2 ?
                                                            <Text style={[styles.boxStatus, styles.boxYellow]}>Late</Text>
                                                        :
                                                            <Text style={[styles.boxStatus, styles.boxGreen]}>Submitted</Text>
                                                    }
                                                </View>
                                                <View style={styles.wrapFlex}>
                                                    <Text style={styles.textGray16}>Marks</Text>
                                                    <Text style={styles.textBlack16}>{currentStudent.totalMark}/{currentStudent.assignmentMark}</Text>
                                                </View>
                                                <View style={styles.wrapFlex}>
                                                    <Text style={styles.textGray16}>Duration</Text>
                                                    <Text style={styles.textBlack16}>{formatTime(currentStudent.resultDuration)} minutes</Text>
                                                </View> 
                                            </View>

                                            {getPageDataStudentAnswer()?.map((question, index) =>     
                                                <View style={styles.wrapQuestion} key={question.idAssignmentItem}> 
                                                    <View style={styles.headerQ}>
                                                        <Text style={styles.title}>Question {index + (currentPageStudentAnswer - 1) * numberItem + 1}</Text>
                                                        <Text style={styles.textGray12}>{ question.studentMark && `${question.studentMark}/`}{question.questionMark} mark</Text>
                                                    </View>
                                                    <Text style={styles.questionContent}>{question.question}</Text>
                                                    {data.assignmentType === 1 ?
                                                        <>
                                                            {/* Manual */}
                                                            {question.attachedFile &&
                                                                <View>
                                                                    <Text style={styles.textGray12}>Reference material:</Text>
                                                                    <TouchableOpacity style={styles.wrapFile} onPress={()=>openURL(question.attachedFile)}>
                                                                        <Text>{question.nameFile}</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            }
                                                            <View>
                                                                <Text style={styles.textGray12}>Answer:</Text>
                                                                <Text style={styles.inputLabelGray}>Answer......</Text>
                                                                <View style={[styles.topBorder]}>   
                                                                    <View style={styles.width50}>
                                                                        <TextInputLabelGray 
                                                                            label={"Mark*"} placeholder={"Mark"} type={"numeric"} value={question.studentMark} 
                                                                            onchangeText={(v)=>{}}
                                                                        />
                                                                    </View>                                                             
                                                                </View>  
                                                            </View>
                                                        </>
                                                        :
                                                        <>
                                                            {/* Quiz */}
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
                                                                            <Text style={[styles.boxChoice, item.isCorect ? styles.boxColorGreen : (item.isSelected && !item.isCorect) ? styles.boxColorRed : ""]}>{item.content}</Text>
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
                                                                            <Text style={[styles.boxChoice, item.isCorect ? styles.boxColorGreen : (item.isSelected && !item.isCorect) ? styles.boxColorRed : ""]}>{item.content}</Text>
                                                                        </View>
                                                                    )
                                                                }
                                                            </View>
                                                        </>                                                        
                                                    }
                                                </View>
                                            )}   

                                            {/* paginage */}
                                            <View style={styles.bottom}>
                                                {getPagination(currentStudentAnswer, currentPageStudentAnswer).map((page, index) => 
                                                    page !== "..." ? 
                                                    <TouchableOpacity 
                                                        style={[styles.wrapNumber, page === currentPageStudentAnswer && {backgroundColor: COLORS.main}]} 
                                                        onPress={()=>setCurrentPageStudentAnswer(page)}
                                                        key={index}
                                                    >
                                                        <Text style={[styles.bottomNumber, page === currentPageStudentAnswer && {color: "white"}]}>{page}</Text>
                                                    </TouchableOpacity>
                                                    :
                                                    <View style={styles.wrapNumber} key={index}>
                                                        <Text style={styles.bottomNumber}>{page}</Text>
                                                    </View>
                                                )}
                                            </View>        
                                        </View>
                                    </>
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
            <Modal
                visible={isOpenModal}
                transparent={true}
                animationType="fade"
                onRequestClose={()=>setIsOpenModal(false)}
            >
                <FilterStudentOverview dataFilter={filterStudent} setDataFilter={setFilterStudent} onPressCancel={()=>setIsOpenModal(false)}/>
            </Modal>
            <Modal
                visible={isChangeSetting}
                transparent={true}
                animationType="fade"
            >
                <TouchableWithoutFeedback onPress={() => setIsChangeSetting(false)}>
                    <View style={styles.modalWrapper}>
                        <View style={styles.openModal}>
                            <View style={[styles.btnOpenModal, {borderBottomWidth: 1}]}>
                                <Text>Question Shuffling</Text>
                                <CustomSwitch value={data.isShufflingQuestion} onChangeText={()=>{}}/>  
                            </View>
                            <View style={[styles.btnOpenModal, {borderBottomWidth: 1}]}>
                                <Text>Answer Shuffling</Text>
                                <CustomSwitch value={data.isShufflingAnswer} onChangeText={()=>{}}/>  
                            </View>
                            <View style={styles.btnOpenModal}>
                                <Text>Show answer on submit</Text>
                                <CustomSwitch value={data.showAnswer} onChangeText={()=>{}}/>  
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
    containerHorizontal:{
        paddingHorizontal: 16,
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
    textBBlack18:{
        fontSize: 18,
        color: "black",
        fontWeight: "bold"
    },
    wrapFlex:{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    wrapFlexJustify:{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
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
        marginVertical: 4,
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
        fontWeight: "500",
        textAlign: "justify"
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
    wrapAlignRight: {
        justifyContent: "flex-end",
        gap: 12,
        
    },
    textAlignRight: {
        textAlign: "right",
    },
    circleStatus:{
        width: 16,
        height: 16,
        backgroundColor: COLORS.lightText,
        borderRadius: 90
    },
    bgGreen: {
        backgroundColor: COLORS.green
    },
    bgYellow: {
        backgroundColor: COLORS.yellow
    },
    borderRight:{
        borderRightWidth: 1,
        paddingHorizontal: 8,
        borderColor: COLORS.lightText
    },
    wrapTopOverview:{
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        gap: 8
    },
    wrapperSearch: {
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
    },
    input:{
        fontSize: 16,
        width: "90%"
    },
    wrapList:{
        marginVertical: 12,
        gap: 8
    },
    widthFlex1:{
        flex: 1
    },
    wrapSwitch:{
        alignSelf: "flex-end", 
        marginVertical: 8
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
    boxColorGreen:{
        backgroundColor: "#B2E0C8",
    },
    boxColorRed:{
        backgroundColor: "#E6B1B0",
    },
    boxChoice:{
        flex: 1,
        borderRadius: 2
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
    topBorder:{
        borderTopWidth: 1,
        borderColor: COLORS.lightText,
        marginTop: 8,
        paddingTop: 4,
    },
    width50:{
        width: "50%"
    },
    btnBorderGray:{
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        alignItems: "center",
        borderWidth: 1,
        backgroundColor: COLORS.main
    },
})