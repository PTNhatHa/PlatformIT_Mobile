import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import DefaultAva from "../../assets/images/DefaultAva.png"
import { COLORS } from "../utils/constants"
import { ButtonGreen, ButtonWhite } from "./Button"
import { TouchableOpacity } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useUser } from "../contexts/UserContext"
import AntDesign from '@expo/vector-icons/AntDesign';
import { addComment, getAllCommentOfLecture } from "../services/comment"
import { determineFileType } from "../utils/utils"
import Entypo from '@expo/vector-icons/Entypo';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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

export const Comments = ({idLecture, idTeacher})=>{
    const {state, dispatch} = useUser()
    const [newCmt, setNewCmt] = useState({
        idLecture: null,
        idSender: state.idUser,
        idReceiver: null,
        idCommentRef: null,
        content: "",
        nameRep: null
    })
    const [listMainCmt, setListMainCmt] = useState(null)
    const [listSubCmt, setListSubCmt] = useState(null)
    const [listIsShow, setListIsShow] = useState({})
    const [listShowMore, setListShowMore] = useState({})
    const [loading, setLoading] = useState(true);
    const textInputRef = useRef(null)

    const getAllCmt = async()=>{
        setLoading(true)
        try {
            const response = await getAllCommentOfLecture(idLecture || 1)
            if(response){
                let sub = {}
                let show = {}
                let showMore = {}
                const main = []
                response.forEach(cmt => {
                    showMore = {
                        ...sub,
                        [cmt.idComment] : false
                    }
                    if(cmt.idCommentRef === null){
                        sub = {
                            ...sub,
                            [cmt.idComment] : []
                        }
                        main.push(cmt)
                        show = {
                            ...show,
                            [cmt.idComment] : true
                        }
                    }
                    if(cmt.idCommentRef !== null && sub[cmt.idCommentRef]){
                        sub[cmt.idCommentRef].push({
                            ...cmt,
                        })
                    } else if(cmt.idCommentRef !== null){
                        Object.keys(sub).forEach(key => {
                            const findSub = sub[key].find(item => item.idComment === cmt.idCommentRef)
                            if (findSub) {
                                sub[key].push({
                                    ...cmt,
                                    nameRep: findSub.idUser !== cmt.idUser ? findSub.fullName : ""                                    
                                });
                            }
                        });
                    }
                });                
                setListMainCmt(main.sort(
                    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                  ))
                Object.keys(sub).forEach((key) => {
                    sub[key].sort(
                        (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
                    );
                });
                setListSubCmt(sub)
                setListIsShow(show)
                setListShowMore(showMore)
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false)
        }
    }
    useEffect(()=>{
        getAllCmt()
    },[])

    const handleAddReply = (idReceiver, idCommentRef, nameRep)=>{
        setNewCmt({
            idLecture: idLecture,
            idSender: state.idUser,
            idReceiver: idReceiver,
            idCommentRef: idCommentRef,
            content: "",
            nameRep: idReceiver === state.idUser ? "Yourself" : nameRep
        })
        textInputRef.current?.focus()
    }

    const addNewCmt = async()=>{
        setLoading(true)
        try {
            const comment = {
                idLecture: idLecture,
                idSender: state.idUser,
                idReceiver: newCmt.idReceiver ? (newCmt.idReceiver === state.idUser ? null : newCmt.idReceiver) : idTeacher,
                idCommentRef: newCmt.idCommentRef,
                content: newCmt.content
            }
            const response = await addComment(comment)
            if(response){
                setNewCmt(null)
                getAllCmt()
            } else{
                Alert.alert("Error", "Please try again.")
            }
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false)
        }
    }
    
    if (loading) {
        // Render màn hình chờ khi dữ liệu đang được tải
        return (
            <View style={styles.wrapLoading}>
                <ActivityIndicator size="large" color={COLORS.main} />
            </View>
        );
    }
    return(
        <>
        <View style={styles.innerMain}>
            <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>               
                {/* Main cmt */}
                {listMainCmt?.map(mainCmt =>
                    <View style={styles.wrapBoxCmt} key={mainCmt.idComment}>
                        <TouchableOpacity 
                            style={styles.wrapCmt}
                            onPress={()=>setListShowMore({
                                ...listShowMore,
                                [mainCmt.idComment] : !listShowMore[mainCmt.idComment]
                            })}
                        >
                            <Image source={mainCmt.avatarPath ? {uri: mainCmt.avatarPath} : DefaultAva} style={styles.avata}/>
                            <View>
                                <View style={styles.wrapNameTime}>
                                    <Text style={styles.textBlack14}>{mainCmt.fullName}</Text>
                                    <Text style={styles.textGray12}>{mainCmt.relativeTime}</Text>
                                </View>
                                <Text 
                                    style={styles.textGray14}
                                    numberOfLines={listShowMore[mainCmt.idComment] ? 0 : 2} 
                                    ellipsizeMode="tail"
                                >
                                    {mainCmt.content}
                                </Text>
                            </View>                   
                        </TouchableOpacity>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity style={styles.btnReply} onPress={()=>handleAddReply(mainCmt.idUser, mainCmt.idComment, mainCmt.fullName)}>
                                <Entypo name="reply" size={14} color={COLORS.lightText} style={styles.flippedIcon}/>
                                <Text style={styles.textGray12}>Reply</Text>
                            </TouchableOpacity>
                            {mainCmt.idUser === state.idUser &&
                                <TouchableOpacity style={styles.btnDelete}>
                                    <MaterialIcons name="delete" size={14} color={COLORS.lightText} />
                                    <Text style={styles.textGray12}>Delete</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        {listSubCmt[mainCmt.idComment]?.length > 0 &&
                        <>                            
                            <View style={styles.wrapInnerCmt}>
                                <TouchableOpacity style={styles.btnViewReply} onPress={()=>setListIsShow({
                                    ...listIsShow,
                                    [mainCmt.idComment] : !listIsShow[mainCmt.idComment]
                                })}>
                                    {listIsShow[mainCmt.idComment] ? 
                                        <AntDesign name="up" size={16} color={COLORS.main} />
                                        :
                                        <AntDesign name="down" size={16} color={COLORS.main} />
                                    }
                                    <Text style={styles.textMain14}>
                                        {listSubCmt[mainCmt.idComment].length} 
                                        {listSubCmt[mainCmt.idComment].length > 1 ? " replies" : " reply"}
                                    </Text>
                                </TouchableOpacity>
                                {/* Reply cmt */}
                                {listIsShow[mainCmt.idComment] &&
                                    listSubCmt[mainCmt.idComment].map(subCmt =>
                                    <View style={styles.wrapList} key={subCmt.idComment}>
                                        <TouchableOpacity 
                                            style={styles.wrapCmt}
                                            onPress={()=>setListShowMore({
                                                ...listShowMore,
                                                [subCmt.idComment] : !listShowMore[subCmt.idComment]
                                            })}
                                        >
                                            <Image source={subCmt.avatarPath ? {uri: subCmt.avatarPath} : DefaultAva} style={styles.avata}/>
                                            <View>
                                                <View style={styles.wrapNameTime}>
                                                    <Text style={styles.textBlack14}>{subCmt.fullName}</Text>
                                                    <Text style={styles.textGray12}>{subCmt.relativeTime}</Text>
                                                </View>
                                                <Text 
                                                    style={[styles.textGray14, styles.maxWidth]}
                                                    numberOfLines={listShowMore[subCmt.idComment] ? 0 : 2} 
                                                    ellipsizeMode="tail"
                                                > 
                                                    {subCmt.nameRep && <Text style={styles.boldMain}>@{subCmt.nameRep} </Text>}
                                                    {subCmt.content}
                                                </Text>
                                            </View>             
                                        </TouchableOpacity>   
                                        <View style={{flexDirection: "row"}}>
                                            <TouchableOpacity style={styles.btnReply} onPress={()=>handleAddReply(subCmt.idUser, subCmt.idComment, subCmt.fullName)}>
                                                <Entypo name="reply" size={14} color={COLORS.lightText} style={styles.flippedIcon}/>
                                                <Text style={styles.textGray12}>Reply</Text>
                                            </TouchableOpacity>
                                            {subCmt.idUser === state.idUser &&
                                                <TouchableOpacity style={styles.btnDelete}>
                                                    <MaterialIcons name="delete" size={14} color={COLORS.lightText} />
                                                    <Text style={styles.textGray12}>Delete</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>                   
                                    </View>
                                    )
                                }
                            </View>
                        </>
                        }
                    </View>
                )}                              
            </ScrollView>
        </View>
        {/* New Comment */}
        <View style={styles.wrapNewCmt}>
            <View style={styles.wrapCmt}>
                <Image source={determineFileType(state.avatar) === "Image" ? {uri: state.avatar.toString()} : DefaultAva} style={styles.avata}/>
                <View style={{flex: 1}}>
                    {newCmt?.idCommentRef &&
                        <View style={styles.wrapFlex}>
                            <Entypo name="reply" size={14} color="black" style={styles.flippedIcon}/>
                            <Text style={styles.textGray12}>
                                Reply to
                                <Text style={styles.boldMain}> @{newCmt.nameRep}</Text>
                            </Text>
                        </View>
                    }
                    <TextInput 
                        style={[styles.textAddCmt]}
                        placeholder="Comment"
                        value={newCmt?.content || ""}
                        onChangeText={(v)=>setNewCmt({
                            ...newCmt,
                            content: v
                        })}
                        multiline={true}
                        ref={textInputRef}
                    />
                </View>
            </View>                
            {newCmt?.content &&
                <View style={styles.wrapBtn}>
                    <TouchableOpacity style={styles.btn} onPress={()=>setNewCmt(null)}>
                        <Text style={styles.textGray14}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]} onPress={()=>addNewCmt()}>
                        <Text style={styles.textWhite14}>Comment</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
        </>
    )
}
const styles = StyleSheet.create({
    innerMain:{
        height: 400,
        paddingHorizontal: 16,
        marginVertical: 8,
        gap: 4,
        zIndex: 9
    },
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
        gap: 8,
    },
    textInput: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        width: "100%",
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
        color: COLORS.stroke,
        flexWrap: "wrap",
        maxWidth: 292,
        textAlign: "justify"
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
        color: COLORS.main,
        flexWrap: "wrap",
    },
    maxWidth:{
        maxWidth: 228
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },
    wrapNewCmt: {
        backgroundColor: COLORS.lightGray,
        flex: 1,
        borderRadius: 4,
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    flippedIcon: {
        transform: [{ scaleX: -1 }],
        alignSelf: "flex-start"
    },
    wrapFlex:{
        flexDirection: "row",
        gap: 4,
        alignItems: "center"
    },
    textAddCmt:{
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        flex: 1
    },
    btnReply:{
        alignItems: "center",
        flexDirection: "row",
        gap: 2,
        marginLeft: 36,
    },
    btnDelete:{
        alignItems: "center",
        flexDirection: "row",
        gap: 2,        
        marginLeft: 8,
    },
})