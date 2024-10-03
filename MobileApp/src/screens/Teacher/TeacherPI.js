import { ScrollView, StyleSheet, Text, View } from "react-native"
import { PersionalInfor } from "../../components/PI"
import { TextInputLabel } from "../../components/TextInputField"
import { useState } from "react"
import { COLORS } from "../../constants"
import { Professional } from "../../components/Professional"

export const TeacherPI = ({navigation})=>{
    const [center, setCenter] = useState("Trung tâm trực thuộc")
    const [specialize, setspecialize] = useState("Chuyên ngành giảng dạy")
    return(
        <View style={styles.PI}>
            <ScrollView>
                <Text style={styles.title}>Your information</Text>
                <PersionalInfor navigation={navigation}/>
                <Text style={styles.title}>More information</Text>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.body}>
                        <TextInputLabel label={"Affiliated Center"} value={center}/>
                        <TextInputLabel label={"Teaching Specialization"} value={specialize}/>
                        <Professional label={"Professional Qualifications"}/>
                    </View>
                </ScrollView>
            </ScrollView>
        </View>        
    )
}
const styles = StyleSheet.create({
    PI: {
        flex: 1,
        backgroundColor: "white"
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
    }
})