import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDateTime } from "../utils/utils";
import { Tag, TagNoColor } from "./Tag";
import { useState, useEffect } from "react"
import DefaultAva from "../../assets/images/DefaultAva.png"
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import DefaultImg from "../../assets/images/DefaultImg.png"
import Entypo from '@expo/vector-icons/Entypo';
import { useUser } from "../contexts/UserContext";

const initCourse={
    "idCourse": 3,
    "courseTitle": "Net core",
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
export const CardVirticalCourse = ({data = initCourse, role = 0, isUnPin = false})=>{
    const {state} = useUser()
    const navigation = useNavigation()
    const [showTags, setShowTags] = useState([])
    useEffect(()=>{
        const cardWidth = Dimensions.get("window").width - 16*2 - 12*2 - 105
        let totalWidth = 0
        let selectTags = []
        for(let i =0; i < data?.tags?.length; i++){
            const tag = data.tags[i]
            const tagWidth = tag.length * 8 + 16
            if(totalWidth + tagWidth > cardWidth) break
            selectTags.push(tag)
            totalWidth += tagWidth
        }
        setShowTags(selectTags)
    }, [data.tags])
    return(
        <TouchableOpacity 
            style={styles.container} 
            onPress={role !== 0 ? ()=> navigation.navigate("Detail My Course", {idCourse: data.idCourse, role: role}) : ()=> navigation.navigate("Detail Course", {idCourse: data.idCourse})}
            key={data.idCourse}    
        >
            <View>
                {((state.idRole === 4 && state.idUser === data.idTeacher && !isUnPin) || (data.isEnrolled))  && 
                    <Entypo style={styles.pin} name="pin" size={16} color={COLORS.red} />
                }
                <Image source={data.pathImg ? {uri: data.pathImg} : DefaultImg} style={styles.img}/>
                {data.isLimitedTime === 1 &&
                    <>
                        {new Date() < new Date(data.registStartDate) ? 
                            <Text style={[styles.tagDate, styles.bgYellow]}>Opening soon</Text>
                            : new Date() <= new Date(data.registEndDate) ?
                                <Text style={[styles.tagDate, styles.bgBlue]}>Registering</Text>
                                : new Date() < new Date(data.courseStartDate) ? 
                                    <Text style={[styles.tagDate, styles.bgYellow]}>Starting soon</Text>
                                    : 
                                        <Text style={[styles.tagDate, styles.bgGreen]}>Ongoing</Text>
                        }
                    </>
                }
            </View>

            <View style={{ flex: 1}}>
                <Text style={styles.title}>{data.courseTitle}</Text>
                {data?.tags?.length > 0 && 
                    <View style={styles.content}>
                        {showTags.map(item=>
                            <Tag label={item} key={item}/>
                        )}
                        {data.tags.length > showTags.length && 
                            <Text style={styles.tagsText}>+{data.tags.length - showTags.length}</Text>
                        }
                    </View>
                }
                <View style={styles.content}>
                    <AntDesign name="star" size={10} color={COLORS.yellow}/>
                    <Text style={styles.dataText}>{data.rate}</Text>
                </View>
                <View style={styles.content}>
                    <Feather name="clock" size={10} color={COLORS.stroke} />
                    <Text style={styles.dataText}>
                        {data.courseStartDate ? 
                            `${formatDateTime(data.courseStartDate)} - ${formatDateTime(data.courseEndDate)}`
                        :
                            "Created on: " + formatDateTime(data.createdDate)
                        }
                    </Text>
                </View>
                {data.registStartDate &&
                    <View style={styles.content}>
                        <FontAwesome6 name="pen-to-square" size={10} color={COLORS.stroke} />
                        <Text style={styles.dataText}>
                            {data.isRegist ? "Registing" : 
                                `${formatDateTime(data.registStartDate)} - ${formatDateTime(data.registEndDate)}`}
                        </Text>
                    </View>
                }
                <View style={styles.content}>
                    <Ionicons name="business-outline" size={10} color={COLORS.secondMain} />
                    <Text style={styles.dataText}>{data.centerName}</Text>
                </View>
                <View style={styles.wrapCost}>
                    {data.price !== null ?
                        <>
                            <Text style={styles.costSale}>
                                {data.discountedPrice ? data.discountedPrice.toLocaleString('vi-VN') : data.price.toLocaleString('vi-VN')}
                                <Text style={{textDecorationLine: "underline"}}>đ</Text>    
                            </Text>
                            {data.discountedPrice && 
                                <Text style={styles.cost}>
                                    {data.price.toLocaleString('vi-VN')}
                                    <Text style={{textDecorationLine: "underline"}}>đ</Text>  
                                </Text>
                            }
                        </>
                        :
                            <Text style={styles.costSale}>Free</Text>
                    }
                </View>
            </View>
        </TouchableOpacity>
    )
}

const initCenter={
    // img: "",
    // title: "Title",
    // listTags: [
    //     { id: 1, value: "Web developer"},
    //     { id: 2, value: "Backend"},
    //     { id: 3, value: "Frontend"},
    // ],
    "idCenter": 1,
    "centerName": "HAHYWU CENTER",
    "description": null,
    "avatarPath": "",
    "studentsCount": 2,
    "coursesCount": 1,
    listTagCourses: [
        {
          "idTag": 1,
          "tagName": "C#",
          "courseCount": 7
        },
      ]
}
export const CardVirticalCenter = ({data = initCenter})=>{
    const navigation = useNavigation()
    const [showTags, setShowTags] = useState([])
    useEffect(()=>{
        const cardWidth = Dimensions.get("window").width - 16*2 - 12*2 - 105 - 10
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
            <Image source={data.avatarPath ? {uri: data.avatarPath} : DefaultImg} style={styles.img}/>
            <View>
                <Text style={styles.title}>{data.centerName}</Text>
                {data.description &&
                    <Text style={styles.dataText}>{data.description}</Text>
                }
                {data.listTagCourses?.length > 0 && 
                    <View style={styles.content}>
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
export const CardVirticalTeacher = ({data = initTeacher})=>{
    const navigation = useNavigation()
    const [coursesCount, setCoursesCount] = useState(data.coursesCount || data.courseCount)
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Teacher", { idTeacher: data.idUser })} key={data.idUser}>
            <Image source={data.avatarPath? {uri: data.avatarPath} : DefaultAva} style={styles.avata}/>
            <View>
                <Text style={styles.title}>{data.name || data.fullName || "<Unknown>"}</Text>
                {data.teachingMajor &&
                    <View style={styles.content}>
                        <SimpleLineIcons name="graduation" size={10} color={COLORS.stroke} />
                        <Text style={styles.dataText}>{data.teachingMajor}</Text>
                    </View>
                }
                {coursesCount > 0 ?
                    <View style={styles.content}>
                        <AntDesign name="book" size={10} color={COLORS.stroke} />
                        <Text style={styles.dataText}>{coursesCount} {coursesCount === 1 ? "Course": "Courses"}</Text>
                    </View>
                    : ""
                }
            </View>
        </TouchableOpacity>
    )
}


export const CardCourseStudent = ({data = initCourse})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("DetailCourse")}>
            <Image source={data.img} style={styles.img}/>
            <View style={{ flex: 1}}>
                <Text style={styles.title}>{data.title}</Text>
                {data.listTags?.length > 0 && 
                    <View style={styles.content}>
                        <Tag label={data.listTags[0].value}/>
                        {data.listTags.length > 1 && 
                            <Text style={styles.tagsText}>+{data.listTags.length - 1}</Text>
                        }
                        
                    </View>
                }
                <View style={styles.content}>
                    <Feather name="clock" size={10} color={COLORS.stroke} />
                    <Text style={styles.dataText}>
                        {formatDateTime(data.startCourse)} - {formatDateTime(data.endCourse)}
                    </Text>
                </View>
                <View style={styles.content}>
                    <Ionicons name="business-outline" size={10} color={COLORS.secondMain} />
                    <Text style={styles.dataText}>{data.nameCenter}</Text>
                </View>
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
        flexDirection: "row",
        columnGap: 10,
        backgroundColor: "white"
    },
    img: {
        width: 105,
        height: 105,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 4,
        backgroundColor: COLORS.lightText
    },
    title:{
        fontSize: 16,
        fontWeight: "bold"
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2, 
        minHeight: 13,
        overflow: "hidden"
    },
    dataText: {
        fontSize: 12,
        color: COLORS.stroke,
        textAlign: "justify"
    },
    circle: {
        height: 16,
        width: 16,
        borderRadius: 90,
    },
    wrapCost:{
        flexDirection: "row",
        alignItems: "flex-end",
        columnGap: 2,
        justifyContent: "flex-end",
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
    avata: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 80,
        height: 80
    },
    tagsText: {
        fontSize: 10,
        color: COLORS.main
    },
    tagDate:{
        position: "absolute",
        alignSelf: "flex-start",
        padding: 4,
        top: 8,
        fontSize: 10,
        fontWeight: "bold"
    },
    bgBlue: {
        backgroundColor: "#ACBEC6",
    },
    bgYellow: {
        backgroundColor: "#F8E9AC",
    },
    bgGreen: {
        backgroundColor: "#B2E0C8",
    },
    pin:{
        position: "absolute",
        top: -6,
        right: -6,
        zIndex: 1,
    }
})