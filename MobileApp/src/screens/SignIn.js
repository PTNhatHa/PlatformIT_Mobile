import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import BoyIT from "../../assets/images/BoyIT.png";
import AccountIcon from "../../assets/icons/Account.png";
import LockIcon from "../../assets/icons/Lock.png";
import Facebook from "../../assets/icons/Facebook.png";
import Google from "../../assets/icons/Google.png";
import Github from "../../assets/icons/Github.png";
import { ButtonBlu } from "../components/Button";
import { TextInputIcon} from "../components/TextInputField";
import { COLORS } from "../constants";
import { useEffect, useState } from "react";
import { signinApi } from "../services/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SET_INFO, useUser } from "../contexts/UserContext";

const { width, height } = Dimensions.get('window');

export default SignIn = ({navigation}) => {
    const {state, dispatch} = useUser()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    useEffect(()=>{
        const loadUserData = async()=>{
            const idUser = await AsyncStorage.getItem('idUser')
            if(idUser){
                const oldUser = await AsyncStorage.getItem('username')
                const oldPass = await AsyncStorage.getItem('password')
                setUsername(oldUser)
                setPassword(oldPass)
            }
        }
        loadUserData()
    }, [])
    const handleSignin = async ()=>{
        try{
            const response = await signinApi(username, password)
            if(response.error){
                setError(response.data)
            } else{
                Alert.alert("Sign in", "Sign in successfully")
                const idUser = response.idUser
                await AsyncStorage.setItem('idUser', idUser)
                await AsyncStorage.setItem('username', username)
                await AsyncStorage.setItem('password', password)
                if(response.idRole === 3){
                    // Student
                    const user = { name: "NhatHa", email: "Nhatha@gmail.com", idRole: 3, avaImg: BoyIT}
                    dispatch({ type: SET_INFO, payload: { idUser,user} })
                    navigation.navigate("Student")
                }
                if(response.idRole === 4){
                    // Teacher
                    const user = { name: "NhatHa", email: "Nhatha@gmail.com", idRole: 4, avaImg: BoyIT}
                    dispatch({ type: SET_INFO, payload: { idUser,user} })
                    navigation.navigate("Teacher")
                }
                setError("")
            }
        }
        catch (error){
            setError("Can't call API")
        }
    }
    return(
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
                        icon={AccountIcon}
                        onchangeText={setUsername}
                    />
                    <TextInputIcon
                        value={password}
                        placeholder={"Password"}
                        icon={LockIcon}
                        onchangeText={setPassword}
                        error={error}
                        isPassword={true}
                    />
                    <TouchableOpacity>
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
                        <Image source={Facebook}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.party3}>
                        <Image source={Google}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.party3}>
                        <Image source={Github}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        padding: 6
      }
})