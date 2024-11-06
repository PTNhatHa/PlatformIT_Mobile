import { Dimensions, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../../../utils/constants"
import { Tag } from "../../../components/Tag"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatDateTime } from "../../../utils/utils";
import { useUser } from "../../../contexts/UserContext";
import { CardReview } from "../../../components/CardReview";
import { CardLecture } from "../../../components/CardLecture";
import { useState } from "react";
import { CardAssignmentStudent } from "../../../components/CardAssignment";
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from "expo-linear-gradient";
import { CardStudentAttendance } from "../../../components/CardStudent";
import { CardVirticalAssignmentTeacher } from "../../../components/CardVertical";
import { CardProgress } from "../../../components/CardProgress";
import { CardNoti } from "../../../components/CardNotification";
import { ButtonIconLightGreen } from "../../../components/Button";

const initCourse={
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
    attendance: [
        {
            idUser: 1,
            avatar: "",
            fullname: "NhatHa", 
            email: "nhatha@gmail.com",
            attended: new Date(),
            learned: 7,
            lectures: 12,
            doneAsgm: 4,
            assignment: 10
        },
        {
            idUser: 2,
            avatar: "",
            fullname: "Hyy", 
            email: "hyyy@gmail.com",
            attended: new Date(),
            learned: 5,
            lectures: 12,
            doneAsgm: 7,
            assignment: 10
        },
        {
            idUser: 3,
            avatar: "",
            fullname: "Taho", 
            email: "Taho@gmail.com",
            attended: new Date(),
            learned: 9,
            lectures: 12,
            doneAsgm: 2,
            assignment: 10
        },
    ],
    noti: [
        {
            id: 1,
            title: "Notification 1",
            body: "body",
            onDate: new Date(),
        },
        {
            id: 2,
            title: "Notification 2",
            body: "body",
            onDate: new Date(),
        },
        {
            id: 3,
            title: "Notification 3",
            body: "body",
            onDate: new Date(),
        },
    ]

}

