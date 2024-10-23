import { ActivityIndicator, Alert, Image, Modal, ScrollView, StyleSheet, Text, View } from "react-native"
import { TextInputLabel } from "./TextInputField"
import { useEffect, useState } from "react"
import { DateTimePickerComponent } from "./DateTimePicker"
import { ComboBox } from "./ComboBox"
import { ButtonGreen, ButtonWhite } from "./Button"
import Img from "../../assets/images/BoyIT.png"
import Feather from '@expo/vector-icons/Feather';
import { COLORS, commonStyles } from "../utils/constants"
import { TouchableOpacity } from "react-native"
import { SET_INFO, useUser } from "../contexts/UserContext"
import { changeAvatar, getUserInfo, updateUserBasicPI } from "../services/user"
import * as DocumentPicker from 'expo-document-picker';

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
export const PersionalInfor = ({info = init})=>{
    const {state, dispatch} = useUser()
    const [avata, setAvata] = useState({
        uri: info.avatar,
        name: 'avatar.png',
        type: 'image/png' 
    })
    const [name, setName] = useState(info.fullName)
    const [phoneNumber, setPhoneNumber] = useState(info.phoneNumber)
    const [email, setEmail] = useState(info.email)
    const [birthday, setBirthday] = useState(info.dob)
    const [gender, setGender] = useState(info.gender)
    const [nationality, setNationality] = useState(info.nationality)
    const [isLoading, setIsLoading] = useState(false)
    const [isChangeAva, setIsChangeAva] = useState(false)
    useEffect(()=>{
        setAvata({
            uri: info.avatar,
            name: 'avatar.png',
            type: 'image/png' 
        })
        setName(info.fullName),
        setPhoneNumber(info.phoneNumber)
        setBirthday(info.dob)
        setGender(info.gender)
        setNationality(info.nationality)
    }, [info])

    const handleUpdateBasicPI = async()=>{
        try{
            setIsLoading(true)
            const response = await updateUserBasicPI(state.idUser, name, phoneNumber, gender, birthday, nationality)
            if(response.error){
                Alert.alert("Warning", response.data)
            } else{
                Alert.alert("Notification", response)
                dispatch({ type: SET_INFO, payload: { "fullname": name }})
            }
            if(isChangeAva){
                const responseAva = await changeAvatar(state.idUser, avata)
                if(responseAva.error){
                    Alert.alert("Warning", responseAva.data)
                } else{
                    Alert.alert("Notification", responseAva)
                    const info = await getUserInfo(state.idUser)
                    dispatch({ type: SET_INFO, payload: { "avatar": info.avatar }})
                }
            }
        } catch(e){
            console.log("Error handleUpdateBasicPI", e);
        } finally{
            setIsLoading(false)
        }
    }
    const pickFile = async()=>{
        setIsChangeAva(true)
        try{
            let result = await DocumentPicker.getDocumentAsync({
                type: ['image/*'],
                copyToCacheDirectory: true,
            })
            if(result){
                setAvata({
                    uri: result.assets[0].uri,
                    name: 'avatar.png',
                    type: result.assets[0].mimeType 
                })
            }
        }
        catch(error){
            console.log("==>Error picking file: ", error);
        }
    }
    return(
        <>
            <View style={styles.PI}>
                <Text style={commonStyles.title}>Personal Infomation</Text>
                <View style={styles.avataWrapper}>
                    <View style={styles.avataInner}>
                        <Image style={styles.avataImage} source={{uri: avata.uri}}/>
                        <TouchableOpacity style={styles.avataCamera} onPress={pickFile}>
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
                    <ButtonWhite title={"Discard Changes"}/>
                    <ButtonGreen title={"Save Changes"} action={handleUpdateBasicPI}/>
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
        </>
    )
}

const styles = StyleSheet.create({
    PI: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        padding: 16,
        rowGap: 30,
        borderRadius: 8
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