import { ActivityIndicator, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, commonStyles } from "../../../utils/constants";
import { useEffect, useRef, useState } from "react";
import { ModalCourseContent } from "../../../components/ModalCourseContent";
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardAssignment } from "../../../components/CardAssignment";
import { Comments } from "../../../components/Comments";
import { Video } from "expo-av";
import { getLectureDetail } from "../../../services/lecture";
import { calculateRelativeTime, parseRelativeTime } from "../../../utils/utils";
import { getCourseContentStructure } from "../../../services/course";
import { useUser } from "../../../contexts/UserContext";

export const StudentLectureDetail = ({route})=>{
    const {idLecture} = route?.params || {}
    const {state} = useUser()
    const [index, setIndex] = useState(1)
    const [currentLecture, setCurrentLecture] = useState(idLecture)
    const [isOpenMenu, setIsOpentMenu] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [selectLecture, setSelectLecture] = useState({
        idLecture: idLecture,
        lectureTitle: "",
        idSection: 0,
        sectionName: ""
    });
    const [courseContent, setCourseContent] = useState([])
    const intervalRef = useRef(null);
    const fetchDetailLecture = async()=>{
        try {
            const response = await getLectureDetail(selectLecture.idLecture)
            if(response){
                setData({
                    ...response,
                    timestamp: parseRelativeTime(response.relativeTime),
                })        
                if(idLecture === currentLecture){
                    fetchCourseContent(response)   
                    setCurrentLecture(selectLecture.idLecture)     
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    const fetchCourseContent = async(response)=>{
        try {
            const content = await getCourseContentStructure(state.idUser, response.idCourse)
            if(content){
                setCourseContent(content.sectionStructures.map(section => {
                    if(section.idSection === response.idSection){
                        setSelectLecture({
                            idLecture: currentLecture,
                            lectureTitle: response.lectureTitle,
                            idSection: section.idSection,
                            sectionName: section.sectionName
                        })
                    }
                    return{
                        ...section,
                        lectures: section.lectureStructures
                    }
                }))
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    useEffect(()=>{
        setLoading(true)
        fetchDetailLecture()
        intervalRef.current = setInterval(() => {
            setData({
                ...data,
                relativeTime: calculateRelativeTime(data.timestamp)
            })
        }, 60000);
        return () => clearInterval(intervalRef.current);
    }, [])

    useEffect(()=>{
        if(idLecture !== selectLecture.idLecture){
            setLoading(true)
            clearInterval(intervalRef.current)
            fetchDetailLecture()
            .then(() => {
                intervalRef.current = setInterval(() => {
                    // console.log(data.timestamp);
                    // console.log(data.relativeTime);
                    setData((prevData) => ({
                        ...prevData,
                        relativeTime: calculateRelativeTime(prevData.timestamp),
                    }));
                }, 6000);
            });
        }
    }, [selectLecture])

    const openURL = (url) => {  
        Linking.canOpenURL(url)  
        .then((supported) => {  
            if (supported) {  
            return Linking.openURL(url);  
            } else {  
            console.log("Can't open URL: " + url);  
            }  
        })  
        .catch((err) => console.error('Error occurred', err));  
    };  

    const handleSelectLecture = (v)=>{
        setSelectLecture(v)
        setIsOpentMenu(false)
    }

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
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.title}>{data.courseTitle}</Text>
                    <TouchableOpacity onPress={()=>setIsOpentMenu(true)}>
                        <Entypo name="menu" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.main}>
                    <View style={styles.wrapperMainContent}>
                        <View>
                            <Text style={styles.title}>{data.lectureTitle}</Text>
                            <Text style={styles.textGray12}>{data.relativeTime}</Text>
                        </View>
                        {data.videoMaterial &&
                            <Video
                                source={{ uri: data.videoMaterial.path }}
                                style={styles.contentVideo}
                                useNativeControls
                                resizeMode="contain"
                            />
                        }
                        {data.mainMaterials?.length > 0 &&
                            <View>
                                <Text style={styles.textBlack16}>Materials</Text>
                                <TouchableOpacity style={styles.wrapGray} onPress={()=>openURL(data.mainMaterials[0]?.path)}>
                                    <Text numberOfLines={1}>{data.mainMaterials[0]?.fileName}</Text>
                                </TouchableOpacity>                                
                            </View>
                        }
                    </View>
                    <View style={styles.nav}>
                        <TouchableOpacity onPress={()=>setIndex(1)}>
                            <Text style={index === 1 ? styles.navTextActive : styles.navText}>Introduction</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setIndex(2)}>
                            <Text style={index === 2 ? styles.navTextActive : styles.navText}>Sup materials</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setIndex(3)}>
                            <Text style={index === 3 ? styles.navTextActive : styles.navText}>Exercise</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setIndex(4)}>
                            <Text style={index === 4 ? styles.navTextActive : styles.navText}>Comment</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    {index === 1 &&
                        <View style={styles.wrapper}>
                            <View style={styles.wrapContent}>
                                {data.lectureIntroduction &&
                                    <Text style={styles.textGray12}>{data.lectureIntroduction}</Text>
                                }
                            </View>                           
                        </View>
                    }
                    {index === 2 && data.supportMaterials?.length > 0 &&
                        <View style={styles.wrapper}>
                            <View style={styles.wrapContent}>
                                {data.supportMaterials.map(sup => 
                                    <TouchableOpacity style={styles.wrapGray} key={sup.idFile}  onPress={()=>openURL(sup?.path)}>
                                        <Text numberOfLines={1}>{sup?.fileName}</Text>
                                    </TouchableOpacity>  
                                    ) 
                                }
                            </View>
                        </View>
                    }

                    {/* Exercise */}
                    {index === 3 &&
                        <View style={[styles.wrapper]}>
                            <CardAssignment isNoBoder={true}/>
                            <CardAssignment isNoBoder={true}/>
                        </View>
                    }

                    {/* Comment */}
                    {index === 4 &&
                        <View style={[styles.wrapper]}>
                            <Comments/>
                        </View>
                    }
                </View>
            </ScrollView>

            <Modal
                visible={isOpenMenu}
                transparent={true}
                animationType="slide"
                onRequestClose={()=>setIsOpentMenu(true)}
            >
                <View style={styles.modal}>
                    <ScrollView contentContainerStyle={styles.innerModal}>
                        <TouchableOpacity style={{alignSelf: "flex-end"}} onPress={()=>setIsOpentMenu(false)}>
                            <AntDesign name="close" size={30} color={COLORS.secondMain} />
                        </TouchableOpacity>
                        <ModalCourseContent role={2} selectLecture={selectLecture} setSelectLecture={handleSelectLecture} content={courseContent}/>
                    </ScrollView>
                </View>
            </Modal>
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }  
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FAFAFA",
        minHeight: "100%"
    },
    top:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    main: {
        ...commonStyles.shadow,
        minHeight: 500,
        borderRadius: 8,
        backgroundColor: "white",
        paddingBottom: 16
    },
    contentVideo: {
        width: "100%",
        height: 200,
        backgroundColor: COLORS.lightText,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        // marginTop: 16,
        marginBottom: 8
    },
    textGray12:{
        fontSize: 12,
        color: COLORS.stroke
    },
    wrapperMainContent: {
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 4
    },
    wrapper: {
        paddingHorizontal: 16,
        marginVertical: 0,
        gap: 4
    },
    nav:{
        paddingHorizontal: 16,
        borderBottomWidth: 0.7,
        borderColor: COLORS.lightText,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    navText: {
        fontSize: 14,
        color: COLORS.lightText,
        paddingVertical: 8
    },
    navTextActive: {
        fontSize: 14,
        paddingVertical: 8,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderColor: COLORS.main,
    },
    textBlack16: {
        fontSize: 16,
        fontWeight: "bold",
    },
    wrapContent:{
        marginVertical: 8
    },
    modal: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16,
    },
    innerModal: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    wrapGray:{
        fontSize: 16,
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        marginBottom: 4
    },
})