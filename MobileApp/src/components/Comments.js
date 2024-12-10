import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import DefaultAva from "../../assets/images/DefaultAva.png"
import { COLORS } from "../utils/constants"
import { ButtonGreen, ButtonWhite } from "./Button"
import { TouchableOpacity } from "react-native"
import { useState } from "react"
import { useUser } from "../contexts/UserContext"
import AntDesign from '@expo/vector-icons/AntDesign';

const init = [
    {
        idComment: 1,
        idUser: 1,
        nameUser: "Name",
        relativeTime: "12 hr.ago",
        content: "This is my comment^^",
        replyToId: null,
        reply: [

        ]
    }
]

export const Comments = ()=>{
    const {state, dispatch} = useUser()
    const [cmt, setCmt] = useState(null)
    return(
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.wrapInputCmt}>
                    <View style={styles.wrapCmt}>
                        <Image source={DefaultAva} style={styles.avata}/>
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

                {/* Main cmt */}
                <View style={styles.wrapBoxCmt}>
                    <TouchableOpacity style={styles.wrapCmt}>
                        <Image source={DefaultAva} style={styles.avata}/>
                        <View>
                            <View style={styles.wrapNameTime}>
                                <Text style={styles.textBlack14}>Name</Text>
                                <Text style={styles.textGray12}>13 hr.ago</Text>
                            </View>
                            <Text style={styles.textGray14}>Comment...</Text>
                        </View>                   
                    </TouchableOpacity>
                    <View style={styles.wrapInnerCmt}>
                        <TouchableOpacity style={styles.btnViewReply}>
                            {true ? 
                                <AntDesign name="down" size={16} color={COLORS.main} />
                                :
                                <AntDesign name="up" size={16} color={COLORS.main} />
                            }
                            <Text style={styles.textMain14}>3 replies</Text>
                        </TouchableOpacity>
                        {/* Reply cmt */}
                        { true &&
                        <View style={styles.wrapList}>
                            <TouchableOpacity style={styles.wrapCmt}>
                                <Image source={DefaultAva} style={styles.avata}/>
                                <View>
                                    <View style={styles.wrapNameTime}>
                                        <Text style={styles.textBlack14}>Name</Text>
                                        <Text style={styles.textGray12}>13 hr.ago</Text>
                                    </View>
                                    <Text style={styles.textGray14}> 
                                        <Text style={styles.boldMain}>@User1 </Text>
                                        Comment................................................................... .......................
                                    </Text>
                                </View>                   
                            </TouchableOpacity>                            
                        </View>
                        }
                    </View>
                </View>
                {/* Main cmt */}
                <View style={styles.wrapBoxCmt}>
                    <TouchableOpacity style={styles.wrapCmt}>
                        <Image source={DefaultAva} style={styles.avata}/>
                        <View>
                            <View style={styles.wrapNameTime}>
                                <Text style={styles.textBlack14}>Name</Text>
                                <Text style={styles.textGray12}>13 hr.ago</Text>
                            </View>
                            <Text style={styles.textGray14}>Comment...</Text>
                        </View>                   
                    </TouchableOpacity>
                    <View style={styles.wrapInnerCmt}>
                        <TouchableOpacity style={styles.btnViewReply}>
                            {true ? 
                                <AntDesign name="down" size={16} color={COLORS.main} />
                                :
                                <AntDesign name="up" size={16} color={COLORS.main} />
                            }
                            <Text style={styles.textMain14}>3 replies</Text>
                        </TouchableOpacity>                        
                    </View>
                </View>
                {/* Main cmt */}
                <View style={styles.wrapBoxCmt}>
                    <TouchableOpacity style={styles.wrapCmt}>
                        <Image source={DefaultAva} style={styles.avata}/>
                        <View>
                            <View style={styles.wrapNameTime}>
                                <Text style={styles.textBlack14}>Name</Text>
                                <Text style={styles.textGray12}>13 hr.ago</Text>
                            </View>
                            <Text style={styles.textGray14}>Comment...</Text>
                        </View>                   
                    </TouchableOpacity>                    
                </View>
                {/* Main cmt */}
                <View style={styles.wrapBoxCmt}>
                    <TouchableOpacity style={styles.wrapCmt}>
                        <Image source={DefaultAva} style={styles.avata}/>
                        <View>
                            <View style={styles.wrapNameTime}>
                                <Text style={styles.textBlack14}>Name</Text>
                                <Text style={styles.textGray12}>13 hr.ago</Text>
                            </View>
                            <Text style={styles.textGray14}>Comment...</Text>
                        </View>                   
                    </TouchableOpacity>                    
                </View>

                
            </ScrollView>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        gap: 12
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
    },
    btnViewReply:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: COLORS.lightGray,
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    textMain14:{
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.main
    },
    wrapBoxCmt:{
        gap: 4
    },
    wrapInnerCmt:{        
        marginLeft: 38
    },
    wrapList:{
        marginVertical: 8,
        gap: 8
    },
    boldMain:{
        fontWeight: "bold",
        color: COLORS.main
    }
})