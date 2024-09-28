import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import BoyIT from "../../assets/images/BoyIT.png";
import AccountIcon from "../../assets/icons/Account.png";
import LockIcon from "../../assets/icons/Lock.png";
import Facebook from "../../assets/icons/Facebook.png";
import Google from "../../assets/icons/Google.png";
import Github from "../../assets/icons/Github.png";
import { ButtonBlu } from "../components/Button";
import { TextInputIcon, TextInputLabel } from "../components/TextInputField";
import { COLORS } from "../constants";

const { width, height } = Dimensions.get('window');

export default SignIn = ({navigation}) => {
    
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
                        // value={"User"}
                        placeholder={"Username"}
                        icon={AccountIcon}
                        // error={"Error"}
                    />
                    <TextInputIcon
                        // value={"User"}
                        placeholder={"Password"}
                        icon={LockIcon}
                        // error={"Error"}
                    />
                    <TouchableOpacity>
                        <Text style={styles.textGray}>Forgot your password?</Text>
                    </TouchableOpacity>
                </View>
                <ButtonBlu 
                    title={"Sign In"}
                    fontSize={20}
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