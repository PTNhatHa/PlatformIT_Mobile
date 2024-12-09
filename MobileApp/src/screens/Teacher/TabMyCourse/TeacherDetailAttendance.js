import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, View } from "react-native"
import { useEffect, useState } from "react"
import { DateTimePickerComponent } from "../../../components/DateTimePicker"
import { ComboBox } from "../../../components/ComboBox"
import { ButtonGreen, ButtonIconLightGreen, ButtonWhite } from "../../../components/Button"
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from "react-native"
import { TextInputLabel } from "../../../components/TextInputField"
import { COLORS, commonStyles, Gender } from "../../../utils/constants"
import { formatDateTime } from "../../../utils/utils"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ProgressCircle } from "../../../components/Progress"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CardVirticalCourse } from "../../../components/CardVertical"
import { getDetailStudent } from "../../../services/user"
import DefaultAva from "../../../../assets/images/DefaultAva.png"
import { useNavigation } from "@react-navigation/native"

const init = {
    "idUser": null,
    "idRole": null,
    "fullName": "nhatha",
    "avatar": null,
    "email": "nhatha@gmail.com",
    "phoneNumber": "0123459876",
    "gender": 1,
    "dob": "2003-01-22T00:00:00",
    "nationality": "Vietnam",
    "centerName": "HAHYWU CENTER",
    "teachingMajor": "Software Developer",
    "description": null,
    "joinedDate": null,
    "status": null,
    "statusDesc": null,
    "isMainCenterAdmin": null,
    "links": null,
    "qualificationModels": null
}
export const TeacherDetailAttendance = ({route})=>{
    const navigation = useNavigation()
    const {idStudent, idCourse} = route?.params || {}
    const [data, setData] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [indexTab, setIndexTab] = useState(1)

    useEffect(()=>{
        const fetchDetail = async()=>{
            try {
                const response = await getDetailStudent(idStudent, idCourse)
                if(response){
                    setData(response)
                }
            } catch (error) {
                console.log("Error: ", error);
            }
        }
        fetchDetail()
    }, [])
    return(
        <ScrollView
            contentContainerStyle={styles.wrapPI}
        >
            <View style={styles.tabBar}>
                <TouchableOpacity style={[styles.wraptab, {backgroundColor: indexTab === 1 ? COLORS.main30 : COLORS.lightText}]} onPress={()=>setIndexTab(1)}>
                    <FontAwesome5 name="user-alt" size={18} color={COLORS.main} />
                    {indexTab === 1 &&
                        <Text style={styles.tab}>Personal Infomation</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={[styles.wraptab, {backgroundColor: indexTab === 2 ? COLORS.main30 : COLORS.lightText}]} onPress={()=>setIndexTab(2)}>
                    <MaterialCommunityIcons name="progress-check" size={24} color={COLORS.main} />    
                    {indexTab === 2 &&
                        <Text style={styles.tab}>Course Progress</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity style={[styles.wraptab, {backgroundColor: indexTab === 3 ? COLORS.main30 : COLORS.lightText}]} onPress={()=>setIndexTab(3)}>
                    <FontAwesome name="file-text" size={18} color={COLORS.main} />
                    {indexTab === 3 &&
                        <Text style={styles.tab}>All Courses</Text>
                    }
                </TouchableOpacity>
            </View>

            <>
                {indexTab === 1 &&
                    <View style={styles.PI}>
                        <Text style={commonStyles.title}>Personal Infomation</Text>
                        <View style={styles.avataWrapper}>
                            <View style={styles.avataInner}>
                                <Image style={styles.avataImage} source={data.avatarPath ? {uri: data.avatarPath} : DefaultAva}/>
                            </View>
                        </View>
                        <View style={styles.body}>
                            <TextInputLabel label={"Name"} value={data.fullName} isEditable={false}/>
                            <TextInputLabel label={"Phone Number"} value={data.phoneNumber} isEditable={false}/>
                            <TextInputLabel label={"Email"} value={data.email} isEditable={false}/>
                            <TextInputLabel label={"Birthday"} value={formatDateTime(data.dob)} isEditable={false}/>
                            <TextInputLabel label={"Gender"} value={Gender[data.gender] || ""} isEditable={false}/>
                            <TextInputLabel label={"Nationality"} value={data.nationality} isEditable={false}/>
                        </View>
                    </View>
                }
                {indexTab === 2 &&
                    <View style={styles.PI}>
                        <Text style={commonStyles.title}>{data.nameCurrentCourse}</Text>
                        <View style={styles.wrapProgress}>
                            <ProgressCircle done={data.lectureProgress} all={data.lectureTotal}/>
                            <Text style={styles.nameProgress}>Lecture</Text>
                        </View>
                        <View style={styles.wrapProgress}>
                            <ProgressCircle done={data.exerciseProgress + data.testProgress} all={data.exerciseTotal + data.testTotal}/>
                            <Text style={styles.nameProgress}>Assignment</Text>
                        </View>
                    </View>
                }
                {indexTab === 3 &&
                    <View style={styles.wrapList}>
                        <ButtonIconLightGreen 
                            title={"See all"} 
                            icon={<MaterialIcons name="open-in-new" size={16} color={COLORS.main} />}
                            action={()=> navigation.navigate("Courses of student", {initData: data.courses, index: 1, namePage: data.fullName})}
                        />
                        {data.courses.slice(0, 5).map(course =>
                            <CardVirticalCourse data={course} key={course.idCourse}/>
                        )}
                        <Text style={styles.more}>...</Text>
                    </View>
                }
            </>

            
            {isLoading &&
                <Modal
                    visible={isLoading}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.wrapLoading}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                </Modal>
            }  
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    PI: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        padding: 16,
        rowGap: 30,
        borderRadius: 8,
    },
    body: {
        rowGap: 10,
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    avataWrapper: {
        alignItems: "center",
    },
    avataInner: {
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    avataImage: {
        width: 100,
        height: 100,
        borderRadius: 90,
        borderWidth: 1,
        borderColor: COLORS.lightText
    },
    avataCamera: {
        position: "absolute",
        width: 32,
        height: 32,
        borderRadius: 90,
        borderWidth: 1,
        borderColor: COLORS.main,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.lightText
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    wrapPI: {
        padding: 16,
        rowGap: 20,
        backgroundColor: "#FAFAFA",
    },
    tabBar: {
        flexDirection: "row",
        columnGap: 8,
    },
    wraptab: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 8,
        paddingHorizontal: 16,
        alignSelf: "flex-start",
        borderRadius: 8,
        height: 40,
    },
    tab: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.main
    },
    wrapProgress:{
        alignItems: "center",
        marginBottom: 10
    },
    nameProgress:{
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.main
    },
    more: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    },
    wrapList:{
        gap: 10,
        minHeight: 510
    }
})