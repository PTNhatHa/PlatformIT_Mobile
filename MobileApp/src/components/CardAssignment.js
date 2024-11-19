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
    "dueDate": null,
    "isSubmitted": null,
    "assignmentType": 1,
    "assignmentTypeDesc": "MANUAL",
    "duration": null,
    "maxScore": 0
  }
export const CardAssignment = ({data = initAssignment, role = 0, isNoBoder = false})=>{
    const [circleColor, setCircleColor] = useState(!data.isPublish? COLORS.lightText: COLORS.yellow)
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
                    {data.maxScore &&
                        <View style={styles.content}>
                            <FontAwesome6 name="square-check" size={12} color={COLORS.stroke} />
                            <Text style={styles.dataText}>{data.maxScore} score</Text>
                        </View>
                    }
                </View>
                {data.dueDate &&
                    <View style={[styles.content]}>
                        {/* {role === 1 &&
                            <>
                                <Image source={""} style={[styles.circle, {backgroundColor: circleColor}]}/>
                                <TagNoColor label={"Publish"}/>
                            </>
                        } */}
                        <TagNoColor label={"Due: " + formatDateTime(data.dueDate)}/>
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