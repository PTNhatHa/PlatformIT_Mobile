import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { commonStyles } from "../../../utils/constants"
import { CardHorizontalCenter, CardHorizontalCourse, CardHorizontalTeacher } from "../../../components/CardHorizontal"

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

export const StudentHome = ({navigation})=>{
    return(
        <ScrollView style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Courses</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All")}>
                        <Text style={commonStyles.viewAll}>View all courses</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={initCourse}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalCourse data={item}/>}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Centers</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All")}>
                        <Text style={commonStyles.viewAll}>View all centers</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={initCenter}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalCenter data={item}/>}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Teachers</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All")}>
                        <Text style={commonStyles.viewAll}>View all Teachers</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={initTeacher}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalTeacher data={item}/>}
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