import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, typeAssignment } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { formatDateTime } from "../utils/utils";
import { useState } from "react";
import { TagNoColor } from "./Tag";
import Foundation from '@expo/vector-icons/Foundation';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const initAssignment =     {
    "idAssignment": 12,
    "assignmentTitle": "Asgm react",
    "assignmentIntroduction": null,
    "dueDate": new Date(),
    "isSubmitted": 1,
    "assignmentType": 1,
    "assignmentTypeDesc": "MANUAL",
    "duration": 20,
    "maxScore": 10,
    "numberQuestion": 5,
    "isPublish": 1,
    "isExercise": 1
  }
export const CardAssignment = ({data = initAssignment, role = 2, isNoBoder = false})=>{
    return(
        <TouchableOpacity style={isNoBoder ? styles.containerNoBoder : styles.container} key={data.idAssignment}>
            <View style={styles.wrapContent}>
                <Text style={styles.title}>{data.assignmentTitle}</Text>
                <View style={styles.wrapDetail}>
                    <View style={styles.content}>
                        <Foundation name="page-edit" size={12} color={COLORS.stroke} />
                        <Text style={styles.dataText}>{typeAssignment[data.assignmentType]}</Text>
                    </View>
                    {data.duration &&
                        <View style={styles.content}>
                            <Feather name="clock" size={11} color={COLORS.stroke} />
                            <Text style={styles.dataText}>{data.duration} min</Text>
                        </View>
                    }
                    {data.numberQuestion &&
                        <View style={styles.content}>
                            <FontAwesome6 name="circle-question" size={12} color={COLORS.stroke} />
                            <Text style={styles.dataText}>{data.numberQuestion} {data.numberQuestion > 1 ? "questions" : "question"}</Text>
                        </View>
                    }
                    {role === 1 && data.dueDate &&
                        <View style={styles.content}>
                            <FontAwesome6 name="calendar" size={12} color={COLORS.stroke} />
                            <Text style={styles.dataText}>Due: {formatDateTime(data.dueDate)}</Text>
                        </View>
                    }
                </View>
                {role === 2 && data.dueDate &&
                    <View style={[styles.content, {justifyContent: "flex-end"}]}>
                        <TagNoColor label={"Due: " + formatDateTime(data.dueDate)}/>
                    </View>
                }
                {role === 1 && 
                    <View style={[styles.content, {justifyContent: "flex-end"}]}>
                        {data.isPublish &&
                            <TagNoColor label={data.isPublish ? "Publish" : "Unpublish"}/>
                        }
                        {data.isExercise &&
                            <TagNoColor label={data.isExercise ? "Exercise" : "Test"}/>
                        }
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
        backgroundColor: "white",
    },
    containerNoBoder: {
        borderLeftWidth: 1,
        borderColor: COLORS.lightText,
        marginBottom: 10,
        backgroundColor: "white",
        paddingLeft: 8
    },
    wrapContent:{
        gap: 2
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
    wrapDetail:{
        flexDirection: "row",
        gap: 16
    }
})