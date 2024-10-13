import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { commonStyles } from "../../../utils/constants"
import { CardHorizontalAssignment, CardHorizontalAssignmentTeacher, CardHorizontalCenter, CardHorizontalCourse, CardHorizontalTeacher } from "../../../components/CardHorizontal"
import { CardVirticalAssignment } from "../../../components/CardVertical"

const initCourse=[
    {
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
    },
    {
        id: 2,
        img: "",
        title: "Title",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        startRegist: new Date(),
        endRegist: new Date(),
        isRegist: false,
        cost: 120,
        costSale: 100
    },
    {
        id: 3,
        img: "",
        title: "Title",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        isRegist: true,
        cost: 120,
        costSale: 100
    },
]

const initCenter=[
    {
        id: 1,
        img: "",
        title: "Title",
        listTags: [
            { id: 1, value: "Web developer"},
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
    },
    {
        id: 2,
        img: "",
        title: "Title",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
    },
    {
        id: 3,
        img: "",
        title: "Title",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
    },
]

const initTeacher=[
    {
        id: 1,
        img: "",
        name: "Nhatha",
        description: "Description"
    },
    {
        id: 2,
        img: "",
        name: "Taho",
        description: "Description"
    },
    {
        id: 3,
        img: "",
        name: "Hyy",
        description: "Description"
    },
]
const initAssignment = [
    {
        id: 1,
        title: "Title",
        img: "",
        nameCourse: "OOP",
        due: new Date(),
        duration: 45,
        type: "Test",
        isPublish: true,
        submitted: 0.8
    },
    {
        id: 2,
        title: "Title",
        img: "",
        nameCourse: "OOP",
        due: new Date(),
        duration: 45,
        type: "Test",
        isPublish: false,
        submitted: 0
    },
    {
        id: 3,
        title: "Title",
        img: "",
        nameCourse: "OOP",
        due: new Date(),
        duration: null,
        type: "Exercise",
        isPublish: true,
        submitted: 0.9
    },
]
export const TeacherHome = ({navigation})=>{
    return(
        <ScrollView style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Ongoing Assignments</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All", {initTab: 3})}>
                        <Text style={commonStyles.viewAll}>View all assignments</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={initAssignment}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalAssignmentTeacher data={item} />}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Courses</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All", {initTab: 0})}>
                        <Text style={commonStyles.viewAll}>View all courses</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={initCourse}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalCourse data={item} />}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Centers</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All", {initTab: 1})}>
                        <Text style={commonStyles.viewAll}>View all centers</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={initCenter}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalCenter data={item} />}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Teachers</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All", {initTab: 2})}>
                        <Text style={commonStyles.viewAll}>View all Teachers</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={initTeacher}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalTeacher data={item} />}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 16,
        backgroundColor: "white",
    },
    wrapper:{
        paddingVertical: 16,
        rowGap: 4
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
    },
    list: {
        paddingRight: 10
    }
})