export const TeacherDetailCourse = ({data = initCourse})=>{
    const {state, dispatch} = useUser()
    const [selectBtn, setSelectBtn] = useState(0)
    const [showInfo, setShowInfo] = useState(true)
    const [showSections, setShowSections] = useState(data?.content?.map(item => (
        {
            section: item.section,
            isShow: true
        }
    )) || [])
    const handleShowSection = (idSection)=>{
        const newShow = showSections.map(item => {
            if(item.section === idSection){
                return{
                    ...item,
                    isShow: !item.isShow
                }
            }
            return item
        })
        setShowSections(newShow)
    }
    
    return(
        <ScrollView contentContainerStyle={styles.container}>
            {/* Course info */}
            <View style={styles.wrapInfo}>
                <ImageBackground
                    source={{ uri: "https://i.pinimg.com/enabled_lo/564x/63/af/bc/63afbc98994e96ae6cd3fd9b75ea2a33.jpg"}}
                    style={styles.infoImg}
                />
                <View style={styles.wrapInfoContent}>
                    <>
                        <Text style={styles.infoTitle}>{data.title}</Text>
                        {showInfo &&
                            <>
                                {data.listTags.length > 0 && 
                                    <View style={styles.inforContent}>
                                        {data.listTags.map(item => 
                                            <Tag label={item.value}/>  
                                        )}                    
                                    </View>
                                }
                                <Text style={styles.infoText}>{data.intro}</Text>
                                <View style={styles.inforContent}>
                                    <Feather name="clock" size={16} color="white" />
                                    <Text style={styles.infoText}>{formatDateTime(data.startCourse)} - {formatDateTime(data.endCourse)}</Text>
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
                                <View style={styles.inforContent}>
                                    <Ionicons name="business-outline" size={16} color="white" />
                                    <Text style={styles.infoText}>{data.nameCenter}</Text>
                                </View>
                                {data.students? 
                                    <View style={styles.inforContent}>
                                        <MaterialCommunityIcons name="account-group-outline" size={16} color="white" />
                                        <Text style={styles.infoText}>{data.students} students</Text>
                                    </View>
                                    : ""
                                }
                                <View style={styles.inforContent}>
                                    <Text style={styles.costSale}>${data.costSale}</Text>
                                    <Text style={styles.cost}>{data.cost}</Text>
                                </View>
                                {state.idRole === 3 &&
                                    <TouchableOpacity style={styles.infoBtn}>
                                        <Text style={styles.infoBtnText}>Pay for this course</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                    </>
                </View>
            </View>

            <View style={styles.wrapMiniCard}>
                {/* Teacher */}
                <TouchableOpacity>
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
                            <Image source={""} style={styles.avata}/>
                            <View>
                                <Text style={styles.titleContentCard}>Name</Text>
                                <Text style={styles.dataText}>description</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Center */}
                <TouchableOpacity>
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
                            <Image source={""} style={styles.avata}/>
                            <View>
                                <Text style={styles.titleContentCard}>Name</Text>
                                <Text style={styles.dataText}>description</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            
            {/* Course review */}
            <View style={styles.wrapper}>
                <View style={styles.titleCard}>
                    <AntDesign name="star" size={16} color={COLORS.yellow}/>
                    <Text style={styles.titleCardText}>4.8/5 Rating</Text>
                </View>
                <FlatList
                    data={data.reviews}
                    keyExtractor={item => item.id}
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
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(4)}>
                        <Text style={selectBtn === 4 ? styles.selectBtn : styles.normalBtn}>Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(2)}>
                        <Text style={selectBtn === 2 ? styles.selectBtn : styles.normalBtn}>Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(3)}>
                        <Text style={selectBtn === 3 ? styles.selectBtn : styles.normalBtn}>Noti</Text>
                    </TouchableOpacity>
                </View>
                {selectBtn === 0 ?
                    <>
                        <ButtonIconLightGreen title={"Add new section"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}/>
                        {/* Course contents */}
                        {data.content.map((item)=>{
                            let checkIsShow = showSections.find(section => section.section === item.section).isShow
                            return(
                                <View key={item.section} style={styles.wrapSectionLecture}>
                                    <TouchableOpacity style={styles.wrapSection} onPress={()=>handleShowSection(item.section)}>
                                        <Text style={[styles.section, {flex: 1}]}>
                                            Section {item.section} 
                                        </Text>
                                        <Text style={styles.section}>
                                            {item.lecture.length} {item.lecture.length > 1 ? "lectures" : "lecture"}
                                        </Text>
                                        { checkIsShow ?
                                            <Entypo name="chevron-up" size={20} color="black" />
                                            :
                                            <Entypo name="chevron-down" size={20} color="black" />
                                        }
                                    </TouchableOpacity>
                                    <View style={[styles.wrapShow, {height: checkIsShow? "auto" : 0, rowGap: 0}]}>
                                        {item.lecture.map(item => 
                                            <CardLecture data={item}/>
                                        )}
                                        <TouchableOpacity style={styles.addLec}>
                                            <Entypo name="plus" size={14} color={COLORS.main} />
                                            <Text style={styles.addLecText}>Add new lecture</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        )}
                    </>
                : selectBtn === 1 ?
                    <>
                        <ButtonIconLightGreen title={"Add new test"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}/>
                        <View style={styles.wrapShow}>
                            {data.test.map(item => 
                                <CardVirticalAssignmentTeacher key={item.id}/>
                            )}
                        </View>
                    </>
                : selectBtn === 2 ?   
                    <View style={styles.wrapShow}>
                        {data.attendance.map(item => 
                            <CardProgress data={item} key={item.id}/>
                        )}
                    </View>
                : selectBtn === 3 ?    
                    <>
                        <ButtonIconLightGreen title={"Add new noti"} icon={<Entypo name="plus" size={14} color={COLORS.main} />}/>
                        <View style={styles.wrapShow}>
                            {data.noti.map(item => 
                                <CardNoti data={item} key={item.id}/>
                            )}
                        </View>
                    </>
                :
                    <View style={styles.wrapShow}>
                        {data.attendance.map(item => 
                            <CardStudentAttendance data={item} key={item.id}/>
                        )}
                    </View>
                }
            </View>         
        </ScrollView>
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
        height: "auto",
        rowGap: 4
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
        flexDirection: "row",
        justifyContent: "space-between"
    },
    miniCard:{
        borderRadius: 8,
        padding: 12,
        rowGap: 10,
        width: 170
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
        fontWeight: "bold"
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
    }
})

