import { useEffect, useState } from "react";
import { ViewAllFromDetail } from "../../ViewAllFromDetail";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getAllCourseCardsByIdTeacher } from "../../../services/course";
import { useUser } from "../../../contexts/UserContext";
import { COLORS } from "../../../utils/constants";
import Feather from '@expo/vector-icons/Feather';

export const TeacherAllAssignment = ()=>{
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);
    
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
            <View>
                <View style={styles.wrapperSearch}>
                    <TextInput
                        value={"search"}
                        style={styles.input}
                        placeholder={"Search"}
                        onChangeText={(value)=>{}}
                    />
                    <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                        <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                    </TouchableOpacity>
                </View>
            </View>
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