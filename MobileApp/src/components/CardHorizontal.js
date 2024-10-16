import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import { Tag, TagNoColor } from "./Tag"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { formatDateTime } from "../utils/utils";
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native";

const initCourse={
    id: 1,
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
    costSale: 100
}
export const CardHorizontalCourse = ({data = initCourse})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Course")}>
            <Image source={data.img} style={styles.img}/>
            <View style={{ flex: 1}}>
                <Text style={styles.title}>{data.title}</Text>
                {data.listTags.length > 0 && 
                    <View style={styles.tags}>
                        <Tag label={data.listTags[0].value}/>
                        {data.listTags.length > 1 && 
                            <Text style={styles.tagsText}>+{data.listTags.length - 1}</Text>
                        }
                        
                    </View>
                }
                <View style={styles.tags}>
                    <Feather name="clock" size={10} color={COLORS.stroke} />
                    <Text style={styles.dataText}>
                        {formatDateTime(data.startCourse)} - {formatDateTime(data.endCourse)}
                    </Text>
                </View>
                    <View style={styles.tags}>
                        {data.startRegist &&
                            <FontAwesome6 name="pen-to-square" size={10} color={COLORS.stroke} />
                        }
                        {data.startRegist &&
                            <Text style={styles.dataText}>
                                {data.isRegist ? "Registing" : 
                                    `${formatDateTime(data.startCourse)} - ${formatDateTime(data.endCourse)}`}
                            </Text>
                        }
                    </View>
                <View style={styles.wrapCost}>
                    <Text style={styles.costSale}>${data.costSale}</Text>
                    <Text style={styles.cost}>{data.cost}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const initCenter={
    img: "",
    title: "Title",
    listTags: [
        { id: 1, value: "Web developer"},
        { id: 2, value: "Backend"},
        { id: 3, value: "Frontend"},
    ],
}
export const CardHorizontalCenter = ({data = initCenter})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity style={styles.container} onPress={()=> navigation.navigate("Detail Center")}>
            <Image source={data.img} style={styles.img}/>
            <View>
                <Text style={styles.title}>{data.title}</Text>
                {data.listTags.length > 0 && 
                    <View style={styles.tags}>
                        <Tag label={data.listTags[0].value}/>
                        {data.listTags.length > 1 && 
                            <Text style={styles.tagsText}>+{data.listTags.length - 1}</Text>
                        }
                        
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}

const initTeacher={
    img: "",
    name: "Name",
    description: "Description"
}
export const CardHorizontalTeacher = ({data = initTeacher})=>{
    const navigation = useNavigation()
    return(
        <TouchableOpacity style={styles.containerTecher} onPress={()=> navigation.navigate("Detail Teacher")}>
            <Image source={data.img} style={styles.avata}/>
            <View style={{alignItems: "center"}}>
                <Text style={styles.title}>{data.name}</Text>
                <Text style={styles.dataText}>{data.description}</Text>
            </View>
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
        marginRight: 10
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
        minHeight: 13
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
        marginRight: 10
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