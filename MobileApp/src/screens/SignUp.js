import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import GirlIT from "../../assets/images/GirlIT.png";
import PenIcon from "../../assets/icons/Pen.png";
import MailIcon from "../../assets/icons/Mail.png";
import AccountIcon from "../../assets/icons/Account.png";
import LockIcon from "../../assets/icons/Lock.png";
import UnlockIcon from "../../assets/icons/Unlock.png";
import TinIcon from "../../assets/icons/Tin.png";

import { ButtonBlu } from "../components/Button";
import { TextInputIcon, TextInputLabel } from "../components/TextInputField";
import { COLORS } from "../constants";
import CheckBox from "react-native-check-box";
import { useState } from "react";

const { width, height } = Dimensions.get('window');

export default SignUp = () => {
    const [check, setCheck] = useState(false)
    const handleOnChecked = ()=>{
        setCheck(!check)
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
                <View style={styles.topSignIn}>
                    <Image source={GirlIT}/>
                    <View style={{ rowGap: 5, alignItems: "flex-start" }}>
                        <View>
                            <Text style={styles.topTextBig}>Learn IT</Text>
                            <Text style={styles.topTextBig}>Easily and Effectively!</Text>
                        </View>
                        <Text style={styles.topTextSmall}>Don’t have an account yet?</Text>
                        <ButtonBlu
                            title={"Sign In"}
                        />
                    </View>
                </View>

                {/* Sign up */}
                <View style={styles.wrapSignUp}>
                    <Text style={{ fontSize: 48, fontWeight: "bold"}}>Sign up</Text>
                    <View style={{width: "100%", rowGap: 6}}>
                        <TextInputIcon
                            // value={"User"}
                            placeholder={"Username"}
                            icon={PenIcon}
                            // error={"Error"}
                        />
                        <TextInputIcon
                            // value={"User"}
                            placeholder={"Name"}
                            icon={MailIcon}
                            // error={"Error"}
                        />
                        <TextInputIcon
                            // value={"User"}
                            placeholder={"Mail"}
                            icon={AccountIcon}
                            // error={"Error"}
                        />
                        <TextInputIcon
                            // value={"User"}
                            placeholder={"Password"}
                            icon={LockIcon}
                            // error={"Error"}
                        />
                        <TextInputIcon
                            // value={"User"}
                            placeholder={"Confirm Password"}
                            icon={UnlockIcon}
                            // error={"Error"}
                        />
                        <CheckBox
                            rightTextStyle ={{ color: check ? COLORS.secondMain : COLORS.lightText}}
                            isChecked={check}
                            onClick={()=>handleOnChecked()}
                            rightText="Register as Admin Center"
                        />
                        {check &&
                            <TextInputIcon
                                // value={"User"}
                                placeholder={"TIN"}
                                icon={TinIcon}
                                // error={"Error"}
                            />
                        }
                    </View>
                    <ButtonBlu 
                        title={"Sign Up"}
                        fontSize={20}
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
      topSignIn: {
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
      party3:{
        borderWidth: 1,
        borderColor: COLORS.stroke,
        borderRadius: 90,
        padding: 6
      }
})