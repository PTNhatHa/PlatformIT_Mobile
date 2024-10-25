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

    return(
        <ScrollView>
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
        margin: 16
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
    }
})