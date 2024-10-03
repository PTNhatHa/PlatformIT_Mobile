import { StyleSheet, View } from "react-native"
import { TextInputIcon } from "../components/TextInputField"
import { useState } from "react"
import Feather from '@expo/vector-icons/Feather';
import { ButtonGreen, ButtonWhite } from "../components/Button";

export const ChangePassword = ({navigation})=>{
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")
    return(
        <View style={styles.container}>
            <TextInputIcon 
                value={oldPass} 
                placeholder={"Your old password"}
                icon={<Feather name="lock" size={24} color="black" />}
                onchangeText={setOldPass}
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
                onchangeText={setConfirmPass}
                isPassword={true}
            />
            <View style={styles.btn}>
                <ButtonWhite title={"Cancel"} action={() => navigation.goBack()}/>
                <ButtonGreen title={"Save change"}/>
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