import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { Tag } from "../components/Tag"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardHorizontalCenter, CardHorizontalCourse, CardHorizontalProfessional, CardHorizontalTeacher } from "../components/CardHorizontal";

const initTeacher={
    id: 1,
    img: DefaultImg,
    nameTeacher: "Name Teacher",
    listTags: [
        { id: 1, value: "Chuyên ngành 1"},
        { id: 2, value: "Chuyên ngành 2"},
    ],
    description: "description",
    students: 500,
    center: {
        id:1,
        img: "",
        title: "Title",
        listTags: [
            { id: 1, value: "Web developer"},
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
    },
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
    ],
    socials: [
        { id: 1, title: "Github", link: "aaaaaaa"},
        { id: 2, title: "Facebook", link: "bbbbbb"},
    ]
}
export const DetailTeacher =({data=initTeacher})=>{
    return(
        <ScrollView contentContainerStyle={styles.container}>
            {/* Teacher info */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Teacher Information</Text>
                <Image source={data.img} style={styles.infoImage}/>
                <View style={{ rowGap: 2}}>
                    <Text style={styles.infoTitle}>{data.nameTeacher}</Text>
                    {data.listTags.length > 0 && 
                        <View style={styles.inforContent}>
                            {data.listTags.map(item => 
                                <Tag key={item.id} label={item.value}/>  
                            )}                    
                        </View>
                    }
                </View>
                <Text style={styles.infoText}>{data.description}</Text>
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

            {/* Center */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Center</Text>
                <CardHorizontalCenter data={data.center}/>
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
            
            {/* Social link */}
            {data.socials ? 
                <View style={styles.wrapper}>
                    <Text style={commonStyles.title}>Social/Profile link</Text>
                    {data.socials.map(item => 
                        <TouchableOpacity style={styles.wrapSocail}>
                            <Text style={styles.infoText}>{item.title}</Text>
                            <MaterialIcons name="open-in-new" size={16} color={COLORS.stroke} />
                        </TouchableOpacity>
                    )}
                </View>
                : ""
            }
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
        // borderBottomWidth: 1,
        borderColor: COLORS.lightText
    },
    infoImage: {
        resizeMode: "cover",
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 140,
        height: 140,
        alignSelf: "center"
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
    wrapSocail:{
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 4,
        paddingVertical: 8,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        columnGap: 4,
        paddingHorizontal: 16
    }
})