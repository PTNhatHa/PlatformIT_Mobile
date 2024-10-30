import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import { Tag, TagNoColor } from "./Tag"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDateTime } from "../utils/utils";
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native";
import { ButtonIcon } from "./Button";
import DefaultImg from "../../assets/images/DefaultImg.png"
import DefaultAva from "../../assets/images/DefaultAva.png"

const initCourse=  {
    "idCourse": 3,
    "courseTitle": "Banh Bo",
    "pathImg": null,
    "courseStartDate": "2024-10-05T08:22:25.752581",
    "courseEndDate": "2025-10-15T08:22:25.752581",
    "registStartDate": "2024-10-05T13:29:21.8533333",
    "registEndDate": "2025-10-05T18:22:25.752581",
    "price": 10,
    "tags": [
      "C#",
      "Java"
    ]
}
export const CardHorizontalCourse = ({data = initCourse})=>{
    const navigation = useNavigation()
    const [showTags, setShowTags] = useState([])
    useEffect(()=>{
        const cardWidth = 160-12*2
        let totalWidth = 0
        let selectTags = []
        for(let i =0; i < data.tags.length; i++){
            const tag = data.tags[i]
            const tagWidth = tag.length * 8 + 16
            if(totalWidth + tagWidth > cardWidth) break
            selectTags.push(tag)
            totalWidth += tagWidth
        }
        setShowTags(selectTags)
    }, [data.tags])
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Course")} key={data.idCourse}>
            <Image source={data.pathImg} style={styles.img}/>
            <View style={{ flex: 1}}>
                <Text style={styles.title}>{data.courseTitle}</Text>
                {data.tags.length > 0 && 
                    <View style={styles.tags}>
                        {showTags.map(item=>
                            <Tag label={item} key={item}/>
                        )}
                        {data.tags.length > showTags.length && 
                            <Text style={styles.tagsText}>+{data.tags.length - showTags.length}</Text>
                        }
                    </View>
                }
                <View style={styles.tags}>
                    <Feather name="clock" size={10} color={COLORS.stroke} />
                    <Text style={styles.dataText}>
                        {formatDateTime(data.courseStartDate)} - {formatDateTime(data.courseEndDate)}
                    </Text>
                </View>
                    <View style={styles.tags}>
                        {data.registStartDate &&
                            <FontAwesome6 name="pen-to-square" size={10} color={COLORS.stroke} />
                        }
                        {data.registStartDate &&
                            <Text style={styles.dataText}>
                                {data.isRegist ? "Registing" : 
                                    `${formatDateTime(data.registStartDate)} - ${formatDateTime(data.registEndDate)}`}
                            </Text>
                        }
                    </View>
                <View style={styles.wrapCost}>
                    <Text style={styles.costSale}>${data.price}</Text>
                    <Text style={styles.cost}>{data.price}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const initCenter={
    idCenter: 1,
    centerName: "HAHYWU CENTER",
    description: null,
    avatarPath: "",
    studentsCount: 2,
    coursesCount: 1,
    listTagCourses: [
      {
        "idTag": 1,
        "tagName": "C#",
        "courseCount": 7
      },
    ]
}
export const CardHorizontalCenter = ({data = initCenter})=>{
    const navigation = useNavigation()
    const [showTags, setShowTags] = useState([])
    useEffect(()=>{
        const cardWidth = 160-12*2
        let totalWidth = 0
        let selectTags = []
        for(let i =0; i < data.listTagCourses.length; i++){
            const tag = data.listTagCourses[i]
            const tagWidth = tag.tagName.length * 8 + 16
            if(totalWidth + tagWidth > cardWidth) break
            selectTags.push(tag)
            totalWidth += tagWidth
        }
        setShowTags(selectTags)
    }, [data.listTagCourses])
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Center", {idCenter : data.idCenter})} key={data.idCenter}>
            <Image source={data.img || DefaultImg} style={styles.img}/>
            <View>
                <Text style={styles.title}>{data.centerName}</Text>
                <Text style={styles.dataText}>Description: {data.description}</Text>
                {data.listTagCourses?.length > 0 && 
                    <View style={styles.tags}>
                        {showTags.map(item=>
                            <Tag label={item.tagName} key={item.idTag}/>
                        )}
                        {data.listTagCourses.length > showTags.length && 
                            <Text style={styles.tagsText}>+{data.listTagCourses.length - showTags.length}</Text>
                        }
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}

const initTeacher={
    // img: "",
    // name: "Name",
    // description: "Description"
    "idUser": 6,
    "name": "Phan Trần Nhật Hạ",
    "teachingMajor": "Software Developer; FE; UI, UX Designer",
    "avatarPath": "",
    "coursesCount": 0
}
export const CardHorizontalTeacher = ({data = initTeacher, isBtn = false})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity style={styles.containerTecher} onPress={()=> navigation.navigate("Detail Teacher")} key={data.idUser}>
            <Image source={data.avatarPath || DefaultAva} style={styles.avata}/>
            <View style={{alignItems: "center"}}>
                <Text style={[styles.title, {textAlign: "center"}]}>{data.name}</Text>
                <Text style={[styles.dataText, {textAlign: "center", color: COLORS.main}]}>{data.teachingMajor}</Text>
                {data.coursesCount.length > 0 ?
                        <Text style={styles.dataText}>{data.coursesCount} {data.coursesCount.length === 1 ? "Course": "Courses"}</Text>
                    : ""
                }
            </View>
            {isBtn &&
            <View>
                <ButtonIcon title={"Chat"} icon={<Ionicons name="chatbubble-outline" size={16} color={COLORS.main} />}/>
            </View>
            }
        </TouchableOpacity>
    )
}

