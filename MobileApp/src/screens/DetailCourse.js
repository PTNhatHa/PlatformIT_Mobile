import { ActivityIndicator, Alert, Dimensions, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import DefaultAva from "../../assets/images/DefaultAva.png"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { COLORS, commonStyles } from "../utils/constants"
import { Tag } from "../components/Tag"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { calculateRelativeTime, formatDateTime, parseRelativeTime } from "../utils/utils";
import { useUser } from "../contexts/UserContext";
import { CardHorizontalTeacher } from "../components/CardHorizontal";
import { CardReview } from "../components/CardReview";
import { ButtonGreen, ButtonIcon, ButtonIconLightGreen } from "../components/Button";
import { CardLecture } from "../components/CardLecture";
import { useEffect, useState } from "react";
import { CardAssignment, CardAssignmentStudent } from "../components/CardAssignment";
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from "expo-linear-gradient";
import { enrollCourse, getCourseDetail, getCourseProgress, getCourseProgressByIdStudent, getSectionDetail, getTestOfCourseStudent, isEnrolledCourse } from "../services/course";
import { useNavigation } from "@react-navigation/native"
import { CardNoti } from "../components/CardNotification"
import { CardVirticalAssignmentTeacher } from "../components/CardVertical"
import { CardStudentAttendance } from "../components/CardStudent"
import { Modal } from "react-native"
import { TextInputLabel } from "../components/TextInputField"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { ModalCourseContent } from "../components/ModalCourseContent"
import { addBoardNotificationForCourse, getNotificationBoardOfCourse } from "../services/notification"
import { isChatAvailable } from "../services/user"
import { FilterStudentProgress } from "../components/Filter"
import { ProgressCircle } from "../components/Progress"

export const DetailCourse =({route})=>{
    const navigation = useNavigation()
    const idCourse = route.params?.idCourse || 0
    const initRole = route.params?.role || 0 //0: guest, 1: teacher, 2: student
    const [role, setRole] = useState(initRole)
    const [data, setData] = useState([])
    const {state, dispatch} = useUser()
    const [selectBtn, setSelectBtn] = useState(0)
    const [loading, setLoading] = useState(true);

    const [isAddNoti, setIsAddNoti] = useState(false);
    const [notiContent, setNotiContent] = useState("");
    const [listNoti, setListNoti] = useState([]);
    const [isChat, setIsChat] = useState(false)
    
    const [studentTest, setStudentTest] = useState([])
    const [studentList, setStudentList] = useState([])
    const [currentStudentList, setCurrentStudentList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const numberItem = 5
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [search, setSearch] = useState("")
    const [filterStudent, setFilterStudent] = useState([])

    const [progress, setProgress] = useState({})
    const [listSection, setListSection] = useState([])

    const getCourse = async()=>{
        try {
            const response = await getCourseDetail(idCourse)
            if(response){
                setData(response)
                setListSection(response.sectionsWithCourses)
                if(state.idRole === 4 && response.idTeacher === state.idUser) setRole(1)
                if(state.idRole === 3){
                    checkStudentIsEnrollCourse()
                    const check = await isChatAvailable(state.idUser, response.idTeacher)
                    if(check === true){
                        setIsChat(true)

                    }
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const getNoti = async()=>{
        try {
            const response = await getNotificationBoardOfCourse(idCourse)
            if(response){
                const newNoti = response.map(noti => {
                    return{
                        ...noti,
                        timestamp: parseRelativeTime(noti.relativeTime),
                    }
                })
                setListNoti(newNoti)
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const getAttendance = async()=>{
        try {
            const response = await getCourseProgress(idCourse)
            if(response){
                setStudentList(response)
                setCurrentStudentList(response.courseStudentProgress)
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const getPagination = () => {
        const totalPages = Math.ceil(currentStudentList.length / numberItem)
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
        return currentStudentList.slice((currentPage-1) * numberItem, currentPage * numberItem);
    };

    const checkStudentIsEnrollCourse = async()=>{
        try {
            const response = await isEnrolledCourse(state.idUser, idCourse)
            if(response === true){
                setRole(2)
                // Get test of student
                const testOfStudent = await getTestOfCourseStudent(state.idUser, idCourse)
                if(testOfStudent){
                    setStudentTest(testOfStudent)
                }
                // Progress
                const progress = await getCourseProgressByIdStudent(idCourse, state.idUser)
                if(progress){
                    setProgress(progress)
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useEffect(()=>{
        try {
            getCourse()
            getAttendance()
            getNoti()
            const interval = setInterval(() => {
                setListNoti((prevNotifications) =>
                  prevNotifications.map((notification) => ({
                    ...notification,
                    relativeTime: calculateRelativeTime(notification.timestamp),
                  }))
                );
              }, 60000); // Update every minute
          
              return () => clearInterval(interval);
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false)
        }
    }, [idCourse])

    const addNoti = async()=>{
        if(!notiContent){
            Alert.alert("Warning", "Please write something before save.")
            return
        }
        try {
            const response = await addBoardNotificationForCourse(idCourse, notiContent, state.idUser)
            if(response){
                Alert.alert("Add notification", response)
                setIsAddNoti(false)
                setNotiContent("")
                getNoti()
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const payCourse = ()=>{
        const callApi = async()=>{
            try {
                const response = await enrollCourse(state.idUser, idCourse)
                if(response.code){
                    Alert.alert("Warning", response.message)
                } else{
                    Alert.alert("Done", response)
                    checkStudentIsEnrollCourse()
                }
            } catch (error) {
                console.log(error);
            }
        }
        Alert.alert(
            "Confirm enroll",
            "Are you sure you want to enroll this course?",
            [
                {
                    text: "Yes",
                    onPress: ()=> callApi(),
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
                    return bValue.localeCompare(aValue)
                }
                return 0
            })
        }
        return newData || []
    }
    const handleSearch =(initData, searchText)=>{
        let newData = [...initData]
        if(searchText !== null){
            return newData.filter(item => {
                return item.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.email?.toLowerCase().includes(searchText.toLowerCase())
            })
        }
        return []
    }

    useEffect(()=>{
        if(search || filterStudent){
            let result = studentList.courseStudentProgress ? [...studentList.courseStudentProgress] : []
            if(filterStudent){
                result = handleFilter(result, filterStudent)
            }
            result = handleSearch(result, search)
            setCurrentStudentList(result)
        }
    }, [search, filterStudent])

    const reloadListSection = async()=>{
        setLoading(true)
        try {
            const response = await getSectionDetail(idCourse)
            if(response){
                setListSection(response)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false)
        }
    }
    if (loading === true) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }

    return(
        <>
        <ScrollView contentContainerStyle={styles.container} key={data.idCourse}>
            {/* Course info */}
            <View style={styles.wrapInfo}>
                <ImageBackground
                    source={{ uri: data.pathImg}}
                    style={styles.infoImg}
                />
                <View style={styles.wrapInfoContent}>
                    <Text style={styles.infoTitle}>{data.courseTitle}</Text>
                    {data.tags?.length > 0 && 
                        <View style={styles.inforContent}>
                            {data.tags.map(item => 
                                <Tag label={item} key={item}/>  
                            )}                    
                        </View>
                    }                    
                    <View style={styles.inforContent}>
                        <Feather name="clock" size={16} color="white" />
                        <Text style={styles.infoText}>
                            { data.courseStartDate ?                                                       
                                `Course duration: ${formatDateTime(data.courseStartDate)} - ${formatDateTime(data.courseEndDate)}`
                                :
                                "Create on: " + formatDateTime(data.createdDate)
                            }
                        </Text>
                    </View>
                    <View style={styles.inforContent}>
                    {data.registStartDate &&
                            <FontAwesome6 name="pen-to-square" size={16} color="white" />
                        }
                        {data.registStartDate &&
                            <Text style={styles.infoText}>
                                Regist date: {formatDateTime(data.registStartDate)} - {formatDateTime(data.registEndDate)}
                            </Text>
                        }
                    </View>
                    {data.studentCount > 0 &&
                        <View style={styles.inforContent}>
                            <MaterialCommunityIcons name="account-group-outline" size={16} color="white" />
                            <Text style={styles.infoText}>{data.studentCount} students</Text>
                        </View>
                    }
                    <View style={styles.inforContent}>
                        <Text style={styles.costSale}>{data.price ? `${data.price}VND` : "Free"}</Text>
                        {data.discountedPrice &&
                            <Text style={styles.cost}>{data.discountedPrice}</Text>
                        }
                    </View>
                    {new Date(data.registStartDate) <= new Date() && new Date() <= new Date(data.registEndDate) ?
                        <>
                            {(state.idRole === 3 && role === 0) &&
                                <TouchableOpacity style={styles.infoBtn} onPress={()=>payCourse()}>
                                    <Text style={styles.infoBtnText}>Pay for this course</Text>
                                </TouchableOpacity>
                            }                                                            
                            {role === 2 &&
                                <TouchableOpacity style={styles.infoBtn}>
                                    <Text style={styles.infoBtnText}>View payment history</Text>
                                </TouchableOpacity>
                            }
                        </>
                        : data.price === null ?
                        <>
                            {(state.idRole === 3 && role === 0) &&
                                <TouchableOpacity style={styles.infoBtn} onPress={()=>payCourse()}>
                                    <Text style={styles.infoBtnText}>Pay for this course</Text>
                                </TouchableOpacity>
                            }
                        </>
                        :""
                    }
                </View>
            </View>
            {data.introduction && 
                <View style={styles.wrapperGray}>
                    <Text style={styles.titleContentCard}>Introduction</Text>
                    <Text style={styles.infoText}>{data.introduction}</Text>
                </View>
            }
            
            <View style={styles.wrapMiniCard}>
                {/* Teacher */}
                {role !== 1 &&
                    <TouchableOpacity onPress={()=> navigation.navigate("Detail Teacher", { idTeacher: data.idTeacher })}>
                        <LinearGradient 
                            colors={['#4D768A', '#75A2A2']} 
                            style={styles.miniCard}
                            start={{ x: 0, y: 0 }} // Bắt đầu từ bên trái
                            end={{ x: 1, y: 0 }} // Kết thúc ở bên phải
                        >
                            <View style={styles.wrapFlex}>
                                <View style={styles.titleCard}>
                                    <FontAwesome6 name="graduation-cap" size={16} color={COLORS.secondMain} />
                                    <Text style={styles.titleCardText}>Teacher</Text>
                                </View>
                                {isChat &&
                                    <TouchableOpacity style={[styles.titleCard, {backgroundColor: COLORS.main30}]}>
                                        <Ionicons name="chatbubble-outline" size={16} color="black" />
                                        <Text style={[styles.titleCardText, {color: "black"}]}>Contact</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            <View style={styles.contentCard}>
                                <Image source={data.teacherAvatarPath ? {uri: data.teacherAvatarPath} : DefaultAva} style={styles.avata}/>
                                <View>
                                    <Text style={styles.titleContentCard}>{data.teacherName}</Text>
                                    <Text style={styles.dataText}>{data.teacherDescription}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                }

                {/* Center */}
                <TouchableOpacity  onPress={()=> navigation.navigate("Detail Center", {idCenter : data.idCenter})}>
                    <LinearGradient 
                        colors={['#4D768A', '#75A2A2']} 
                        style={styles.miniCard}
                        start={{ x: 0, y: 0 }} // Bắt đầu từ bên trái
                        end={{ x: 1, y: 0 }} // Kết thúc ở bên phải
                    >
                        <View style={styles.titleCard}>
                            <Ionicons name="business" size={16} color={COLORS.secondMain} />
                            <Text style={styles.titleCardText}>Center</Text>
                        </View>
                        <View style={styles.contentCard}>
                            <Image source={data.centerAvatarPath ? {uri: data.centerAvatarPath} : DefaultImg} style={styles.avata}/>
                            <View>
                                <Text style={styles.titleContentCard}>{data.centerName}</Text>
                                <Text style={styles.dataText}>{data.centerDescription}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            
            {/* Course review */}
            <View style={styles.wrapper}>
                <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={styles.titleCard}>
                        <AntDesign name="star" size={16} color={COLORS.yellow}/>
                        <Text style={styles.titleCardText}>{data.totalRatePoint} Rating</Text>
                    </View>
                    {role === 2 &&
                        <View style={styles.titleCard}>
                            <FontAwesome5 name="edit" size={16} color={COLORS.secondMain}/>
                            <Text style={styles.titleCardText}>Write a review</Text>
                        </View>
                    }
                </View>
                <FlatList
                    data={data.rateModels}
                    keyExtractor={item => item.idRating}
                    renderItem={({item})=>
                        <CardReview data={item}/>
                    }
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            <View style={styles.wrapperBottom}>
                <View style={styles.board}>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(0)}>
                        <Text style={selectBtn === 0 ? styles.selectBtn : styles.normalBtn}>Content</Text>
                    </TouchableOpacity>
                    {data.isLimitedTime === 1 &&
                        <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                            <Text style={selectBtn === 1 ? styles.selectBtn : styles.normalBtn}>Test</Text>
                        </TouchableOpacity>
                    }
                    {role !== 0 &&
                        <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(2)}>
                            <Text style={selectBtn === 2 ? styles.selectBtn : styles.normalBtn}>Noti</Text>
                        </TouchableOpacity>
                    }
                    {role === 1 &&
                        <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(3)}>
                            <Text style={selectBtn === 3 ? styles.selectBtn : styles.normalBtn}>Attendance</Text>
                        </TouchableOpacity>
                    }
                    {role === 2 &&
                        <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(4)}>
                            <Text style={selectBtn === 4 ? styles.selectBtn : styles.normalBtn}>Progress</Text>
                        </TouchableOpacity>
                    }
                </View>
                {selectBtn === 0 ?
                    <>
                        {/* Course contents */}
                        <ModalCourseContent 
                            role={role} 
                            content={listSection} 
                            idCourse={data.idCourse} 
                            nameCourse={data.courseTitle}
                            getCourse={reloadListSection}

                            isLimitedTime={data.isLimitedTime}
                            courseEndDate={data.courseEndDate}
                            idTeacher={data.idTeacher}
                        />
                    </>
                : selectBtn === 1 ?
                    <>
                        {/* Course assignments */}
                        {role === 0 &&
                            <View style={[styles.wrapShow]}>
                                {data.tests.length > 0 &&
                                    data.tests.map(test => 
                                        <CardAssignment data={test} key={test.idAssignment} role={role}/>
                                    )}
                            </View>
                        }
                        {role === 1 && data.isLimitedTime &&
                            <>
                                <ButtonIconLightGreen 
                                    title={"Add new test"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}
                                    action={()=>navigation.navigate("Create Test", {
                                        idCourse: idCourse, 
                                        nameCourse: data.courseTitle,
                                        isLimitedTime: data.registStartDate !== null ? 1 : 0,
                                        courseEndDate: data.courseEndDate || "",
                                        reload: ()=>{
                                            getCourse()
                                            getNoti()
                                        }
                                    })}
                                />
                                <View style={[styles.wrapShow]}>
                                    {data.tests.length > 0 &&
                                        data.tests.map(test => 
                                            <CardAssignment data={test} key={test.idAssignment} role={role} isDetail={role === 1}/>
                                        )}
                                </View>
                            </>
                        }
                        {role === 2 &&
                            <View style={[styles.wrapShow]}>
                                {studentTest.length > 0 &&
                                    studentTest.map(test => 
                                        <CardAssignment data={test} key={test.idAssignment} role={role}/>
                                    )}
                            </View>
                        }
                    </>
                
                : selectBtn === 2 ?
                    <>
                        {role === 1 &&
                            <ButtonIconLightGreen 
                                title={"Add new noti"} 
                                icon={<Entypo name="plus" size={14} color={COLORS.main} />}
                                action={()=>{
                                    setIsAddNoti(true)
                                }}
                            />
                        }
                        <View style={styles.wrapShow}>
                            {listNoti.length > 0 &&
                                listNoti?.map(item => 
                                    <CardNoti role={role} data={item} key={item.idNotification}/>
                            )}
                        </View>
                    </>
                : selectBtn === 3 ? 
                    // Attendance
                    <View style={styles.wrapShow}>
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
                        {getPageData().map(item => 
                            <CardStudentAttendance 
                                data={item} lectureCount={studentList.lectureCount} assignmentCount={studentList.assignmentCount}
                                key={item.idStudent} idCourse={idCourse}
                            />
                        )}
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
                : selectBtn === 4 ? 
                    <>
                        <View style={styles.wrapProgress}>
                            <ProgressCircle done={progress.courseStudentProgress[0].finishedLectureCount} all={progress.lectureCount}/>
                            <Text style={styles.nameProgress}>Lecture</Text>
                        </View>
                        <View style={styles.wrapProgress}>
                            <ProgressCircle done={progress.courseStudentProgress[0].finishedAssignmentCount} all={progress.assignmentCount}/>
                            <Text style={styles.nameProgress}>Assignment</Text>
                        </View>
                    </>
                    :""
                }
            </View>     
        </ScrollView>

        {/* Add Notification */}
        <Modal
            visible={isAddNoti}
            transparent={true}
            animationType="fade"
            onRequestClose={()=>setIsAddNoti(false)}
        >
            <View style={styles.selectImgWrapper}>
                <View style={styles.addNoti}>
                    <TouchableOpacity style={styles.close} onPress={()=>{
                        setIsAddNoti(false)
                        setNotiContent("")
                    }}>
                        <AntDesign name="close" size={30} color={COLORS.secondMain} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: "bold"}}>Add new notification</Text>
                    <TextInputLabel label={"Content"} value={notiContent} placeholder={"Content"} onchangeText={setNotiContent}/>
                    <ButtonGreen title={"Save"} action={addNoti}/>
                </View>
            </View>
        </Modal>
        {loading &&
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color="white" />
            </View>
        }
        <Modal
            visible={isOpenModal}
            transparent={true}
            animationType="fade"
            onRequestClose={()=>setIsOpenModal(false)}
        >
            <FilterStudentProgress dataFilter={filterStudent} setDataFilter={setFilterStudent} onPressCancel={()=>setIsOpenModal(false)}/>
        </Modal>
        </>
    )
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        // padding: 16,
        backgroundColor: "#FAFAFA"
    },
    wrapper: {
        padding: 12,
        marginHorizontal: 16,
        rowGap: 10,
        backgroundColor: "#4D768A",
        borderRadius: 8
    },
    wrapperGray: {
        padding: 12,
        marginHorizontal: 16,
        rowGap: 10,
        backgroundColor: COLORS.secondMain,
        borderRadius: 8,
        marginTop: 8
    },
    inforContent:{
        flexDirection: "row",
        columnGap: 4,
        alignItems: "center"
    },
    infoTitle:{
        fontSize: 24,
        fontWeight: "bold",
        color: "white"
    },
    infoText: {
        fontSize: 14,
        color: "white",
        textAlign: "justify"
    },
    costSale:{
        fontSize: 16,
        fontWeight: "bold",
        color: "white"
    },
    cost: {
        fontSize: 10,
        textDecorationLine: 'line-through',
        color: COLORS.lightText
    },
    infoBtn:{
        alignItems: "center",
        backgroundColor: "#9BBBBB",
        padding: 8,
        borderRadius: 16,
        marginTop: 8
    },
    infoBtnText: {
        color: "black",
        fontWeight: "bold"
    },
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
        height: "auto",
        gap: 4
    },
    showAll:{
        alignItems: "center"
    },
    wrapSectionLecture:{
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.lightText
    },


    wrapInfo: {
        ...commonStyles.shadow,
        height: width*2/3,
    },
    infoImg:{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapInfoContent: {
        position: "absolute",
        width: '100%',
        height: '100%',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: "flex-end",
    },
    btnUpDown:{
        position: "absolute",
        alignItems: "center",
        bottom: 10,
        left: 0,
        right: 0
    },
    wrapMiniCard:{
        padding: 16,
        rowGap: 8
    },
    miniCard:{
        borderRadius: 8,
        padding: 12,
        rowGap: 10,
    },
    avata: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 40,
        height: 40,
        backgroundColor: "white"
    },
    titleCard:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "white",
        borderRadius: 4,
        alignSelf: "flex-start",
        flexDirection: "row",
        columnGap: 4,
        alignItems: "center"
    },
    titleCardText: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.secondMain
    },
    contentCard: {
        flexDirection: "row",
        columnGap: 8
    },
    titleContentCard:{
        fontSize: 16,
        fontWeight: "bold",
        flexWrap: "wrap",
        color: "white",
    },
    wrapperBottom: {
        padding: 16,
        rowGap: 10,
        minHeight: 600
    },
    board: {
        flexDirection: "row",
        columnGap: 4,
    },
    boardBtn: {
        justifyContent: "center"
    },
    normalBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        color: COLORS.stroke,
        fontWeight: "bold",
    },
    selectBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 18,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderBottomColor: COLORS.main
    },
    dataText:{
        color: "white",
        flexWrap: "wrap",
        width: 290,
        textAlign: "justify"
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
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
    wrapFlex:{
        flexDirection: "row",
        justifyContent: "space-between"
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
    wrapperSearch: {
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
        borderColor: COLORS.lightText,
        borderWidth: 1
    },
    input:{
        fontSize: 16,
        width: "90%"
    },
    wrapProgress:{
        alignItems: "center",
        marginVertical: 16
    },
    nameProgress:{
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.main
    },
})

