import { Image, StyleSheet, View, ScrollView, Text, TouchableOpacity, FlatList, ImageBackground, Dimensions, ActivityIndicator } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import DefaultImg from "../../assets/images/DefaultImg.png"
import DefaultAva from "../../assets/images/DefaultAva.png"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardHorizontalProfessional } from "../components/CardHorizontal";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ButtonIconLightGreen } from "../components/Button";
import { getDetailTeacher } from "../services/user";
import { openLink } from "../utils/utils";
import { useNavigation } from "@react-navigation/native";
import { CardVirticalCourse } from "../components/CardVertical";

const initTeacher={
    "name": "Phan Trần Nhật Hạ",
    "teachingMajor": "Software Developer; FE; UI, UX Designer",
    "avatarPath": "https://storage.googleapis.com/plait-1bf02.appspot.com/avatar_029c7a58-ca40-4ea7-b82b-479f0ba8a99e.png",
    "coursesCount": 0,
    "centerName": "HAHYWU CENTER",
    "links": [
      {
        "idProfileLink": 38,
        "name": "Facebook",
        "url": "https://www.facebook.com/phan.ha.754703"
      },
    ],
    "qualificationModels": [
      {
        "idQualification": 10,
        "path": "https://storage.googleapis.com/plait-1bf02.appspot.com/aws_certification_8f3d2c16-4181-4268-a3f1-50756432aaca.png",
        "qualificationName": "AWS Certification",
        "description": " An AWS certification equips me with cloud computing expertise, enhancing my teaching and better preparing students for modern technology.",
        "reason": null,
        "status": null
      },
    ],
    "courses": []
  }
export const DetailTeacher =({route})=>{
    const idTeacher = route.params?.idTeacher || false
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState([])
    const navigation = useNavigation()
    const getTeacher = async()=>{
        try {
            const response = await getDetailTeacher(idTeacher)
            if(response){
                setData(response)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        getTeacher()
    }, [idTeacher])

    if (isLoading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }

    return(
        <>
            <ScrollView contentContainerStyle={styles.container} key={data.idUser}>
                {/* Teacher info */}
                <View style={styles.wrapInfo}>
                    <LinearGradient 
                            colors={['#4D768A', '#75A2A2']} 
                            style={styles.infoImg}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                        >
                        <View style={styles.wrapInfoContent}>
                            <Image source={data.teacherAvatar ? {uri: data.teacherAvatar} : DefaultAva} style={styles.infoImage}/>
                            <Text style={styles.infoTitle}>{data.name ? data.name : "<Unknown>"}</Text>    
                            <View style={[styles.inforContent, {paddingTop: 10}]}>
                                <AntDesign name="book" size={16} color="white" />
                                <Text style={styles.infoText}>{data.coursesCount} {data.coursesCount > 1 ? "courses" : "course"}</Text>
                            </View>
                            {data.teachingMajor? 
                                <View style={styles.inforContent}>
                                    <SimpleLineIcons name="graduation" size={16} color="white" />
                                    <Text style={styles.infoText}>{data.teachingMajor}</Text>
                                </View>
                                : ""
                            }
                            {data.teacherDescription &&
                                <Text style={[styles.infoText, {paddingTop: 10}]}>{data.teacherDescription}</Text>
                            }
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.wrapper}>
                {/* Center */}
                    <TouchableOpacity onPress={()=> navigation.navigate("Detail Center", {idCenter : data.idCenter})}>
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
                                <Image source={{uri: data.centerAvatar}} style={styles.avata}/>
                                <View>
                                    <Text style={styles.titleContentCard}>{data.centerName}</Text>
                                    <Text style={{color: "white"}}>{data.centerDescription}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Social/Profile */}
                    {data.links?.length > 0 &&
                        <View>
                            <LinearGradient 
                                colors={['#4D768A', '#75A2A2']} 
                                style={styles.miniCard}
                                start={{ x: 1, y: 0 }} // Bắt đầu từ bên trái
                                end={{ x: 0, y: 0 }} // Kết thúc ở bên phải
                            >
                                <View style={styles.titleCard}>
                                    <MaterialCommunityIcons name="layers-triple" size={16} color={COLORS.secondMain} />
                                    <Text style={styles.titleCardText}>Social/Profile</Text>
                                </View>
                                <View style={styles.contentCardCol}>
                                    {data.links?.map(item => 
                                        <TouchableOpacity style={styles.wrapSocial} key={item.idProfileLink} onPress={()=>openLink(item.url)}>
                                            <Text style={styles.infoText}>{item.name}</Text>
                                            <MaterialIcons name="open-in-new" size={16} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </LinearGradient>
                        </View>
                    }
                </View>

                {/* Professional Qualifications */}
                {data.qualificationModels?.length > 0 &&
                    <View style={styles.wrapperPro}>
                        <View style={styles.titleCard}>
                            <MaterialCommunityIcons name="professional-hexagon" size={16} color={COLORS.secondMain} />
                            <Text style={styles.titleCardText}>Professional Qualifications</Text>
                        </View>
                        <FlatList
                            data={data.qualificationModels}
                            renderItem={({item}) => <CardHorizontalProfessional data={item}/>}
                            horizontal={true}
                            keyExtractor={item => item.idQualification}
                            showsHorizontalScrollIndicator={false}
                            />
                    </View>
                }

                {/* Top Courses */}
                <View style={styles.wrapper}>
                    <View style={styles.bottom}>
                        <Text style={commonStyles.title}>Course</Text>
                        <ButtonIconLightGreen title={"See all"} icon={<MaterialIcons name="open-in-new" size={16} color={COLORS.main} />}/>
                    </View>
                    {data.courses.length > 0 &&
                        data.courses?.map((item)=><CardVirticalCourse data={item} key={item.idCourse}/>)
                    }
                    <Text style={styles.more}>...</Text>
                </View>
            </ScrollView>
            {isLoading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }   
        </>
    )
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        // padding: 16,
        backgroundColor: "#FAFAFA",
        minHeight: "100%"
    },
    wrapper: {
        margin: 16,
        rowGap: 10,
        borderColor: COLORS.lightText,
    },
    infoImage: {
        resizeMode: "cover",
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
        color: "white",
        textAlign: "center"
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
    },
    infoImg:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapInfoContent: {
        width: '100%',
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: "flex-end",
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
        fontWeight: "bold",
        color: "white"
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
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    more: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    }
})