const initAssignment = {
    id: 1,
    title: "Title",
    img: "",
    nameCourse: "OOP",
    due: new Date(),
    duration: 45,
    type: "Test",
    isPublish: true,
    submitted: 0.8
}
export const CardHorizontalAssignmentTeacher = ({data = initAssignment})=>{
    const [circleColor, setCircleColor] = useState(!data.isPublish? COLORS.lightText: COLORS.yellow)
    useEffect(()=>{
        if(data.submitted > 0.8){
            setCircleColor(COLORS.green)
        } else{
            setCircleColor(!data.isPublish? COLORS.lightText: COLORS.yellow)
        }
    }, [data.isPublish, data.submitted])
    return(
        <TouchableOpacity style={styles.container}>
            <Image source={data.img} style={styles.img}/>
            <View style={{flex: 1}}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.dataText}>Course: {data.nameCourse}</Text>
                {data.due ? 
                    <View style={styles.tags}>
                        <Feather name="calendar" size={12} color={COLORS.stroke} />
                        <Text style={styles.dataText}>Due date: {formatDateTime(data.due)}</Text>
                    </View>
                    :
                    ""
                }
                <View style={styles.tags}>
                    {data.duration &&
                        <Feather name="clock" size={12} color={COLORS.stroke} />
                    }
                    {data.duration &&
                        <Text style={styles.dataText}>Duration: {data.duration} min</Text>
                    }
                    </View>
                <View style={[styles.tags, {alignSelf: "flex-end"}]}>
                    <Image source={""} style={[styles.circle, {backgroundColor: circleColor}]}/>
                    <TagNoColor label={data.type}/>
                    <TagNoColor label={data.isPublish ? "Publish": "Unpublish"}/>
                </View>
            </View>
        </TouchableOpacity>
    )
}


const initProfessional={
    img: "",
    title: "Title",
    description: "description"
}
export const CardHorizontalProfessional = ({data = initProfessional})=>{
    return(
        <TouchableOpacity style={styles.container}>
            <Image source={data.img} style={styles.img}/>
            <View>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.dataText}>{data.description}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        rowGap: 6,
        width: 160,
        marginRight: 10,
        backgroundColor: "white"
    },
    img: {
        width: "100%",
        height: 80,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 4,
        backgroundColor: COLORS.lightText
    },
    title:{
        fontSize: 16,
        fontWeight: "bold"
    },
    tags:{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2,
        minHeight: 13,
        overflow: "hidden"
    },
    tagsText: {
        fontSize: 10,
        color: COLORS.main
    },
    dataText: {
        fontSize: 10,
        color: COLORS.stroke
    },
    wrapCost:{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2,
        justifyContent: "flex-end",
        flex: 1,
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
    containerTecher:{
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        rowGap: 6,
        width: 150,
        alignItems: "center",
        marginRight: 10,
        backgroundColor: "white"
    },
    avata: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 80,
        height: 80
    },
    circle: {
        height: 16,
        width: 16,
        borderRadius: 90,
    }
})