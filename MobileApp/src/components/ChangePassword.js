import { Alert, StyleSheet, Text, View } from "react-native"
import { TextInputIcon, TextInputLabel } from "./TextInputField"
import { useState } from "react"
import Feather from '@expo/vector-icons/Feather';
import { ButtonGreen, ButtonWhite } from "./Button";
import { changePassword } from "../services/user";
import { useUser } from "../contexts/UserContext";
import { commonStyles } from "../utils/constants";

export const ChangePassword = ({navigation})=>{
    const {state, dispatch} = useUser()
    const [oldPass, setOldPass] = useState(null)
    const [newPass, setNewPass] = useState(null)
    const [confirmPass, setConfirmPass] = useState(null)
    const [errorConfirm, setErrorConfirm] = useState(null)
    const handleOnChangeOldPass = (v)=>{
        setOldPass(v)
        setErrorConfirm("")
    }
    const handleCofirm = (v)=>{
        console.log(newPass === v);
        setConfirmPass(v)
        if(newPass === v){
            setErrorConfirm(null)
        } else {
            setErrorConfirm("Not match with password")
        }
        console.log(errorConfirm);
    }
    const handleChangePassword = ()=>{
        if(!newPass || !confirmPass){
            setErrorConfirm("Fill all!")
        }else
        if(!errorConfirm)
        {
            console.log("==>zooo");
            const saveChange = async()=>{
                try{
                    const response = await changePassword(oldPass, newPass, state.idUser)
                    if(response.error){
                        setErrorConfirm(response.data)
                    }else if(response.success){
                        Alert.alert("Change Password", response.data)
                        handleDiscard()
                    }
                } catch(e){
                    console.log("==>Error: ", e);
                }
            }
            saveChange()
        }
    }
    const handleDiscard = ()=>{
        setOldPass(null)
        setNewPass(null)
        setConfirmPass(null)
    }
    return(
        <View style={styles.container}>
            <Text style={commonStyles.title}>Change Password</Text>
            <TextInputLabel 
                label={"Old password"} 
                value={oldPass} 
                placeholder={"Your old password"}
                onchangeText={handleOnChangeOldPass}
                isPassword={true}
            />
            <TextInputLabel 
                label={"New password"} 
                value={newPass} 
                placeholder={"Your new password"}
                onchangeText={setNewPass}
                isPassword={true}
            />
            <TextInputLabel 
                label={"Confirm new password"} 
                value={confirmPass} 
                placeholder={"Confirm your new password"}
                onchangeText={handleCofirm}
                isPassword={true}
                error={errorConfirm}
            />
            <View style={styles.btn}>
                <ButtonWhite title={"Discard Changes"} action={handleDiscard}/>
                <ButtonGreen title={"Save change"} action={handleChangePassword}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        ...commonStyles.shadow,
        rowGap: 16,
        padding: 16,
        backgroundColor: "white",
        flex: 1,
        borderRadius: 8
    },
    btn: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})