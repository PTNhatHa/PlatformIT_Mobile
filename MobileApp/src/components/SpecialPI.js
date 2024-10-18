import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, View } from "react-native"
import { TextInputLabel } from "../components/TextInputField"
import { useState, useEffect } from "react"
import { useUser } from "../contexts/UserContext"
import { ButtonGreen, ButtonWhite } from "./Button"
import { COLORS, commonStyles } from "../utils/constants"

export const SpecialPI = ({initData=[]})=>{
    const [center, setCenter] = useState(initData.centerName)
    const [teaching, setTeaching] = useState(initData.teachingMajor)
    const [description, setDescription] = useState(initData.description)
    const {state, dispatch} = useUser()
    const [loading, setLoading] = useState(false);

    const handleSavePITeacher = async ()=>{
        setLoading(true)
        try{
            // Teaching & Bio
            try{
                const response = await updateTeacherSpecializedPI(state.idUser, teaching, description)
                if(response.error){
                    Alert.alert("Warning", response.data)
                }else{
                    Alert.alert("Noti", "Save change done 0o0")
                }
            } catch(e){
                console.log("Error updateTeacherSpecializedPI: ", e);
            }
        } catch(e){
            console.log("Error handleSavePITeacher: ", e);
        } finally{
            setLoading(false)
        }
    }

    if (loading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }
    const handleDiscard = ()=>{
        setTeaching(initData.teachingMajor)
        setDescription(initData.description)
    }
    return(
        <>
            <View style={styles.PI}>
                <Text style={commonStyles.title}>Basic information</Text>
                <View style={styles.body}>
                    <TextInputLabel label={"Affiliated Center"} value={center}/>
                    <TextInputLabel label={"Teaching Specialization"} value={teaching} onchangeText={setTeaching}/>
                    <TextInputLabel label={"Bio"} value={description} onchangeText={setDescription}/>
                </View>
                <View style={styles.bottom}>
                    <ButtonWhite title={"Discard Changes"} action={handleDiscard}/>
                    <ButtonGreen title={"Save Changes"} action={handleSavePITeacher}/>
                </View>
            </View>   
            {loading &&
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.wrapLoading}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                </Modal>
            } 
        </>      
    )
}
const styles = StyleSheet.create({
    PI: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        rowGap: 10,
    },
    container: {
        padding: 16,
        width: "100%",
        flexDirection: "column",
        rowGap: 16,
    },
    body: {
        rowGap: 10,
    },
    title:{
        fontSize: 18,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderColor: COLORS.lightText
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
})