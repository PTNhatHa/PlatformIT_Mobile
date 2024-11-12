import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import DefaultAva from "../../assets/images/DefaultAva.png"
import { COLORS } from "../utils/constants"
import { ButtonGreen, ButtonWhite } from "./Button"
import { TouchableOpacity } from "react-native"
import { useState } from "react"
import { useUser } from "../contexts/UserContext"

export const Comments = ()=>{
    const {state, dispatch} = useUser()
    const [cmt, setCmt] = useState(null)
    return(
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.wrapInputCmt}>
                    <View style={styles.wrapCmt}>
                        <Image source={state.avatar ? {uri: state.avatar} : DefaultAva} style={styles.avata}/>
                        <TextInput 
                            style={[styles.textInput, cmt && {borderColor: COLORS.main}]}
                            placeholder="Comment"
                            value={cmt}
                            onChangeText={(v)=>setCmt(v)}
                        />
                    </View>
                    {cmt &&
                        <View style={styles.wrapBtn}>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.textGray14}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]}>
                                <Text style={styles.textWhite14}>Comment</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                <View style={styles.wrapCmt}>
                    <Image source={DefaultAva} style={styles.avata}/>
                   <View>
                        <View style={styles.wrapNameTime}>
                            <Text style={styles.textBlack14}>Name</Text>
                            <Text style={styles.textGray12}>13 hr.ago</Text>
                        </View>
                        <Text style={styles.textGray14}>Comment...</Text>
                   </View>
                </View>
                <View style={styles.wrapCmt}>
                    <Image source={DefaultAva} style={styles.avata}/>
                   <View>
                        <View style={styles.wrapNameTime}>
                            <Text style={styles.textBlack14}>Name</Text>
                            <Text style={styles.textGray12}>13 hr.ago</Text>
                        </View>
                        <Text style={styles.textGray14}>Comment...</Text>
                   </View>
                </View>
            </ScrollView>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    avata: {
        width: 30,
        height: 30,
        borderRadius: 90,
        borderColor: COLORS.lightText
    },
    wrapCmt: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8
    },
    textInput: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        width: "100%"
    },
    wrapNameTime: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center"
    },
    textBlack14: {
        fontSize: 14,
        fontWeight: "bold"
    },
    textGray12: {
        fontSize: 12,
        color: COLORS.stroke
    },
    textGray14: {
        fontSize: 14,
        color: COLORS.stroke
    },
    btn:{
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: "flex-start"
    },
    textWhite14:{
        fontSize: 14,
        color: "white",
    },
    wrapBtn:{
        flexDirection: "row",
        alignSelf: "flex-end"
    },
    wrapInputCmt:{
        gap: 4
    }
})