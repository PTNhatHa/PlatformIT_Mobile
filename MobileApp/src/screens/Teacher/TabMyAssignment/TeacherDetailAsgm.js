
import { ActivityIndicator, Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AssignmentItemAnswerType, COLORS, commonStyles, typeAssignment } from "../../../utils/constants"
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ButtonGreen } from "../../../components/Button";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import { getAssignmentInfo, getOverviewAssignment } from "../../../services/assignment";
import { useNavigation } from "@react-navigation/native";
import { formatDateTime } from "../../../utils/utils";
import { RadioView } from "../../../components/RadioBtn";
import CheckBox from "react-native-check-box";
import { SubmittedCircle } from "../../../components/SubmittedCircle";
import Feather from '@expo/vector-icons/Feather';
import { CardStudentDetailAsgm } from "../../../components/CardStudent";
import { FilterStudentOverview } from "../../../components/Filter";

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

    const getPageData = () => {
        return listQuestion.slice((currentPage-1) * numberItem, currentPage * numberItem);
    };
    const getPageDataStudent = () => {
        return currentOverview.slice((currentPageStudent-1) * numberItem, currentPageStudent * numberItem);
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
                                {(data.assignmentType === 1 && listQuestion !== null) ? 
                                    getPageData()?.map((question, index) =>     
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
                                    ) :""
                                }
                                {(data.assignmentType === 2 && listQuestion !== null) && 
                                    getPageData()?.map((question, index) =>     
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
                                    )
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
                                            <CardStudentDetailAsgm data={student} key={student.idStudent} isPastDue={((data.dueDate && new Date() > new Date(data.dueDate)) || (data.courseEndDate  && new Date() > new Date(data.courseEndDate)))}/>
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
    textBBlack18:{
        fontSize: 18,
        color: "black",
        fontWeight: "bold"
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
        fontWeight: "500",
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
    }
})