import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, View } from "react-native"
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
import { updateUserBasicPI } from "../services/user"

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
export const PersionalInfor = ({navigation, info = init})=>{
    const {state, dispatch} = useUser()
    const [name, setName] = useState(info.fullName)
    const [phoneNumber, setPhoneNumber] = useState(info.phoneNumber)
    const [email, setEmail] = useState(info.email)
    const [birthday, setBirthday] = useState(info.dob)
    const [gender, setGender] = useState(info.gender)
    const [nationality, setNationality] = useState(info.nationality)
    const [isLoading, setIsLoading] = useState(false)
    const handleUpdateBasicPI = async()=>{
        try{
            setIsLoading(true)
            const response = await updateUserBasicPI(state.idUser, name, phoneNumber, gender, birthday, nationality)
            if(response.error){
                Alert.alert("Warning", response.data)
            } else{
                Alert.alert("Notification", response)
            }
        } catch(e){
            console.log("Error handleUpdateBasicPI", e);
        } finally{
            setIsLoading(false)
        }
    }
    return(
        <>
            <View style={styles.PI}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.avataWrapper}>
                        <View style={styles.avataInner}>
                            <Image style={styles.avataImage} source={state.avatar}/>
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
                        <ButtonGreen title={"Save Change"} action={handleUpdateBasicPI}/>
                    </View>
                </ScrollView>
            </View>
            {isLoading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }  
        </>
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
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    }
})