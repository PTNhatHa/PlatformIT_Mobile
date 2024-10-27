import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../../../utils/constants"
import { CardHorizontalCenter, CardHorizontalCourse, CardHorizontalTeacher } from "../../../components/CardHorizontal"
import { useEffect, useState } from "react"
import { getAllCenterCards } from "../../../services/center"
import { getAllTeacherCards } from "../../../services/user"
import { getAllCourseCards } from "../../../services/course"

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

export const StudentHome = ({navigation})=>{
    const [loading, setLoading] = useState(true);
    const [dataCourse, setDataCourse] = useState([])
    const [dataCenter, setDataCenter] = useState([])
    const [dataTeacher, setDataTeacher] = useState([])

    const getAllCard = async ()=>{
        try {
            const responseCourse = await getAllCourseCards()
            const responseCenter = await getAllCenterCards()
            const responseTeacher = await getAllTeacherCards()
            setDataCourse(responseCourse)
            setDataCenter(responseCenter)
            setDataTeacher(responseTeacher)
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getAllCard()
    }, [])

    
    if (loading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }

    return(
        <>
        <ScrollView style={styles.container}>
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Courses</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}} onPress={()=>navigation.navigate("View All", {initTab: 0})}>
                        <Text style={commonStyles.viewAll}>View all courses</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={dataCourse}
                    horizontal={true}
                    keyExtractor={(item) => item.idCourse.toString()}
                    renderItem={({ item }) => <CardHorizontalCourse data={item}/>}
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
                    data={dataCenter}
                    horizontal={true}
                    keyExtractor={(item) => item.idCenter.toString()}
                    renderItem={({ item }) => <CardHorizontalCenter data={item}/>}
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
                    data={dataTeacher}
                    horizontal={true}
                    keyExtractor={(item) => item.idUser.toString()}
                    renderItem={({ item }) => <CardHorizontalTeacher data={item}/>}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                />
            </View>
        </ScrollView>
        {loading &&
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color="white" />
            </View>
        }
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 16,
        backgroundColor: "#FAFAFA",
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
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    }
})