import { Dimensions, Image, StyleSheet, Text, View } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import BoyIT from "../../../assets/images/BoyIT.png";
import { ButtonBlu } from "../components/Button";

const { width, height } = Dimensions.get('window');

export default SignIn = () => {

    return(
        <View style={styles.container}>
            <LinearGradient
                // Định nghĩa màu gradient
                colors={['#003B57', '#409E8E']}
                locations={[0,0.5]}
                style={styles.background}
            />
            <View style={styles.topSignIn}>
                <Image source={BoyIT}/>
                <View style={{ rowGap: 5 }}>
                    <View>
                        <Text style={styles.topTextBig}>Learn IT</Text>
                        <Text style={styles.topTextBig}>Easily and Effectively!</Text>
                    </View>
                    <Text style={styles.topTextSmall}>Don’t have an account yet?</Text>
                    <ButtonBlu
                        title={"Sign Up"}
                    />
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
        paddingVertical: 48
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
})