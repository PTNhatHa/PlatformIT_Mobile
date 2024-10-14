import { ActivityIndicator, Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import GirlIT from "../../assets/images/GirlIT.png";
import { ButtonBlu, ButtonGreen, ButtonWhite } from "../components/Button";
import { TextInputIcon, TextInputLabel } from "../components/TextInputField";
import { COLORS } from "../utils/constants";
import CheckBox from "react-native-check-box";
import { useState } from "react";
import { checkEmail, sendOTP, signupApi, verifyOTP } from "../services/authentication";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { validateEmail } from "../utils/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default SignUp = ({navigation}) => {
    const [loading, setLoading] = useState(false);

    const [check, setCheck] = useState(false)
    const [name, setName] = useState("StudentNhatha")
    const [errorName, setErrorName] = useState(null)
    const [email, setEmail] = useState("vivo@snapmail.cc")
    const [errorEmail, setErrorEmail] = useState(null)
    const [username, setUsername] = useState("StudentNhatha")
    const [errorUsername, setErrorUsername] = useState(null)
    const [password, setPassword] = useState("StudentNhatha")
    const [errorPassword, setErrorPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState("StudentNhatha")
    const [errorConfirm, setErrorConfirm] = useState(null)
    const [tin, setTin] = useState("")
    const [errorTin, setErrorTin] = useState(null)
    const [centerName, setCenterName] = useState("")
    const [errorCenterName, setErrorCenterName] = useState(null)

    const [isVerify, setIsVerify] = useState(false)
    const [otp, setOtp] = useState(null)
    const [errorOTP, setErrorOTP] = useState(null)

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
    const handleOnchangeCenterName = (v)=>{
        setCenterName(v)
        setErrorCenterName(null)
        if(!v) setErrorCenterName("Require!")
    }
    const handleCofirm = (v)=>{
        setConfirmPassword(v)
        if(password === v){
            setErrorConfirm(null)
        } else {
            setErrorConfirm("Not match with password")
        }
    }
    const handleOnPressSignup = async()=>{
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
                const response = await checkEmail(email)
                if(response.error){
                    setErrorEmail(response.data)
                }else
                if(response){
                    await handleSendOTP()
                }
            }
            catch (error){
                console.log("==>Error:  ", error);
            }
        }
    }
    const handleSendOTP = async ()=>{
        try{
            setLoading(true)
            const response = await sendOTP(email)
            if(response.error){
                setErrorEmail(response.data)
            }else
            if(response){
                setOtp(null)
                setErrorConfirm(null)
                setIsVerify(true)
            }
        }
        catch (error){
            console.log("==>Error send OTP:  ", error);
        }
        finally{
            setLoading(false)
        }
    }
    const handleVerifyOTP = async ()=>{
        setLoading(true)
        try{
            const response = await verifyOTP(email, otp)
            if(response.error){
                setErrorOTP(response.data)
            }else
            if(response){
                await handleSignup()
            }
        }
        catch (error){
            console.log("==>Error verifyOTP:  ", error);
        }
        finally{
            setLoading(false)
        }
    }
    const handleSignup = async ()=>{
        setLoading(true)
        try{
            const response = await signupApi(name, email, username, password, centerName, tin)
            setLoading(false)
            if(response.error){
                setOtp(null)
                setIsVerify(false)
                setErrorConfirm(response.data)
            }else
            if(response){
                console.log(response);
                Alert.alert("Sign up", "Sign up successfully")
                await AsyncStorage.setItem('username', username)
                await AsyncStorage.setItem('password', "")
                setErrorConfirm(null)
                navigation.navigate("Sign in")
            }
        }
        catch (error){
            console.log("==>Error signupApi:  ", error);
        }
    }

    return(
        <>
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
                                <View  style={{rowGap: 6}}>
                                    <TextInputIcon
                                        value={tin}
                                        placeholder={"TIN"}
                                        icon={<Feather name="credit-card" size={24} color="black" />}
                                        onchangeText={handleOnchangeTin}
                                        keyboardType={"numeric"}
                                        error={errorTin}
                                    />
                                    <TextInputIcon
                                        value={centerName}
                                        placeholder={"Center Name"}
                                        icon={<Ionicons name="business-outline" size={24} color="black" />}
                                        onchangeText={handleOnchangeCenterName}
                                        error={errorCenterName}
                                    />
                                </View>
                            }
                        </View>
                        <ButtonBlu 
                            title={"Sign Up"}
                            fontSize={20}
                            action={()=>handleOnPressSignup()}
                        />
                        
                    </View>
                </ScrollView>
                {/* Verify OTP */}
                <Modal
                    visible={isVerify}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={()=>setIsVerify(false)}
                >
                    <View style={styles.selectImgWrapper}>
                        <View style={[styles.wrapSignUp, styles.verify]}>
                            <TouchableOpacity style={styles.close} onPress={()=>setIsVerify(false)}>
                                <AntDesign name="close" size={30} color={COLORS.secondMain} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20, fontWeight: "bold"}}>Verify Your Email</Text>
                            <TextInputIcon
                                value={otp}
                                placeholder={"OTP"}
                                icon={<Feather name="key" size={24} color="black" />}
                                onchangeText={setOtp}
                                keyboardType={"numeric"}
                                error={errorOTP}
                            />
                            <Text style={styles.isSend}>Check your mail to receive an OTP</Text>
                            <View style={{ flexDirection: "row", columnGap: 4}}>
                                <ButtonGreen title={"Verify"} action={handleVerifyOTP}/>
                                <ButtonWhite title={"Send again"} action={handleSendOTP}/>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View> 
            { loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }
        </>
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
      isSend:{
        color: COLORS.secondMain,
        fontSize: 16,
        fontWeight: "bold",
        justifyContent: "center",
        textAlign: "center"
      },
    selectImgWrapper: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16,
        justifyContent: "center",
        alignItems: "center"
    },
    close:{
        alignSelf: "flex-end"
    },
    verify: {
        minHeight: 0, 
        paddingVertical: 16,
        paddingHorizontal: 16,
        paddingBottom: 24
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