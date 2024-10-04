import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime } from "../utils/utils";
import { TagNoColor } from "./Tag";
import { useState, useEffect } from "react"

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
export const CardVirticalAssignment = ({data = initAssignment})=>{
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
                <View style={styles.content}>
                    <Feather name="calendar" size={12} color={COLORS.stroke} />
                    <Text style={styles.dataText}>Due date: {formatDateTime(data.due)}</Text>
                </View>
                <View style={styles.content}>
                    <Feather name="clock" size={12} color={COLORS.stroke} />
                    <Text style={styles.dataText}>Duration: {data.duration} min</Text>
                </View>
                <View style={[styles.content, {alignSelf: "flex-end"}]}>
                    <Image source={""} style={[styles.circle, {backgroundColor: circleColor}]}/>
                    <TagNoColor label={data.type}/>
                    <TagNoColor label={data.isPublish ? "Publish": "Unpublish"}/>
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
        marginBottom: 10,
        flexDirection: "column",
        columnGap: 10
    },
    img: {
        width: 90,
        height: 90,
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
    },
    dataText: {
        fontSize: 12,
        color: COLORS.stroke
    },
    circle: {
        height: 16,
        width: 16,
        borderRadius: 90,
    }
})