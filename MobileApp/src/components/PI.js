import { Image, ScrollView, StyleSheet, View } from "react-native"
import { TextInputLabel } from "./TextInputField"
import { useState } from "react"
import { DateTimePickerComponent } from "./DateTimePicker"
import { ComboBox } from "./ComboBox"
import { ButtonGreen, ButtonWhite } from "./Button"
import Img from "../../assets/images/BoyIT.png"
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from "../utils/constants"
import { TouchableOpacity } from "react-native"
import { useUser } from "../contexts/UserContext"

const init = {
    "fullName": "fullName",
    "email": "ex@email.com",
    "phoneNumber": null,
    "gender": null,
    "dob": null,
    "nationality": null,
    "centerName": null,
    "teachingMajor": null,
    "description": null,
    "links": null,
    "qualificationModels": null
}
export const PersionalInfor = ({navigation, info = init})=>{
    const {state, dispatch} = useUser()
    const [name, setName] = useState(info.fullName)
    const [phoneNumber, setPhoneNumber] = useState(info.phoneNumber)
    const [email, setEmail] = useState(info.email)
    const [birthday, setBirthday] = useState(info.dob)
    const [gender, setGender] = useState(info.gender)
    const [nationality, setNationality] = useState(info.nationality)
    return(
        <View style={styles.PI}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.avataWrapper}>
                    <View style={styles.avataInner}>
                        <Image style={styles.avataImage} source={info.link}/>
                        <TouchableOpacity style={styles.avataCamera}>
                            <Feather name="camera" size={20} color={COLORS.main} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.body}>
                    <TextInputLabel label={"Name"} value={name} onchangeText={setName}/>
                    <TextInputLabel label={"Phone Number"} value={phoneNumber} onchangeText={setPhoneNumber} keyboardType={"phone-pad"}/>
                    <TextInputLabel label={"Email"} value={email} onchangeText={setEmail} keyboardType={"email-address"}/>
                    <DateTimePickerComponent label='Birthday' value={birthday} setValue={setBirthday}/>
                    <ComboBox label={"Gender"} value={gender} onchangeText={setGender}/>
                    <ComboBox label={"Nationality"} value={nationality} onchangeText={setNationality} isGender={false}/>
                </View>
                <View style={styles.bottom}>
                    <ButtonWhite title={"Change Password"} action={()=> navigation.navigate("Change password")}/>
                    <ButtonGreen title={"Save Change"}/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    PI: {
        // flex: 1,
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
        backgroundColor: "white"
    },
})