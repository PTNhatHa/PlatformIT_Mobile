import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"
import { PersionalInfor } from "../../../components/PI"
import { TextInputLabel } from "../../../components/TextInputField"
import { useState, useEffect } from "react"
import { COLORS } from "../../../utils/constants"
import { Professional } from "../../../components/Professional"
import { useUser } from "../../../contexts/UserContext"
import { getUserInfo } from "../../../services/user"
import { SocialLink } from "../../../components/SocialLink"
import { ButtonGreen } from "../../../components/Button"

export const TeacherPI = ({navigation})=>{
    const [center, setCenter] = useState("Trung tâm trực thuộc")
    const [specialize, setSpecialize] = useState("Chuyên ngành giảng dạy")
    const [description, setDescription] = useState("Description")
    const [socials, setSocials] = useState([])
    const [professionals, setProfessionals] = useState([])
    const {state, dispatch} = useUser()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserInfo(state.idUser);
                setData(response);
                setCenter(response.centerName)
                setSpecialize(response.teachingMajor)
            } catch (error) {
                console.error("Error fetching user info: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [state.idUser]);

    if (loading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }
    return(
        <View style={styles.PI}>
            <ScrollView>
                <Text style={styles.title}>Your information</Text>
                {data &&
                    <PersionalInfor navigation={navigation} info={data}/>
                }
                <Text style={styles.title}>More information</Text>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.body}>
                        <TextInputLabel label={"Affiliated Center"} value={center}/>
                        <TextInputLabel label={"Teaching Specialization"} value={specialize}/>
                        <TextInputLabel label={"Description"} value={description}/>
                        <SocialLink value={socials} setValue={setSocials}/>
                        <Professional label={"Professional Qualifications"} value={professionals} setProfessions={setProfessionals}/>
                    </View>
                    <ButtonGreen title={"Save Change"}/>
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