import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { Tag } from "../components/Tag"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardHorizontalCourse, CardHorizontalProfessional, CardHorizontalTeacher } from "../components/CardHorizontal";

const initCenter={
    id: 1,
    img: DefaultImg,
    nameCenter: "Name Center",
    listTags: [
        { id: 1, value: "Web developer"},
        { id: 2, value: "Backend"},
        { id: 3, value: "Frontend"},
    ],
    intro: "intro",
    students: 500,
    courses: [
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
    ],
    teachers: [
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
    ],
    professional: [
        {
            id: 1,
            img: "",
            title: "Title",
            description: "description"
        },
        {
            id: 2,
            img: "",
            title: "Title2",
            description: "description2"
        },
    ]
}
export const DetailCenter =({data=initCenter})=>{
    return(
        <ScrollView contentContainerStyle={styles.container}>
            {/* Center info */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Center Information</Text>
                <Image source={data.img} style={styles.infoImage}/>
                <View style={{ rowGap: 2}}>
                    <Text style={styles.infoTitle}>{data.nameCenter}</Text>
                    {data.listTags.length > 0 && 
                        <View style={styles.inforContent}>
                            {data.listTags.map(item => 
                                <Tag key={item.id} label={item.value}/>  
                            )}                    
                        </View>
                    }
                </View>
                <Text style={styles.infoText}>{data.intro}</Text>
                <View style={styles.inforContent}>
                    <AntDesign name="book" size={16} color={COLORS.stroke} />
                    <Text style={styles.infoText}>{data.courses.length} courses</Text>
                </View>
                {data.students? 
                    <View style={styles.inforContent}>
                        <MaterialCommunityIcons name="account-group-outline" size={16} color={COLORS.stroke} />
                        <Text style={styles.infoText}>{data.students} students</Text>
                    </View>
                    : ""
                }
            </View>

            {/* Professional Qualifications */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Professional Qualifications</Text>
                <FlatList
                    data={data.professional}
                    renderItem={({item}) => <CardHorizontalProfessional data={item}/>}
                    horizontal={true}
                    keyExtractor={item => item.id}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Top Courses */}
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Courses</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}}>
                        <Text style={commonStyles.viewAll}>View all courses</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={data.courses}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalCourse data={item} />}
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Top Teachers */}
            <View style={styles.wrapper}>
                <View style={styles.top}>
                    <Text style={commonStyles.title}>Top Courses</Text>
                    <TouchableOpacity style={{alignItems: "flex-end", flex: 1}}>
                        <Text style={commonStyles.viewAll}>View all teachers</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={data.teachers}
                    horizontal={true}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <CardHorizontalTeacher data={item} />}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        // padding: 16,
    },
    wrapper: {
        width: "100%",
        padding: 16,
        rowGap: 4,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText
    },
    infoImage: {
        resizeMode: "contain",
        borderWidth: 1,
        borderColor: COLORS.lightText,
        width: "100%",
        height: 140
    },
    inforContent:{
        flexDirection: "row",
        columnGap: 4,
        alignItems: "center"
    },
    infoTitle:{
        fontSize: 16,
        fontWeight: "bold"
    },
    infoText: {
        fontSize: 14,
        color: COLORS.stroke
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
    },
})