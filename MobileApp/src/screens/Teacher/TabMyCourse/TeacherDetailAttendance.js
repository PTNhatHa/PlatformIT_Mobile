import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, View } from "react-native"
import { useState } from "react"
import { DateTimePickerComponent } from "../../../components/DateTimePicker"
import { ComboBox } from "../../../components/ComboBox"
import { ButtonGreen, ButtonWhite } from "../../../components/Button"
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from "react-native"
import { TextInputLabel } from "../../../components/TextInputField"
import { COLORS, commonStyles } from "../../../utils/constants"
import { formatDateTime } from "../../../utils/utils"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ProgressCircle } from "../../../components/Progress"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CardVirticalCourse } from "../../../components/CardVertical"

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
export const TeacherDetailAttendance = ({info = init})=>{
    const [avata, setAvata] = useState({
        uri: info.avatar,
        name: 'avatar.png',
        type: 'image/png' 
    })
    const [name, setName] = useState(info.fullName)
    const [phoneNumber, setPhoneNumber] = useState(info.phoneNumber)
    const [email, setEmail] = useState(info.email)
    const [birthday, setBirthday] = useState(new Date(info.dob))
    const [gender, setGender] = useState(info.gender === 0 ? "Male" : info.gender === 1 ? "Female" :  "Other")
    const [nationality, setNationality] = useState(info.nationality)
    const [isLoading, setIsLoading] = useState(false)
    const [indexTab, setIndexTab] = useState(1)

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
                                <Image style={styles.avataImage} source={{uri: avata.uri}}/>
                            </View>
                        </View>
                        <View style={styles.body}>
                            <TextInputLabel label={"Name"} value={name} isEditable={false}/>
                            <TextInputLabel label={"Phone Number"} value={phoneNumber} isEditable={false}/>
                            <TextInputLabel label={"Email"} value={email} isEditable={false}/>
                            <TextInputLabel label={"Birthday"} value={formatDateTime(birthday)} isEditable={false}/>
                            <TextInputLabel label={"Gender"} value={gender} isEditable={false}/>
                            <TextInputLabel label={"Nationality"} value={nationality} isEditable={false}/>
                        </View>
                    </View>
                }
                {indexTab === 2 &&
                    <View style={styles.PI}>
                        <Text style={commonStyles.title}>Name Course</Text>
                        <View style={styles.wrapProgress}>
                            <ProgressCircle/>
                            <Text style={styles.nameProgress}>Lecture</Text>
                        </View>
                        <View style={styles.wrapProgress}>
                            <ProgressCircle/>
                            <Text style={styles.nameProgress}>Assignment</Text>
                        </View>
                    </View>
                }
                {indexTab === 3 &&
                    <>
                        <CardVirticalCourse/>
                        <CardVirticalCourse/>
                        <CardVirticalCourse/>
                    </>
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
    }
})