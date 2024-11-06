import { Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useRef } from "react";
import { COLORS, commonStyles, initialCourse } from "../../../utils/constants";
import { CardCourseStudent, CardVirticalCourse } from "../../../components/CardVertical";
import { ViewAllFromDetail } from "../../ViewAllFromDetail";
const initCourse=[{
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
    ],
    "centerName": "HAHYWU CENTER",
}]
export const TeacherAllCourse = ()=>{
    const [data, setData] = useState(initCourse)
    return(
        <ViewAllFromDetail myCourse={data}/>
    )
}
