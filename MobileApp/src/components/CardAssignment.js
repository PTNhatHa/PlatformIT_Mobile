import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime } from "../utils/utils";
import { Tag, TagNoColor } from "./Tag";
import { useState, useEffect } from "react"
import DefaultImg from "../../assets/images/DefaultImg.png"
const initAssignment = {
    id: 1,
    title: "Title",
    introduction: "introduction",
    img: "",
    nameCourse: "OOP",
    due: new Date(),
    duration: 45,
    type: "Test",
    isPublish: true,
    submitted: 0.8
}
export const CardAssignmentStudent = ({data = initAssignment})=>{
    return(
        <TouchableOpacity style={styles.container}>
            <Image source={data.img} style={styles.img}/>
            <View style={{flex: 1}}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.dataText}>{data.introduction}</Text>
                {data.due ? 
                    <View style={styles.content}>
                        <Feather name="calendar" size={12} color={COLORS.stroke} />
                        <Text style={styles.dataText}>Due date: {formatDateTime(data.due)}</Text>
                    </View>
                    :
                    ""
                }
                {data.duration ? 
                    <View style={styles.content}>
                        <Feather name="clock" size={12} color={COLORS.stroke} />
                        <Text style={styles.dataText}>Duration: {data.duration} min</Text>
                    </View>
                    :
                    ""
                }
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
        flexDirection: "row",
        columnGap: 10,
        backgroundColor: "white"
    },
    img: {
        width: 95,
        height: 95,
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
        minHeight: 13
    },
    dataText: {
        fontSize: 12,
        color: COLORS.stroke
    },
    circle: {
        height: 16,
        width: 16,
        borderRadius: 90,
    },
})