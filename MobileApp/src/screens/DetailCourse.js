import { ActivityIndicator, Dimensions, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import DefaultAva from "../../assets/images/DefaultAva.png"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { COLORS, commonStyles } from "../utils/constants"
import { Tag } from "../components/Tag"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatDateTime } from "../utils/utils";
import { useUser } from "../contexts/UserContext";
import { CardHorizontalTeacher } from "../components/CardHorizontal";
import { CardReview } from "../components/CardReview";
import { ButtonGreen, ButtonIcon, ButtonIconLightGreen } from "../components/Button";
import { CardLecture } from "../components/CardLecture";
import { useEffect, useState } from "react";
import { CardAssignment, CardAssignmentStudent } from "../components/CardAssignment";
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from "expo-linear-gradient";
import { getCourseDetail } from "../services/course";
import { useNavigation } from "@react-navigation/native"
import { CardNoti } from "../components/CardNotification"
import { CardVirticalAssignmentTeacher } from "../components/CardVertical"
import { CardStudentAttendance } from "../components/CardStudent"
import { Modal } from "react-native"
import { TextInputLabel } from "../components/TextInputField"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const initCourse={
    idCourse: 1,
    img: "",
    title: "Title",
    listTags: [
        { id: 1, value: "Web developer"},
        { id: 2, value: "Backend"},
        { id: 3, value: "Frontend"},
    ],
    startCourse: new Date(),
    endCourse: new Date(),
    startRegist: new Date(),
    endRegist: new Date(),
    isRegist: true,
    cost: 120,
    costSale: 100,
    nameCenter: "Center ABC",
    star: 4.5,
    students: 500,
    intro: "Intro about this course",

    content: [
        {
            section: 1,
            lecture: [
                {
                    title: "Title",
                    introduction: "introduction",
                    exercise: 0
                },
                {
                    title: "Title",
                    introduction: "introduction",
                    exercise: 3
                },
            ]
        },
        {
            section: 2,
            lecture: [
                {
                    title: "Title2",
                    introduction: "introduction2",
                    exercise: 1
                },
            ]
        },
    ],
    test:[
        {
            id: 1,
            title: "Title",
            introduction: "introduction",
            due: new Date(),
            duration: 45,
        },
        {
            id: 2,
            title: "Title2",
            introduction: "Introduction2222222",
            due: null,
            duration: 45,
        },
        {
            id: 3,
            title: "Title3",
            introduction: "Introduction3",
        },
        {
            id: 4,
            title: "Title4",
            introduction: "Intro",
            duration: 45,
        },
    ],
    reviews: [
        {
            id: 1,
            star: 4,
            title: "Title",
            reviewBoby: "ReviewBoby",
            Reviewer: {
                img: "",
                name: "Name reviewer"
            },
            date: new Date()
        },
        {
            id: 2,
            star: 2,
            title: "Title2",
            reviewBoby: "ReviewBoby2",
            Reviewer: {
                img: "",
                name: "Name reviewer2"
            },
            date: new Date()
        },
    ],
    teacher: {

    },
}

