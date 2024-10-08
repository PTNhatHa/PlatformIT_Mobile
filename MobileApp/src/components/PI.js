import { Image, ScrollView, StyleSheet, View } from "react-native"
import { TextInputLabel } from "./TextInputField"
import { useState } from "react"
import { DateTimePickerComponent } from "./DateTimePicker"
import { ComboBox } from "./ComboBox"
import { ButtonGreen, ButtonWhite } from "./Button"
import Img from "../../assets/images/BoyIT.png"
import Feather from '@expo/vector-icons/Feather';
import { COLORS } from "../constants"
import { TouchableOpacity } from "react-native"

export const PersionalInfor = ({
    initAvata=Img,
    initName="Nhật Hạ", 
    initPhoneNumber="0123456789", 
    initEmail="nhatha@gmail.com", 
    initBirthday=new Date(), 
    initGender="Female", 
    initNationality="Hungary"
})=>{
    const [name, setName] = useState(initName)
    const [phoneNumber, setPhoneNumber] = useState(initPhoneNumber)
    const [email, setEmail] = useState(initEmail)
    const [birthday, setBirthday] = useState(initBirthday)
    const [gender, setGender] = useState(initGender)
    const [nationality, setNationality] = useState(initNationality)
    return(
        <View style={styles.PI}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.avataWrapper}>
                    <View style={styles.avataInner}>
                        <Image style={styles.avataImage} source={initAvata}/>
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
                    <ButtonWhite title={"Change Password"}/>
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