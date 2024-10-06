import { Alert, StyleSheet, View } from "react-native"
import { TextInputIcon } from "../components/TextInputField"
import { useState } from "react"
import Feather from '@expo/vector-icons/Feather';
import { ButtonGreen, ButtonWhite } from "../components/Button";
import { changePassword } from "../services/user";
import { useUser } from "../contexts/UserContext";

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
        setConfirmPass(v)
        if(newPass === v){
            setErrorConfirm(null)
        } else {
            setErrorConfirm("Not match with password")
        }
    }
    const handleChangePassword = ()=>{
        if(!newPass || !confirmPass){
            setErrorConfirm("Fill all!")
        }else
        if(!errorConfirm)
        {
            const saveChange = async()=>{
                try{
                    const response = await changePassword(oldPass, newPass, state.idUser)
                    if(response.error){
                        setErrorConfirm(response.data)
                    }else if(response.success){
                        Alert.alert("Change Password", response.data)
                        navigation.goBack()
                    }
                } catch(e){
                    console.log("==>Error: ", e);
                }
            }
            saveChange()
        }
    }
    return(
        <View style={styles.container}>
            <TextInputIcon 
                value={oldPass} 
                placeholder={"Your old password"}
                icon={<Feather name="lock" size={24} color="black" />}
                onchangeText={handleOnChangeOldPass}
                isPassword={true}
            />
            <TextInputIcon 
                value={newPass} 
                placeholder={"Your new password"}
                icon={<Feather name="lock" size={24} color="black" />}
                onchangeText={setNewPass}
                isPassword={true}
            />
            <TextInputIcon 
                value={confirmPass} 
                placeholder={"Confirm your new password"}
                icon={<Feather name="unlock" size={24} color="black" />}
                onchangeText={handleCofirm}
                isPassword={true}
                error={errorConfirm}
            />
            <View style={styles.btn}>
                <ButtonWhite title={"Cancel"} action={() => navigation.goBack()}/>
                <ButtonGreen title={"Save change"} action={handleChangePassword}/>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        rowGap: 16,
        padding: 16,
        backgroundColor: "white",
        flex: 1
    },
    btn: {
        columnGap: 16,
        flexDirection: "row"
    }
})