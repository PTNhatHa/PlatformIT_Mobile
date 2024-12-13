import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import DefaultAva from "../../assets/images/DefaultAva.png"
import { COLORS } from "../utils/constants"
import { ButtonGreen, ButtonWhite } from "./Button"
import { TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { useUser } from "../contexts/UserContext"
import AntDesign from '@expo/vector-icons/AntDesign';
import { addComment, getAllCommentOfLecture } from "../services/comment"

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

export const Comments = ({idLecture})=>{
    const {state, dispatch} = useUser()
    const [newCmt, setNewCmt] = useState(null)
    const [listMainCmt, setListMainCmt] = useState(null)
    const [listSubCmt, setListSubCmt] = useState(null)
    const [listIsShow, setListIsShow] = useState({})
    const [listShowMore, setListShowMore] = useState({})

    const addNewCmt = async()=>{
        try {
            const comment = {
                idLecture: idLecture,
                idSender: state.idUser,
                idReceiver: null,
                idCommentRef: null,
                content: newCmt
            }
            console.log("newCmt: ", comment);
            const response = await addComment(comment)
            console.log(response);
            if(response){
                
            } else{
                Alert.alert("Error", "Please try again.")
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    const getAllCmt = async()=>{
        try {
            const response = await getAllCommentOfLecture(idLecture)
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
                        const nameRep = main.find(item => item.idComment === cmt.idCommentRef).fullName
                        sub[cmt.idCommentRef].push({
                            ...cmt,
                            nameRep: nameRep
                        })
                    } else if(cmt.idCommentRef !== null){
                        Object.keys(sub).forEach(key => {
                            if (sub[key].some(item => item.idComment === cmt.idCommentRef)) {
                                sub[key].push({
                                    ...cmt,
                                    nameRep: item.fullName
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
                        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                    );
                });
                setListSubCmt(sub)
                setListIsShow(show)
                setListShowMore(showMore)
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    useEffect(()=>{
        getAllCmt()
    },[])

    return(
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.wrapInputCmt}>
                    <View style={styles.wrapCmt}>
                        <Image source={DefaultAva} style={styles.avata}/>
                        <TextInput 
                            style={[styles.textInput, newCmt && {borderColor: COLORS.main}]}
                            placeholder="Comment"
                            value={newCmt}
                            onChangeText={(v)=>setNewCmt(v)}
                        />
                    </View>
                    {newCmt &&
                        <View style={styles.wrapBtn}>
                            <TouchableOpacity style={styles.btn}>
                                <Text style={styles.textGray14}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]} onPress={()=>addNewCmt()}>
                                <Text style={styles.textWhite14}>Comment</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

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
                        {listSubCmt[mainCmt.idComment]?.length > 0 &&
                            listSubCmt[mainCmt.idComment].map(subCmt =>
                                <View style={styles.wrapInnerCmt} key={subCmt.idComment}>
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
                                    <View style={styles.wrapList}>
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
                                                    <Text style={styles.boldMain}>@{subCmt.nameRep} </Text>
                                                    {subCmt.content}
                                                </Text>
                                            </View>                   
                                        </TouchableOpacity>                            
                                    </View>
                                    }
                                </View>
                            )
                        }
                    </View>
                )}                              
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
        maxWidth: 255
    }
})