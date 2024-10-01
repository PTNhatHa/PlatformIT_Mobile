import { ScrollView, StyleSheet, View } from "react-native"
import { TextInputLabel } from "./TextInputField"
import { useState } from "react"
import { DateTimePickerComponent } from "./DateTimePicker"
import { ComboBox } from "./ComboBox"

export const PersionalInfor = ()=>{
    const [name, setName] = useState("Nhật Hạ")
    const [phoneNumber, setPhoneNumber] = useState("0123456789")
    const [email, setEmail] = useState("nhatha@gmail.com")
    const [birthday, setBirthday] = useState(new Date())
    const [gender, setGender] = useState("Female")
    const [nationality, setNationality] = useState("Hungary")
    return(
        <View style={{ flex: 1}}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.body}>
                    <TextInputLabel label={"Name"} value={name} onchangeText={setName}/>
                    <TextInputLabel label={"Phone Number"} value={phoneNumber} onchangeText={setPhoneNumber} keyboardType={"phone-pad"}/>
                    <TextInputLabel label={"Email"} value={email} onchangeText={setEmail} keyboardType={"email-address"}/>
                    <ComboBox label={"Gender"} value={gender} onchangeText={setGender}/>
                    <DateTimePickerComponent label='Birthday' value={birthday} setValue={setBirthday}/>
                    <ComboBox label={"Nationality"} value={nationality} onchangeText={setNationality} isGender={false}/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        width: "100%",
        flexDirection: "column",
        rowGap: 16,
    },
    body: {
        rowGap: 10,
    }
})