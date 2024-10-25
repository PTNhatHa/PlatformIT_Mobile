import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList, ImageBackground, Dimensions } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { Tag } from "../components/Tag"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardHorizontalCenter, CardHorizontalCourse, CardHorizontalProfessional, CardHorizontalTeacher } from "../components/CardHorizontal";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ButtonIconLightGreen } from "../components/Button";
import { CardVirticalCourse } from "../components/CardVertical";

const initTeacher={
    id: 1,
    img: DefaultImg,
    nameTeacher: "Name Teacher",
    major: "Chuyên ngành 1",
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
    const [showInfo, setShowInfo] = useState(true)
    return(
        <ScrollView contentContainerStyle={styles.container}>
            {/* Teacher info */}
            <View style={styles.wrapInfo}>
                <ImageBackground
                    source={{ uri: "https://i.pinimg.com/enabled_lo/564x/63/af/bc/63afbc98994e96ae6cd3fd9b75ea2a33.jpg"}}
                    style={styles.infoImg}
                />
                <View style={styles.wrapInfoContent}>
                {showInfo && <Image source={data.img} style={styles.infoImage}/>}
                <Text style={styles.infoTitle}>{data.nameTeacher}</Text>    
                <Text style={styles.infoText}>{data.description}</Text>
                <View style={styles.inforContent}>
                    <AntDesign name="book" size={16} color="white" />
                    <Text style={styles.infoText}>{data.courses.length} courses</Text>
                </View>
                {data.students? 
                    <View style={styles.inforContent}>
                        <SimpleLineIcons name="graduation" size={16} color="white" />
                        <Text style={styles.infoText}>{data.major}</Text>
                    </View>
                    : ""
                }
                </View>
            </View>

            {/* Center */}
            <View style={styles.wrapper}>
                <TouchableOpacity>
                    <LinearGradient 
                        colors={['#4D768A', '#75A2A2']} 
                        style={styles.miniCard}
                        start={{ x: 1, y: 0 }} // Bắt đầu từ bên trái
                        end={{ x: 0, y: 0 }} // Kết thúc ở bên phải
                    >
                        <View style={styles.titleCard}>
                            <Ionicons name="business" size={16} color={COLORS.secondMain} />
                            <Text style={styles.titleCardText}>Center</Text>
                        </View>
                        <View style={styles.contentCard}>
                            <Image source={""} style={styles.avata}/>
                            <View>
                                <Text style={styles.titleContentCard}>Name</Text>
                                <Text style={styles.dataText}>description</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
                <View>
                    <LinearGradient 
                        colors={['#4D768A', '#75A2A2']} 
                        style={styles.miniCard}
                        start={{ x: 1, y: 0 }} // Bắt đầu từ bên trái
                        end={{ x: 0, y: 0 }} // Kết thúc ở bên phải
                    >
                        <View style={styles.titleCard}>
                            <Ionicons name="business" size={16} color={COLORS.secondMain} />
                            <Text style={styles.titleCardText}>Social/Profile</Text>
                        </View>
                        <View style={styles.contentCardCol}>
                        {data.socials.map(item => 
                            <TouchableOpacity style={styles.wrapSocial} key={item.id}>
                                <Text style={styles.infoText}>{item.title}</Text>
                                <MaterialIcons name="open-in-new" size={16} color="white" />
                            </TouchableOpacity>
                        )}
                        </View>
                    </LinearGradient>
                </View>
            </View>

            {/* Professional Qualifications */}
            <View style={styles.wrapperPro}>
                <View style={styles.titleCard}>
                    <MaterialCommunityIcons name="professional-hexagon" size={16} color={COLORS.secondMain} />
                    <Text style={styles.titleCardText}>Professional Qualifications</Text>
                </View>
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
                <View style={styles.bottom}>
                    <Text style={commonStyles.title}>Course</Text>
                    <ButtonIconLightGreen title={"See all"} icon={<MaterialIcons name="open-in-new" size={16} color={COLORS.main} />}/>
                </View>
                {data.courses.map((item)=><CardVirticalCourse data={item} key={item.id}/>)}
            </View>
            
        </ScrollView>
    )
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        // padding: 16,
        backgroundColor: "#FAFAFA"
    },
    wrapper: {
        margin: 16,
        rowGap: 10,
        borderColor: COLORS.lightText,
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
        fontSize: 24,
        fontWeight: "bold",
        color: "white"
    },
    infoText: {
        fontSize: 14,
        color: "white"
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
    },
    wrapSocial:{
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        paddingVertical: 8,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        columnGap: 4,
        paddingHorizontal: 16
    },

    wrapInfo: {
        ...commonStyles.shadow,
        height: width*2/3,
    },
    infoImg:{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapInfoContent: {
        position: "absolute",
        width: '100%',
        height: '100%',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: "flex-end",
    },
    btnUpDown:{
        position: "absolute",
        alignItems: "center",
        bottom: 10,
        left: 0,
        right: 0
    },
    miniCard:{
        borderRadius: 8,
        padding: 12,
        rowGap: 10,
    },
    avata: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 40,
        height: 40,
        backgroundColor: "white"
    },
    titleCard:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "white",
        borderRadius: 4,
        alignSelf: "flex-start",
        flexDirection: "row",
        columnGap: 4,
        alignItems: "center"
    },
    titleCardText: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.secondMain
    },
    contentCard: {
        flexDirection: "row",
        columnGap: 8
    },
    titleContentCard:{
        fontSize: 16,
        fontWeight: "bold"
    },
    contentCardCol: {
        rowGap: 4
    },
    wrapperPro:{
        padding: 12,
        margin: 16,
        rowGap: 10,
        backgroundColor: "#4D768A",
        borderRadius: 8
    },
    bottom:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})