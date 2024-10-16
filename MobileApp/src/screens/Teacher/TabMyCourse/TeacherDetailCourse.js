import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import DefaultImg from "../../../../assets/images/DefaultImg.png"
import { COLORS, commonStyles } from "../../../utils/constants"
import { Tag } from "../../../components/Tag"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatDateTime } from "../../../utils/utils";
import { useUser } from "../../../contexts/UserContext";
import { CardHorizontalTeacher } from "../../../components/CardHorizontal";
import { CardReview } from "../../../components/CardReview";
import { ButtonIcon } from "../../../components/Button";
import { CardLecture } from "../../../components/CardLecture";
import { useState } from "react";
import { CardAssignmentStudent } from "../../../components/CardAssignment";

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
    teacher: {

    },
}

export const TeacherDetailCourse = ()=>{
    const data = initCourse
    const {state, dispatch} = useUser()
    const [selectBtn, setSelectBtn] = useState(0)
    const [showAllTest, setShowAllTest] = useState(false)
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
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Course Information</Text>
                <Image source={DefaultImg} style={styles.infoImage}/>
                <View style={{ rowGap: 2}}>
                    <Text style={styles.infoTitle}>{data.title}</Text>
                    {data.listTags.length > 0 && 
                        <View style={styles.inforContent}>
                            {data.listTags.map(item => 
                                <Tag label={item.value}/>  
                            )}                    
                        </View>
                    }
                    <Text style={styles.infoText}>{data.intro}</Text>
                    <View style={styles.inforContent}>
                        <AntDesign name="star" size={16} color={COLORS.yellow} />
                        <Text style={styles.infoText}>{data.star}</Text>
                    </View>
                    <View style={styles.inforContent}>
                        <Feather name="clock" size={16} color={COLORS.stroke} />
                        <Text style={styles.infoText}>{formatDateTime(data.startCourse)} - {formatDateTime(data.endCourse)}</Text>
                    </View>
                    <View style={styles.inforContent}>
                    {data.startRegist &&
                            <FontAwesome6 name="pen-to-square" size={16} color={COLORS.stroke} />
                        }
                        {data.startRegist &&
                            <Text style={styles.infoText}>
                                {data.isRegist ? "Registing" : 
                                    `${formatDateTime(data.startCourse)} - ${formatDateTime(data.endCourse)}`}
                            </Text>
                        }
                    </View>
                    <View style={styles.inforContent}>
                        <Ionicons name="business-outline" size={16} color={COLORS.secondMain} />
                        <Text style={styles.infoText}>{data.nameCenter}</Text>
                    </View>
                    {data.students? 
                        <View style={styles.inforContent}>
                            <MaterialCommunityIcons name="account-group-outline" size={16} color={COLORS.stroke} />
                            <Text style={styles.infoText}>{data.students} students</Text>
                        </View>
                        : ""
                    }
                    <View style={styles.inforContent}>
                        <Text style={styles.costSale}>${data.costSale}</Text>
                        <Text style={styles.cost}>{data.cost}</Text>
                    </View>
                </View>
                {state.idRole === 3 &&
                    <TouchableOpacity style={styles.infoBtn}>
                        <Text style={styles.infoBtnText}>View payment history</Text>
                    </TouchableOpacity>
                }
            </View>

            {/* Course contents */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Course content</Text>
                <View>
                    {data.content.map((item)=>{
                        let checkIsShow = showSections.find(section => section.section === item.section).isShow
                        return(
                            <View key={item.section} style={styles.wrapSectionLecture}>
                                <TouchableOpacity style={styles.wrapSection} onPress={()=>handleShowSection(item.section)}>
                                    { checkIsShow ?
                                        <AntDesign name="caretup" size={16} color="black" />
                                        :
                                        <AntDesign name="caretdown" size={16} color="black" />
                                    }
                                    <Text style={styles.section}>
                                        Section {item.section} 
                                        - {item.lecture.length} {item.lecture.length > 1 ? "lectures" : "lecture"}
                                    </Text>
                                </TouchableOpacity>
                                <View style={[styles.wrapShow, {height: checkIsShow? "auto" : 0}]}>
                                    <ButtonIcon title={"Add new lecture"} icon={<FontAwesome6 name="plus" size={16} color={COLORS.main} />}/>
                                    {item.lecture.map(item => 
                                        <CardLecture data={item}/>
                                    )}
                                </View>
                            </View>
                            
                        )}
                    )}
                    <ButtonIcon title={"Add new section"} icon={<FontAwesome6 name="plus" size={16} color={COLORS.main} />}/>
                </View>
            </View>

            {/* Course assignments */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Test</Text>
                <View style={[styles.wrapShow, {height: showAllTest? "auto" : 390}]}>
                    {data.test.map(item => 
                        <CardAssignmentStudent data={item} key={item.id}/>
                    )}
                </View>
                <TouchableOpacity style={styles.showAll} onPress={()=> setShowAllTest(!showAllTest)}>
                    <Text style={commonStyles.viewAll}>{showAllTest ? "Show Less" : "Show All"}</Text>
                </TouchableOpacity>
            </View>

            {/* Board */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Board</Text>
                <View style={styles.board}>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(0)}>
                        <Text style={selectBtn === 0 ? styles.selectBtn : styles.normalBtn}>Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                        <Text style={selectBtn === 1 ? styles.selectBtn : styles.normalBtn}>Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>setSelectBtn(2)}>
                        <Text style={selectBtn === 2 ? styles.selectBtn : styles.normalBtn}>Notification</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {selectBtn === 0 ? 
                    <Text>Attendance</Text>:
                    selectBtn === 1 ? 
                    <Text>Progress</Text> :
                    <Text>Notification</Text>
                    }
                </View>
            </View>
            
            {/* Teacher */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Teacher</Text>
                <CardHorizontalTeacher isBtn={true}/>
            </View>
            
            {/* Course review */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Latest reviews</Text>
                <ButtonIcon title={"Write a review"} icon={<FontAwesome6 name="pen-to-square" size={16} color={COLORS.main} />}/>
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

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        // padding: 16,
        backgroundColor: "white"
    },
    wrapper: {
        width: "100%",
        padding: 16,
        rowGap: 4,
        // borderBottomWidth: 1,
        borderColor: COLORS.lightText
    },
    infoImage: {
        resizeMode: "contain",
        borderWidth: 1,
        borderColor: COLORS.lightText,
        width: "100%",
        height: 140
    },
    inforContent:{
        flexDirection: "row",
        columnGap: 4,
        alignItems: "center"
    },
    infoTitle:{
        fontSize: 16,
        fontWeight: "bold"
    },
    infoText: {
        fontSize: 14,
        color: COLORS.stroke
    },
    costSale:{
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.secondMain
    },
    cost: {
        fontSize: 10,
        textDecorationLine: 'line-through',
        color: COLORS.stroke
    },
    infoBtn:{
        alignItems: "center",
        backgroundColor: COLORS.main,
        paddingVertical: 4,
        borderRadius: 4 
    },
    infoBtnText: {
        color: "white",
        fontWeight: "bold"
    },
    section:{
        fontSize: 16,
        fontWeight: "bold"
    },
    wrapSection:{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,
    },
    wrapShow: {
        overflow: "hidden",
        height: "auto",
        marginTop: 4
    },
    showAll:{
        alignItems: "center"
    },
    board: {
        flexDirection: "row",
        columnGap: 4,
        justifyContent: "center"
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
        fontSize: 16,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.main
    },
    wrapSectionLecture:{
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        marginBottom: 8
    }
})