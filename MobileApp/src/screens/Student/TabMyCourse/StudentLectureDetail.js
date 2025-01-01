import { ActivityIndicator, Alert, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, commonStyles } from "../../../utils/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { ModalCourseContent } from "../../../components/ModalCourseContent";
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardAssignment } from "../../../components/CardAssignment";
import { Comments } from "../../../components/Comments";
import { Video } from "expo-av";
import { finishLectures, getLectureDetail } from "../../../services/lecture";
import { calculateRelativeTime, parseRelativeTime } from "../../../utils/utils";
import { getCourseContentStructure } from "../../../services/course";
import { useUser } from "../../../contexts/UserContext";
import { GetExerciseOfLecture, getExerciseOfLectureViaStudent } from "../../../services/assignment";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export const StudentLectureDetail = ({route})=>{
    const {idLecture, idTeacher, isFinishedLecture} = route?.params || {}
    const {state} = useUser()
    const [index, setIndex] = useState(1)
    const [currentLecture, setCurrentLecture] = useState(idLecture)
    const [isOpenMenu, setIsOpentMenu] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [selectLecture, setSelectLecture] = useState({
        idLecture: idLecture,
        lectureTitle: "",
        idSection: null,
        sectionName: "",
    });
    const [exercises, setExercises] = useState([])
    const intervalRef = useRef(null);

    const [timeReached, setTimeReached] = useState(isFinishedLecture);

    const handleFinishLecture = async()=>{
        try {
            const response = await finishLectures(idLecture, state.idUser)
            if(response){
                Toast.show({
                    type: 'success', // Loại thông báo: success, error, info
                    text1: 'Hoàn thành', // Tiêu đề thông báo
                    text2: 'Bạn đã hoàn thành bài giảng 🎉', // Nội dung thông báo
                    visibilityTime: 3000, // Thời gian hiển thị (ms)
                });
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    const handlePlaybackStatusUpdate = (status) => {
        if (status.isLoaded && status.isPlaying && status.durationMillis && !timeReached) {
            const halfwayPoint = status.durationMillis / 10;
            console.log(status.positionMillis, " --- ", halfwayPoint, " --- ", status.positionMillis >= halfwayPoint);
            if (status.positionMillis >= halfwayPoint) {
                if (!timeReached) {                    
                    setTimeReached(true);
                    handleFinishLecture()
                }
            }
        }
    };

    const fetchDetailLecture = async()=>{
        setLoading(true)
        try {
            const response = await getLectureDetail(selectLecture.idLecture)
            if(response){
                if(!response.videoMaterial && !timeReached){
                    setTimeout(() => {
                        setTimeReached(true)
                        // console.log("2 phút đã trôi qua, timeReached được đặt thành true");
                        handleFinishLecture()
                    }, 120000);
                }
                setData({
                    ...response,
                    timestamp: parseRelativeTime(response.relativeTime),
                })        
                if(!selectLecture.idSection){
                    setSelectLecture({
                        idLecture: idLecture,
                        lectureTitle: "",
                        idSection: response.idSection,
                        sectionName: ""
                    })
                }
                if(currentLecture !== selectLecture.idLecture){
                    setCurrentLecture(selectLecture.idLecture)
                }
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    const fetchExercise = async()=>{
        setLoading(true)
        try {
            const response = await GetExerciseOfLecture(selectLecture.idLecture, state.idUser)
            if(response){
                setExercises([...response.filter(ex => {
                    return ex.isPublish === 1 &&
                            (ex.startDate !== null && new Date(ex.startDate) <= new Date() || 
                            ex.startDate === null)
                })])
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        setLoading(true)
        fetchDetailLecture()
        // fetchExercise()
        intervalRef.current = setInterval(() => {
            setData((prevData) => ({
                ...prevData,
                relativeTime: calculateRelativeTime(prevData.timestamp),
            }))
        }, 60000);
        return () => clearInterval(intervalRef.current);
    }, [])
    
    useFocusEffect(
        useCallback(() => {
            fetchExercise()
        }, [])
    );

    useEffect(()=>{
        if(currentLecture !== selectLecture.idLecture){
            setLoading(true)
            try {
                clearInterval(intervalRef.current)
                fetchDetailLecture()        
                .then(() => {
                    intervalRef.current = setInterval(() => {
                        setData((prevData) => ({
                            ...prevData,
                            relativeTime: calculateRelativeTime(prevData.timestamp),
                        }));
                    }, 60000);
                });
                fetchExercise() 
            } catch (error) {
                console.log("Error: ", error);
            } finally{
                setLoading(false)
            }
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
            <TouchableOpacity style={styles.btnMenu} onPress={()=>setIsOpentMenu(true)}>
                <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.title}>{data.courseTitle}</Text>
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
                                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
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
                        <View style={[styles.wrapper2]}>
                            {exercises.map(exercise => 
                                <CardAssignment data={exercise} isNoBoder={true} key={exercise.idAssignment} isStudentExercise={true}/>
                            )}
                        </View>
                    }

                    {/* Comment */}
                    {index === 4 &&
                        <Comments idLecture={selectLecture.idLecture} idTeacher={idTeacher}/>
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
                        <ModalCourseContent 
                            role={2} selectLecture={selectLecture} setSelectLecture={handleSelectLecture}
                            idCourse={data.idCourse} setTimeReached={setTimeReached}
                        />
                    </ScrollView>
                </View>
            </Modal>
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }  
            <Toast />
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
    wrapper2: {
        paddingHorizontal: 16,
        marginVertical: 8,
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
    btnMenu:{
        ...commonStyles.shadow,
        backgroundColor: COLORS.main30,
        width: 50,
        height: 50,
        borderRadius: 90,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 16,
        zIndex: 1
    },
})