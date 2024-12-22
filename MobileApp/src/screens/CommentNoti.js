import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"
import { Comments } from "../components/Comments"
import { COLORS, commonStyles } from "../utils/constants"
import AntDesign from '@expo/vector-icons/AntDesign';
import { getLectureInfoForCmtNoti } from "../services/lecture";
import { useEffect, useState } from "react";

export const CommentNoti = ({route})=>{
    const {idLecture, idComment} = route.params
    const [detail, setDetail] = useState()
    const [loading, setLoading] = useState(true);

    const getDetail = async()=>{
        try {
            const response = await getLectureInfoForCmtNoti(idLecture)
            if(response){
                setDetail(response)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        getDetail()
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
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.inner}>
                <View>
                    <Text style={styles.title} numberOfLines={1}>{detail?.nameCourse}</Text>
                    <View style={styles.wrapFlex}>
                        <AntDesign name="right" size={14} color="black" style={{width: 18}}/>
                        <Text style={styles.title} numberOfLines={1}>{detail?.nameSection}</Text>
                    </View>
                    <View style={styles.wrapFlex}>
                        <AntDesign name="right" size={14} color="black" style={{width: 18}}/>
                        <Text style={styles.title} numberOfLines={1}>{detail?.nameLecture}</Text>
                    </View>
                </View>
                <View style={styles.main}>
                    <Comments idLecture={detail.idLecture} idTeacher={detail.idTeacher} idComment={idComment}/>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    inner:{
        padding: 16,
        gap: 8
    },
    main: {
        ...commonStyles.shadow,
        borderRadius: 8,
        backgroundColor: "white",
        paddingBottom: 16,
        flex: 1
    },
    title: {
        fontSize: 16,
        flexWrap: "wrap"
    },
    wrapFlex: {
        flexDirection: 'row',
        gap: 4
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
})