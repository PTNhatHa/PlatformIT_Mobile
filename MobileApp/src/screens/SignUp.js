import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import GirlIT from "../../assets/images/GirlIT.png";
import { ButtonBlu } from "../components/Button";
import { TextInputIcon, TextInputLabel } from "../components/TextInputField";
import { COLORS } from "../utils/constants";
import CheckBox from "react-native-check-box";
import { useState } from "react";
import { signupApi } from "../services/authentication";
import Feather from '@expo/vector-icons/Feather';

export default SignUp = ({navigation}) => {
    const [check, setCheck] = useState(false)
    const [name, setName] = useState("")
    const [errorName, setErrorName] = useState(null)
    const [email, setEmail] = useState("")
    const [errorEmail, setErrorEmail] = useState(null)
    const [username, setUsername] = useState("")
    const [errorUsername, setErrorUsername] = useState(null)
    const [password, setPassword] = useState("")
    const [errorPassword, setErrorPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState(null)
    const [tin, setTin] = useState("")
    const [errorTin, setErrorTin] = useState(null)
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    }
    const handleOnchangeName = (v)=>{
        setName(v)
        setErrorName(null)
        if(!v) setErrorName("Require!")
    }
    const handleOnchangeEmail = (v)=>{
        setEmail(v)
        setErrorEmail(null)
        if(!v) setErrorEmail("Require!")
        if(!validateEmail(v)) setErrorEmail("Invalid!")
    }
    const handleOnchangeUsername = (v)=>{
        setUsername(v)
        setErrorUsername(null)
        if(!v) setErrorUsername("Require!")
    }
    const handleOnchangePassword = (v)=>{
        setPassword(v)
        setErrorPassword(null)
        if(!v) setErrorPassword("Require!")
    }
    const handleOnchangeTin = (v)=>{
        setTin(v)
        setErrorTin(null)
        if(!v) setErrorTin("Require!")
    }
    const handleCofirm = (v)=>{
        setConfirmPassword(v)
        if(password === v){
            setErrorConfirm(null)
        } else {
            setErrorConfirm("Not match with password")
        }
    }
    const handleSignup = async ()=>{
        let checkNull = true
        if(!name){
            setErrorName("Require!")
            checkNull = false
        }
        if(!email){
            setErrorEmail("Require!")
            checkNull = false
        }
        if(!username){
            setErrorUsername("Require!")
            checkNull = false
        }
        if(!password){
            setErrorPassword("Require!")
            checkNull = false
        }
        if(!confirmPassword){
            setErrorConfirm("Require!")
            checkNull = false
        }
        if(check){
            if(!tin){
                setErrorTin("Require!")
                checkNull = false
            }
        }
        if(checkNull)
        {
            try{
                const response = await signupApi(name, email, username, password, tin)
                if(response.error){
                    setErrorConfirm(response.data)
                }
                if(response.success){
                    Alert.alert("Sign up", response.data)
                    setErrorConfirm(null)
                    navigation.navigate("Sign in")
                }
            }
            catch (error){
                console.log("==>Error:  ", error);
            }
        }
    }

    return(
        <View style={{ flex: 1}}>
            <LinearGradient
                    // Định nghĩa màu gradient
                    colors={['#003B57', '#409E8E']}
                    locations={[0,0.5]}
                    style={styles.background}
                />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Top */}
                <View style={styles.topSignUp}>
                    <Image source={GirlIT}/>
                    <View style={{ rowGap: 5, alignItems: "flex-start" }}>
                        <View>
                            <Text style={styles.topTextBig}>Learn IT</Text>
                            <Text style={styles.topTextBig}>Easily and Effectively!</Text>
                        </View>
                        <Text style={styles.topTextSmall}>Don’t have an account yet?</Text>
                        <ButtonBlu
                            title={"Sign In"}
                            action={()=>{navigation.navigate("Sign in")}}
                        />
                    </View>
                </View>

                {/* Sign up */}
                <View style={styles.wrapSignUp}>
                    <Text style={{ fontSize: 48, fontWeight: "bold"}}>Sign up</Text>
                    <View style={{width: "100%", rowGap: 6}}>
                        <TextInputIcon
                            value={name}
                            placeholder={"Name"}
                            icon={<Feather name="pen-tool" size={24} color="black" style={{ transform: [{ rotate: '-90deg' }] }}/>}
                            onchangeText={handleOnchangeName}
                            error={errorName}
                        />
                        <TextInputIcon
                            value={email}
                            placeholder={"Mail"}
                            icon={<Feather name="mail" size={24} color="black" />}
                            onchangeText={handleOnchangeEmail}
                            keyboardType={"email-address"}
                            error={errorEmail}
                        />
                        <TextInputIcon
                            value={username}
                            placeholder={"Username"}
                            icon={<Feather name="user" size={24} color="black" />}
                            onchangeText={handleOnchangeUsername}
                            error={errorUsername}
                        />
                        <TextInputIcon
                            value={password}
                            placeholder={"Password"}
                            icon={<Feather name="lock" size={24} color="black" />}
                            onchangeText={handleOnchangePassword}
                            error={errorPassword}
                            isPassword={true}
                        />
                        <TextInputIcon
                            value={confirmPassword}
                            placeholder={"Confirm Password"}
                            icon={<Feather name="unlock" size={24} color="black" />}
                            onchangeText={handleCofirm}
                            error={errorConfirm}
                            isPassword={true}
                        />
                        <CheckBox
                            rightTextStyle ={{ color: check ? COLORS.secondMain : COLORS.lightText}}
                            isChecked={check}
                            onClick={()=>setCheck(!check)}
                            rightText="Register as Admin Center"
                        />
                        {check &&
                            <TextInputIcon
                                value={tin}
                                placeholder={"TIN"}
                                icon={<Feather name="credit-card" size={24} color="black" />}
                                onchangeText={handleOnchangeTin}
                                keyboardType={"numeric"}
                                error={errorTin}
                            />
                        }
                    </View>
                    <ButtonBlu 
                        title={"Sign Up"}
                        fontSize={20}
                        action={()=>handleSignup()}
                    />
                    
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 48,
        rowGap: 32,
        flexGrow: 1
      },
      background: {
        ...StyleSheet.absoluteFillObject,
      },
      topSignUp: {
        flexDirection: "row",
        columnGap: 16,
        alignItems: "center",
      },
      topTextBig: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fafafa"
      },
      topTextSmall: {
        fontSize: 16,
        color: "#fafafa"
      },
      wrapSignUp: {
        backgroundColor: "white",
        minHeight: 550,
        width: "100%",
        borderRadius: 8,
        shadowColor: "#000", // Màu của bóng đổ
        shadowOffset: { width: 10, height: 10 }, // Độ lệch của bóng đổ
        shadowOpacity: 0.25, // Độ mờ của bóng đổ
        shadowRadius: 10, // Bán kính của bóng đổ
        elevation: 10, // Độ cao của bóng đổ (chỉ dành cho Android)
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        rowGap: 12,
        paddingVertical: 30
      },
      textGray:{
        color: COLORS.stroke,
        fontSize: 16
      },
})