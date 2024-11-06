import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime } from "../utils/utils";
import { useState } from "react";
import { TagNoColor } from "./Tag";

const initAssignment =     {
    "idAssignment": 0,
    "assignmentTitle": "Sample",
    "assignmentIntroduction": "Sample",
    "dueDate": "2024-11-06T18:05:42.5588662+07:00",
    "isSubmitted": null
  }
export const CardAssignment = ({data = initAssignment, role = 0})=>{
    const [circleColor, setCircleColor] = useState(!data.isPublish? COLORS.lightText: COLORS.yellow)
    return(
        <TouchableOpacity style={styles.container} key={data.idAssignment}>
            <View style={{flex: 1}}>
                <Text style={styles.title}>{data.assignmentTitle}</Text>
                <Text style={styles.dataText}>{data.assignmentIntroduction}</Text>
                {data.dueDate ? 
                    <View style={styles.content}>
                        <Feather name="calendar" size={12} color={COLORS.stroke} />
                        <Text style={styles.dataText}>Due date: {formatDateTime(data.dueDate)}</Text>
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
                {role === 1 &&
                    <View style={[styles.content, {alignSelf: "flex-end"}]}>
                        <Image source={""} style={[styles.circle, {backgroundColor: circleColor}]}/>
                        {/* <TagNoColor label={"Test"}/> */}
                        <TagNoColor label={"Publish"}/>
                    </View>
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