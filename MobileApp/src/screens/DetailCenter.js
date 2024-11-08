import { StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList, ImageBackground, Dimensions, ActivityIndicator } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { Tag } from "../components/Tag"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CardHorizontalProfessional } from "../components/CardHorizontal";
import { useEffect, useState } from "react";
import { CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical";
import { ButtonIconLightGreen } from "../components/Button";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getCenterDetail } from "../services/center";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { formatDateTime, openLink } from "../utils/utils";
import { useNavigation } from "@react-navigation/native";

export const DetailCenter =({route})=>{
    const navigation = useNavigation()
    const idCenter = route.params?.idCenter || 0
    const [selectBtn, setSelectBtn] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    const getCenter = async()=>{
        try {
            const response = await getCenterDetail(idCenter)
            if(response){
                setData(response)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getCenter()
    }, [idCenter])

            
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
                    source={{ uri: data.avatarPath}}
                    style={styles.infoImg}
                />
                <View style={styles.wrapInfoContent}>
                    <Text style={styles.infoTitle}>{data.centerName}</Text>
                    <View>
                        <FlatList
                            data={data.listTagCourses}
                            renderItem={({item}) => 
                                <Tag key={item.idTag} label={item.tagName}/>  
                            }
                            horizontal={true}
                            keyExtractor={item => item.idTag}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
                        />
                    </View>
                    {data.description &&
                        <Text style={styles.infoText}>{data.description}</Text>
                    }

                    {data.centerEmail &&
                        <View style={styles.inforContent}>
                            <Ionicons name="mail" size={16} color="white" />
                            <Text style={styles.infoText}>{data.centerEmail}</Text>
                        </View>
                    }
                    {data.phoneNumber &&
                        <View style={styles.inforContent}>
                            <FontAwesome5 name="phone-alt" size={16} color="white" />
                            <Text style={styles.infoText}>{data.phoneNumber}</Text>
                        </View>
                    }
                    {data.address && 
                        <View style={styles.inforContent}>
                            <MaterialIcons name="location-on" size={16} color="white" />
                            <Text style={styles.infoText}>{data.address}</Text>
                        </View>
                    }
                    {data.establishedDate && 
                        <View style={styles.inforContent}>
                            <FontAwesome5 name="birthday-cake" size={17} color="white" />
                            <Text style={styles.infoText}>Established date: {data.establishedDate}</Text>
                        </View>
                    }
                    <View style={styles.inforContent}>
                        <FontAwesome6 name="handshake-angle" size={12} color="white" />
                        <Text style={styles.infoText}>Join date: {formatDateTime(data.submissionDate)}</Text>
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
                    <Text style={styles.titleContentCard}>{data.courseCount}</Text>
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
                    <Text style={styles.titleContentCard}>{data.studentCount}</Text>
                </LinearGradient>
            </View>

            {/* Working hour */}
            <View style={[styles.wrapperSocial, {marginBottom: 16}]}>
                <LinearGradient 
                    colors={['#4D768A', '#75A2A2']} 
                    style={[styles.miniCard, { width: "auto"}]}
                    start={{ x: 1, y: 0 }} // Bắt đầu từ bên trái
                    end={{ x: 0, y: 0 }} // Kết thúc ở bên phải
                >
                    <View style={styles.titleCard}>
                        <Ionicons name="hourglass-outline" size={16} color={COLORS.secondMain} />
                        <Text style={styles.titleCardText}>Working hour</Text>
                    </View>
                    <View style={styles.wrapAllHour}>
                    <FlatList
                        data={data.workingHourModel}
                        renderItem={({item}) => 
                            <View style={styles.wrapHour}>
                                <Text style={styles.textDay}>{item.day}</Text>
                                {item.isOpen ?
                                <>
                                    <Text style={styles.textHour}>{item.startTime}</Text>
                                    <Text style={styles.textHour}>-</Text>
                                    <Text style={styles.textHour}>{item.closeTime}</Text>
                                </> 
                                :
                                <>
                                    <Text style={styles.textHour}></Text>
                                    <Text style={styles.textHour}>Close</Text>
                                    <Text style={styles.textHour}></Text>
                                </>
                                }
                            </View>
                        }
                        horizontal={true}
                        keyExtractor={item => item.day}
                        showsHorizontalScrollIndicator={false}
                    />
                    </View>
                </LinearGradient>
            </View>

            {/* Social/Profile */}
            {data.profileLinks.length > 0 &&
                <View style={styles.wrapperSocial}>
                    <LinearGradient 
                        colors={['#4D768A', '#75A2A2']} 
                        style={[styles.miniCard, { width: "auto"}]}
                        start={{ x: 1, y: 0 }} // Bắt đầu từ bên trái
                        end={{ x: 0, y: 0 }} // Kết thúc ở bên phải
                    >
                        <View style={styles.titleCard}>
                            <MaterialCommunityIcons name="layers-triple" size={16} color={COLORS.secondMain} />
                            <Text style={styles.titleCardText}>Social/Profile</Text>
                        </View>
                        <View style={styles.contentCardCol}>
                        {data.profileLinks.map(item => 
                            <TouchableOpacity style={styles.wrapSocial} key={item.idProfileLink} onPress={()=>openLink(item.url)}>
                                <Text style={styles.infoText}>{item.name}</Text>
                                <MaterialIcons name="open-in-new" size={16} color="white" />
                            </TouchableOpacity>
                        )}
                        </View>
                    </LinearGradient>
                </View>
            }

            {/* Professional Qualifications */}
            {data.qualifications.length > 0 &&
                <View style={styles.wrapper}>
                    <View style={styles.titleCard}>
                        <MaterialCommunityIcons name="professional-hexagon" size={16} color={COLORS.secondMain} />
                        <Text style={styles.titleCardText}>Professional Qualifications</Text>
                    </View>
                    <FlatList
                        data={data.qualifications}
                        renderItem={({item}) => <CardHorizontalProfessional data={item}/>}
                        horizontal={true}
                        keyExtractor={item => item.idQualification}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            }

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
                            <ButtonIconLightGreen 
                                title={"See all"} 
                                icon={<MaterialIcons name="open-in-new" size={16} color={COLORS.main} />}
                                action={()=> navigation.navigate("Courses of center", {initData: data.courseCards, index: 1, namePage: data.centerName})}
                            />
                            {data.courseCards.slice(0, 5).map((item)=><CardVirticalCourse data={item} key={item.idCourse}/>)}
                            <Text style={styles.more}>...</Text>
                        </>
                    :   
                        <>
                            <ButtonIconLightGreen 
                                title={"See all"} 
                                icon={<MaterialIcons name="open-in-new" size={16} color={COLORS.main} />}
                                action={()=> navigation.navigate("Teachers of center", {initData: data.teacherCards, index: 3, namePage: data.centerName})}
                            />
                            {data.teacherCards.slice(0, 5).map((item)=><CardVirticalTeacher data={item} key={item.idUser}/>)}
                            <Text style={styles.more}>...</Text>
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
        rowGap: 4,
        alignItems: "center",
        flexWrap: "wrap"
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
    more: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    },
    wrapAllHour: {
        flexDirection: "row"
    },
    wrapHour: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    textDay:{
        color: "white",
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: "white",
        fontSize: 12,
        textAlign: "center",
        marginBottom: 10
    },
    textHour: {
        color: "white",
        fontSize: 12,
        textAlign: "center"
    }
})