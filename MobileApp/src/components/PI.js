import { StyleSheet, View } from "react-native"
import { TextInputLabel } from "./TextInputField"
import { useState } from "react"
import { DateTimePickerComponent } from "./DateTimePicker"

export const PersionalInfor = ()=>{
    const [name, setName] = useState("Nhật Hạ")
    const [phoneNumber, setPhoneNumber] = useState("0123456789")
    const [email, setEmail] = useState("nhatha@gmail.com")
    return(
        <View style={styles.container}>
            <View>

            </View>
            <View style={styles.body}>
                <TextInputLabel label={"Name"} value={name} onchangeText={setName}/>
                <TextInputLabel label={"Phone Number"} value={phoneNumber} onchangeText={setPhoneNumber} keyboardType={"phone-pad"}/>
                <TextInputLabel label={"Email"} value={email} onchangeText={setEmail} keyboardType={"email-address"}/>
                <DateTimePickerComponent label='Birthday'/>
            </View>
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