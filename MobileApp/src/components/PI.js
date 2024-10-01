import { FlatList, ScrollView, SectionList, StyleSheet, View } from "react-native"
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
    const data = [
        { key: "Name", component: <TextInputLabel label={"Name"} value={name} onchangeText={setName}/>},
        { key: "PhoneNumber", component: <TextInputLabel label={"Phone Number"} value={phoneNumber} onchangeText={setPhoneNumber} keyboardType={"phone-pad"}/>},
        { key: "Email", component: <TextInputLabel label={"Email"} value={email} onchangeText={setEmail} keyboardType={"email-address"}/>},
        { key: "Gender", component: <ComboBox label={"Gender"} value={gender} onchangeText={setGender}/>},
        { key: "Birthday", component: <DateTimePickerComponent label='Birthday' value={birthday} setValue={setBirthday}/>},
        { key: "Nationality", component: <ComboBox label={"Nationality"} value={nationality} onchangeText={setNationality} isGender={false}/>},
        
    ]
    return(
        <View style={{ flex: 1}}>
            <FlatList 
                contentContainerStyle={stylesPI.container}
                data={data}
                keyExtractor={(item)=>item.key.toString()}
                renderItem={({item})=> item.component}
                nestedScrollEnabled={true}
            />
        </View>
    )
}

const stylesPI = StyleSheet.create({
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