import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../constants"
import { Tag } from "./Tag"
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { formatDateTime } from "../utils/utils";

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
    costSale: 100
}
export const CardHorizontalCourse = ({data = initCourse})=>{
    return(
        <TouchableOpacity style={styles.container}>
            <Image source={data.img} style={styles.img}/>
            <View>
                <Text style={styles.title}>{data.title}</Text>
                <View style={styles.tags}>
                    <Tag label={data.listTags.find(i => i.id === 1).value}/>
                    <Text style={styles.tagsText}>+{data.listTags.length - 1}</Text>
                </View>
                <View style={styles.tags}>
                    <Feather name="clock" size={10} color={COLORS.stroke} />
                    <Text style={styles.dataText}>
                        {formatDateTime(data.startCourse)} - {formatDateTime(data.endCourse)}
                    </Text>
                </View>
                <View style={styles.tags}>
                    <FontAwesome6 name="pen-to-square" size={10} color={COLORS.stroke} />
                    <Text style={styles.dataText}>
                        {data.isRegist ? "Registing" : 
                            `${formatDateTime(data.startCourse)} - ${formatDateTime(data.endCourse)}`}
                    </Text>
                </View>
                <View style={[styles.tags, {justifyContent: "flex-end"}]}>
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
    return(
        <TouchableOpacity style={styles.container}>
            <Image source={data.img} style={styles.img}/>
            <View>
                <Text style={styles.title}>{data.title}</Text>
                <View style={styles.tags}>
                    <Tag label={data.listTags.find(i => i.id === 1).value}/>
                    <Text style={styles.tagsText}>+{data.listTags.length - 1}</Text>
                </View>
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
    return(
        <TouchableOpacity style={styles.containerTecher}>
            <Image source={data.img} style={styles.avata}/>
            <View style={{alignItems: "center"}}>
                <Text style={styles.title}>{data.name}</Text>
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
        width: 170,
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
    },
    tagsText: {
        fontSize: 10,
        color: COLORS.main
    },
    dataText: {
        fontSize: 10,
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
    containerTecher:{
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        rowGap: 6,
        width: 150,
        alignItems: "center"
    },
    avata: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 80,
        height: 80
    }
})