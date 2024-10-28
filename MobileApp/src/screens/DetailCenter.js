import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList, ImageBackground, Dimensions, ActivityIndicator } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { Tag } from "../components/Tag"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardHorizontalCourse, CardHorizontalProfessional, CardHorizontalTeacher } from "../components/CardHorizontal";
import { useEffect, useState } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical";
import { ButtonIconLightGreen } from "../components/Button";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getAllTeacherByIdCenter } from "../services/center";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
    ],
    socials: [
        { id: 1, title: "Github", link: "aaaaaaa"},
        { id: 2, title: "Facebook", link: "bbbbbb"},
    ]
}
export const DetailCenter =({route})=>{
    // const idCenter = route.params?.idCenter || 0
    const [selectBtn, setSelectBtn] = useState(0)
    const [data, setData] = useState(initCenter)
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState(true);

    useEffect(()=>{
        const getListTeacher = async()=>{
            try {
                const response = await getAllTeacherByIdCenter(idCenter)
                setTeacher(response)
            } catch (error) {
                console.log("Error: ", error);
            } finally{
                setLoading(false)
            }
        }
        getListTeacher()
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
        <ScrollView contentContainerStyle={styles.container}>
            {/* Center info */}
            <View style={styles.wrapInfo}>
                <ImageBackground
                    source={{ uri: "https://i.pinimg.com/enabled_lo/564x/63/af/bc/63afbc98994e96ae6cd3fd9b75ea2a33.jpg"}}
                    style={styles.infoImg}
                />
                <View style={styles.wrapInfoContent}>
                    <Text style={styles.infoTitle}>{data.nameCenter}</Text>
                    {/* <View style={{ rowGap: 2}}>
                        {data.listTags?.length > 0 && 
                            <View style={styles.inforContent}>
                                {data.listTags?.map(item => 
                                    <Tag key={item.id} label={item.value}/>  
                                )}                    
                            </View>
                        }
                    </View> */}
                    <Text style={styles.infoText}>{data.intro}</Text>
                    {/* <View style={styles.inforContent}>
                        <AntDesign name="book" size={16} color={"white"} />
                        <Text style={styles.infoText}>{data.courses?.length} courses</Text>
                    </View> */}

                    <View style={styles.inforContent}>
                        <Ionicons name="mail" size={16} color="white" />
                        <Text style={styles.infoText}>Mail</Text>
                    </View>
                    <View style={styles.inforContent}>
                        <FontAwesome5 name="phone-alt" size={16} color="white" />
                        <Text style={styles.infoText}>Contact Number</Text>
                    </View>
                    <View style={styles.inforContent}>
                        <MaterialIcons name="location-on" size={16} color="white" />
                        <Text style={styles.infoText}>Address</Text>
                    </View>
                    <View style={styles.inforContent}>
                        <FontAwesome5 name="birthday-cake" size={17} color="white" />
                        <Text style={styles.infoText}>Date Established</Text>
                    </View>
                    <View style={styles.inforContent}>
                        <FontAwesome6 name="handshake-angle" size={12} color="white" />
                        <Text style={styles.infoText}>Date Creates</Text>
                    </View>
                </View>
            </View>

            <View style={styles.wrapMiniCard}>
                {/* Total Courses */}
                <LinearGradient 
                    colors={['#4D768A', '#75A2A2']} 
                    style={styles.miniCard}
                    start={{ x: 0, y: 0 }} // Bắt đầu từ bên trái
                    end={{ x: 1, y: 0 }} // Kết thúc ở bên phải
                >
                    <View style={styles.titleCard}>
                        <FontAwesome name="file-text" size={16} color={COLORS.secondMain} />
                        <Text style={styles.titleCardText}>Total Courses</Text>
                    </View>
                    <Text style={styles.titleContentCard}>10000</Text>
                </LinearGradient>

                {/* Total Students */}
                <LinearGradient 
                    colors={['#4D768A', '#75A2A2']} 
                    style={styles.miniCard}
                    start={{ x: 0, y: 0 }} // Bắt đầu từ bên trái
                    end={{ x: 1, y: 0 }} // Kết thúc ở bên phải
                >
                    <View style={styles.titleCard}>
                        <FontAwesome name="users" size={16} color={COLORS.secondMain} />
                        <Text style={styles.titleCardText}>Total Students</Text>
                    </View>
                    <Text style={styles.titleContentCard}>10.000</Text>
                </LinearGradient>
            </View>

            <View style={styles.wrapperSocial}>
                <LinearGradient 
                    colors={['#4D768A', '#75A2A2']} 
                    style={[styles.miniCard, { width: "auto"}]}
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

            {/* Professional Qualifications */}
            <View style={styles.wrapper}>
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

            <View style={styles.wrapperBottom}>
                <View style={styles.board}>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(0)}>
                        <Text style={selectBtn === 0 ? styles.selectBtn : styles.normalBtn}>Course</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                        <Text style={selectBtn === 1 ? styles.selectBtn : styles.normalBtn}>Teacher</Text>
                    </TouchableOpacity>
                </View>
                {selectBtn === 0 ?
                        <>
                            <ButtonIconLightGreen title={"See all"} icon={<MaterialIcons name="open-in-new" size={16} color={COLORS.main} />}/>
                            {/* {data.courses.map((item)=><CardVirticalCourse data={item} />)} */}
                        </>
                    :   
                        <>
                            <ButtonIconLightGreen title={"See all"} icon={<MaterialIcons name="open-in-new" size={16} color={COLORS.main} />}/>
                            {teacher.map((item)=><CardVirticalTeacher data={item} />)}
                        </>
                }
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
        padding: 12,
        margin: 16,
        rowGap: 10,
        backgroundColor: "#4D768A",
        borderRadius: 8
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
    wrapperBottom: {
        padding: 16,
        rowGap: 10,
        minHeight: 600,
    },
    board: {
        flexDirection: "row",
        columnGap: 4,
    },
    boardBtn: {
        justifyContent: "center"
    },
    normalBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        color: COLORS.stroke,
        fontWeight: "bold",
    },
    selectBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 18,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderBottomColor: COLORS.main
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    wrapMiniCard:{
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    miniCard:{
        borderRadius: 8,
        padding: 12,
        rowGap: 10,
        width: 170
    },
    titleContentCard:{
        fontSize: 16,
        fontWeight: "bold",
        color: "white"
    },
    wrapperSocial: {
        marginHorizontal: 16,
    },
    contentCardCol: {
        rowGap: 4
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
})