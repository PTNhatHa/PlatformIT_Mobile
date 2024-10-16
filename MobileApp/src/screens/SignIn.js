import { ActivityIndicator, Alert, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import BoyIT from "../../assets/images/BoyIT.png";
import { ButtonBlu } from "../components/Button";
import { TextInputIcon} from "../components/TextInputField";
import { COLORS } from "../utils/constants";
import { useEffect, useState } from "react";
import { signinApi } from "../services/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SET_INFO, useUser } from "../contexts/UserContext";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { validateEmail } from "../utils/utils";
import { forgotPassword, getUserInfo } from "../services/user";
const { width, height } = Dimensions.get('window');

export default SignIn = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const {state, dispatch} = useUser()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [isForgot, setIsForgot] = useState(false)
    const [email, setEmail] = useState("")
    const [errorEmail, setErrorEmail] = useState(null)
    const [isDone, setIsDone] = useState(false)
    const handleOnchangeEmail = (v)=>{
        setEmail(v)
        setErrorEmail(null)
        if(!v) setErrorEmail("Require!")
        if(!validateEmail(v)) setErrorEmail("Invalid!")
    }
    const handleSendEmail= async()=>{
        if(email){
            setIsDone(false)
            try{
                setLoading(true)
                const response = await forgotPassword(email)
                if(response.error){
                    setErrorEmail(response.data)
                } else{
                    setIsDone(true)
                }
            }
            catch(error){
                console.error("Error fetching user info: ", error);
            } finally {
                setLoading(false);
            }
        }
        else {
            setIsDone(false)
            setErrorEmail("Require")
        }
    }

    useEffect(()=>{
        const loadUserData = async()=>{
            const oldUser = await AsyncStorage.getItem('username')
            const oldPass = await AsyncStorage.getItem('password')
            setUsername(oldUser)
            setPassword(oldPass)
        }
        loadUserData()
    }, [])
    const handleSignin = async ()=>{
        try{
            setLoading(true);
            const response = await signinApi(username, password)
            setLoading(false);
            if(response.error){
                setError(response.data)
            } else{
                await AsyncStorage.setItem('username', username)
                await AsyncStorage.setItem('password', password)
                const info = await getUserInfo(response.idUser)
                let userInfo = response
                if(info.avatar){
                    userInfo = {
                        ...response,
                        "avatar": info.avatar
                    }
                }
                dispatch({ type: SET_INFO, payload: userInfo })
                // console.log(response);
                if(response.idRole == 3){
                    Alert.alert("Sign in", "Sign in successfully")
                    navigation.navigate("Student")
                } else if(response.idRole == 4){
                    Alert.alert("Sign in", "Sign in successfully")
                    navigation.navigate("Teacher")
                } else{
                    Alert.alert("Notification", "We do not support 'Admin Platform' and 'Admin Center' accounts here. Please log in on your computer to continue")
                }
                setError("")
            }
        }
        catch (error){
            setError("Can't call API")
        } finally {
            setLoading(false);
        }
    }

    return(
        <>
            <View style={styles.container}>
                <LinearGradient
                    // Định nghĩa màu gradient
                    colors={['#003B57', '#409E8E']}
                    locations={[0,0.5]}
                    style={styles.background}
                />
                {/* Top */}
                <View style={styles.topSignIn}>
                    <Image source={BoyIT}/>
                    <View style={{ rowGap: 5, alignItems: "flex-start" }}>
                        <View>
                            <Text style={styles.topTextBig}>Learn IT</Text>
                            <Text style={styles.topTextBig}>Easily and Effectively!</Text>
                        </View>
                        <Text style={styles.topTextSmall}>Don’t have an account yet?</Text>
                        <ButtonBlu
                            title={"Sign Up"}
                            action={()=>{navigation.navigate("Sign up")}}
                        />
                    </View>
                </View>

                {/* Sign in */}
                <View style={styles.wrapSignIn}>
                    <Text style={{ fontSize: 48, fontWeight: "bold"}}>Sign in</Text>
                    <View style={{width: "100%", rowGap: 6}}>
                        <TextInputIcon
                            value={username}
                            placeholder={"Username"}
                            icon={<Feather name="user" size={24} color="black" />}
                            onchangeText={setUsername}
                        />
                        <TextInputIcon
                            value={password}
                            placeholder={"Password"}
                            icon={<Feather name="lock" size={24} color="black" />}
                            onchangeText={setPassword}
                            error={error}
                            isPassword={true}
                        />
                        <TouchableOpacity onPress={()=>setIsForgot(true)}>
                            <Text style={styles.textGray}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>
                    <ButtonBlu 
                        title={"Sign In"}
                        fontSize={20}
                        action={handleSignin}
                    />
                    <Text style={styles.textGray}>------- Students can sign in with -------</Text>
                    <View style={{columnGap: 12, flexDirection: "row"}}>
                        <TouchableOpacity style={styles.party3}>
                            <FontAwesome name="facebook" size={16} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.party3}>
                            <FontAwesome name="google-plus" size={16} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.party3}>
                            <Feather name="github" size={16} color="black" />   
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Forgot Pass */}
                <Modal
                    visible={isForgot}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={()=>setIsForgot(false)}
                >
                    <View style={styles.selectImgWrapper}>
                        <View style={[styles.wrapSignIn, styles.forgot]}>
                            <TouchableOpacity style={styles.close} onPress={()=>{
                                setIsForgot(false)
                                setEmail(null)
                                setErrorEmail(null)
                                setIsDone(false)
                            }}>
                                <AntDesign name="close" size={30} color={COLORS.secondMain} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 20, fontWeight: "bold"}}>Forgot your password?</Text>
                            <TextInputIcon
                                value={email}
                                placeholder={"Mail"}
                                icon={<Feather name="mail" size={24} color="black" />}
                                onchangeText={handleOnchangeEmail}
                                keyboardType={"email-address"}
                                error={errorEmail}
                            />
                            {isDone &&
                                <Text style={styles.isSend}>Check your mail to receive a new password</Text>
                            }
                            <ButtonBlu title={"Send"} action={handleSendEmail}/>
                        </View>
                    </View>
                </Modal>
            </View>
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }   
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 48,
        rowGap: 32
      },
    background: {
        ...StyleSheet.absoluteFillObject,
      },
    topSignIn: {
        flexDirection: "row",
        columnGap: 16,
        alignItems: "center"
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
    wrapSignIn: {
        backgroundColor: "white",
        height: "75%",
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
      },
    textGray:{
        color: COLORS.stroke,
        fontSize: 16
      },
    party3:{
        borderWidth: 1,
        borderColor: COLORS.stroke,
        borderRadius: 90,
        padding: 6,
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center"
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
    forgot: {
        height: "", 
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