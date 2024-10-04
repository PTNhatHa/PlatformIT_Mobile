import { Image, StyleSheet, Text, View } from "react-native"
import { TouchableOpacity } from "react-native";
import { useUser } from "../../../contexts/UserContext";
import { COLORS } from "../../../utils/constants";

export const TeacherAccount = ({navigation})=>{
    const {state, dispatch} = useUser()
    return(
        <View style={styles.container}>
            <View style={styles.top}>
                <Image source={state.user.avaImg} style={styles.avataImage}/>
                <Text style={styles.text}>{state.user.name}</Text>
            </View>
            <View>
                <TouchableOpacity style={styles.nav} onPress={() => navigation.navigate("Your infomation")}>
                    <Text style={styles.text}>View Profile</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.btn_green} onPress={() => navigation.navigate("Sign in")}>
                    <Text style={styles.btnText}>Sign out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        width: "100%",
        flexDirection: "column",
        rowGap: 16,
        backgroundColor: "white",
        flex: 1
    },
    top:{
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10
    },
    avataImage: {
        width: 60,
        height: 60,
        borderRadius: 90,
        borderWidth: 1,
        borderColor: COLORS.lightText
    },
    text:{
        fontSize: 16,
        fontWeight: "bold"
    },
    nav: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText
    },
    btn_green: {
        backgroundColor: COLORS.main,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.main,
        alignItems: "center"
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
    },
    bottom: {
        flex: 1,
        justifyContent: "flex-end"
    }
})