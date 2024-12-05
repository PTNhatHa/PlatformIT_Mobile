import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useState, useEffect, useRef, useCallback } from "react";
import { COLORS} from "../../../utils/constants";
import { ViewAllFromDetail } from "../../ViewAllFromDetail";
import { getAllCourseCardsByIdStudent } from "../../../services/course";
import { useUser } from "../../../contexts/UserContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export const StudentAllCourse = ({route})=>{
    const navigation = useNavigation()
    const idCourse = route?.params?.idCourse || null
    const {state, dispatch} = useUser()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        if(idCourse !== null){
            navigation.navigate("Detail My Course", {
                idCourse: idCourse,
                role: route?.params?.role
            });
        }
    },[idCourse])
    
    const getAllCourseOfStudent = async()=>{
        try {
            setLoading(true)
            const response = await getAllCourseCardsByIdStudent(state.idUser)
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
        getAllCourseOfStudent()
    }, [])
    
    useFocusEffect(
        useCallback(() => {
            getAllCourseOfStudent();
        }, []) // Dependency array đảm bảo hiệu suất
    );
    
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
            {!loading &&
                <ViewAllFromDetail myCourse={data} role={1}/>
            }
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }  
        </>
    )
}
const styles = StyleSheet.create({
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    }
})