export const DetailCourse =({route})=>{
    const navigation = useNavigation()
    const idCourse = route.params?.idCourse || 0
    const role = route.params?.role || 0 //0: guest, 1: teacher, 2: student
    const [data, setData] = useState([])
    const {state, dispatch} = useUser()
    const [selectBtn, setSelectBtn] = useState(0)
    const [loading, setLoading] = useState(true);

    const [isAddNoti, setIsAddNoti] = useState(false);
    const [notiTitle, setNotiTitle] = useState("");
    const [notiBody, setNotiBody] = useState("");

    const [isAddSection, setIsAddSection] = useState(false);
    const [newSection, setNewSection] = useState("");

    const [showSections, setShowSections] = useState([])

    const getCourse = async()=>{
        try {
            const response = await getCourseDetail(idCourse)
            if(response){
                setData(response)
                if(response.sectionsWithCourses.length > 0){
                    setShowSections(response.sectionsWithCourses.map(item => (
                        {
                            idSection: item.idSection,
                            isShow: true
                        }
                    )))
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getCourse()
    }, [idCourse])

    const handleShowSection = (idSection)=>{
        const newShow = showSections.map(item => {
            if(item.idSection === idSection){
                return{
                    ...item,
                    isShow: !item.isShow
                }
            }
            return item
        })
        setShowSections(newShow)
    }
    
    if (loading) {
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
                    {data.introduction && 
                        <Text style={styles.infoText}>{data.introduction}</Text>
                    }
                    <View style={styles.inforContent}>
                        <Feather name="clock" size={16} color="white" />
                        <Text style={styles.infoText}>
                            { data.startCourse ?                                                       
                                formatDateTime(data.startCourse) - formatDateTime(data.endCourse)
                                :
                                "Create on: " + formatDateTime(data.createdDate)
                            }
                        </Text>
                    </View>
                    <View style={styles.inforContent}>
                    {data.startRegist &&
                            <FontAwesome6 name="pen-to-square" size={16} color="white" />
                        }
                        {data.startRegist &&
                            <Text style={styles.infoText}>
                                {data.isRegist ? "Registing" : 
                                    `${formatDateTime(data.startCourse)} - ${formatDateTime(data.endCourse)}`}
                            </Text>
                        }
                    </View>
                    {data.students? 
                        <View style={styles.inforContent}>
                            <MaterialCommunityIcons name="account-group-outline" size={16} color="white" />
                            <Text style={styles.infoText}>{data.studentCount} students</Text>
                        </View>
                        : ""
                    }
                    <View style={styles.inforContent}>
                        <Text style={styles.costSale}>${data.price}</Text>
                        <Text style={styles.cost}>{data.price}</Text>
                    </View>
                    {state.idRole === 3 &&
                        <TouchableOpacity style={styles.infoBtn}>
                            <Text style={styles.infoBtnText}>Pay for this course</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>

            <View style={styles.wrapMiniCard}>
                {/* Teacher */}
                <TouchableOpacity onPress={()=> navigation.navigate("Detail Teacher", { idTeacher: data.idTeacher })}>
                    <LinearGradient 
                        colors={['#4D768A', '#75A2A2']} 
                        style={styles.miniCard}
                        start={{ x: 0, y: 0 }} // Bắt đầu từ bên trái
                        end={{ x: 1, y: 0 }} // Kết thúc ở bên phải
                    >
                        <View style={styles.titleCard}>
                            <FontAwesome6 name="graduation-cap" size={16} color={COLORS.secondMain} />
                            <Text style={styles.titleCardText}>Teacher</Text>
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
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                        <Text style={selectBtn === 1 ? styles.selectBtn : styles.normalBtn}>Test</Text>
                    </TouchableOpacity>
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
                </View>
                {selectBtn === 0 ?
                    <>
                        {/* Course contents */}
                        {role === 1 &&
                            <ButtonIconLightGreen 
                                title={"Add new section"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}
                                action={()=>setIsAddSection(true)}    
                            />
                        }
                        {data.sectionsWithCourses?.length > 0 &&
                        data.sectionsWithCourses?.map((item)=>{
                            let checkIsShow = showSections.find(section => section.idSection === item.idSection).isShow
                            return(
                                <View key={item.idSection} style={styles.wrapSectionLecture}>
                                    <TouchableOpacity style={styles.wrapSection} onPress={()=>handleShowSection(item.idSection)}>
                                        <Text style={[styles.section, {flex: 1}]}>
                                            Section {item.idSection} 
                                        </Text>
                                        <Text style={styles.section}>
                                            {item.lectureCount > 1 ? "lectures" : "lecture"}
                                        </Text>
                                        { checkIsShow ?
                                            <Entypo name="chevron-up" size={20} color="black" />
                                            :
                                            <Entypo name="chevron-down" size={20} color="black" />
                                        }
                                    </TouchableOpacity>
                                    <View style={[styles.wrapShow, {height: checkIsShow? "auto" : 0}]}>
                                        {item.lectures.map(lec => 
                                            <CardLecture data={lec} key={lec.idLecture}/>
                                        )}
                                        {role === 1 &&
                                            <View style={{flexDirection: "row", justifyContent: "space-between", backgroundColor: "white"}}>
                                                <TouchableOpacity style={styles.addLec}>
                                                    <Entypo name="plus" size={14} color={COLORS.main} />
                                                    <Text style={styles.addLecText}>Add new lecture</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.addLec}>
                                                    <Text style={[styles.addLecText, {color: COLORS.red}]}>Delete this section</Text>
                                                    <MaterialIcons name="delete" size={14} color={COLORS.red} />
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                </View>
                            )}
                        )}
                    </>
                : selectBtn === 1 ?
                    <>
                        {/* Course assignments */}
                        {role === 1 &&
                            <ButtonIconLightGreen title={"Add new test"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}/>
                        }
                        <View style={[styles.wrapShow, {height: 390}]}>
                            {data.tests.length > 0 &&
                            data.tests?.map(test => 
                                <CardAssignment data={test} key={test.idAssignment} role={role}/>
                            )}
                        </View>
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
                            {/* {data.noti?.map(item =>  */}
                                <CardNoti role={role}/>
                            {/* )} */}
                        </View>
                    </>
                : selectBtn === 3 ?
                <View style={styles.wrapShow}>
                    {/* {data.attendance?.map(item =>  */}
                        <CardStudentAttendance/>
                    {/* )} */}
                </View>
                : ""}
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
                        setNotiTitle("")
                        setNotiBody("")
                    }}>
                        <AntDesign name="close" size={30} color={COLORS.secondMain} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: "bold"}}>Add new notification</Text>
                    <TextInputLabel label={"Title"} value={notiTitle} placeholder={"Title"} onchangeText={setNotiTitle}/>
                    <TextInputLabel label={"Content"} value={notiBody} placeholder={"Content"} onchangeText={setNotiBody}/>
                    <ButtonGreen title={"Save"}/>
                </View>
            </View>
        </Modal>

        {/* Add Section */}
        <Modal
            visible={isAddSection}
            transparent={true}
            animationType="fade"
            onRequestClose={()=>setIsAddSection(false)}
        >
            <View style={styles.selectImgWrapper}>
                <View style={styles.addNoti}>
                    <TouchableOpacity style={styles.close} onPress={()=>{
                        setIsAddSection(false)
                        setNewSection("")
                    }}>
                        <AntDesign name="close" size={30} color={COLORS.secondMain} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: "bold"}}>Add new section</Text>
                    <TextInputLabel label={"Name section"} value={newSection} placeholder={"Name section"} onchangeText={setNewSection}/>
                    <ButtonGreen title={"Save"}/>
                </View>
            </View>
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
        color: "white"
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
        height: "auto"
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
        width: 300,
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
    }
})

