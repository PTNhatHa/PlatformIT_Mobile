import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, commonStyles } from "../../../utils/constants";
import { useState } from "react";
import { ModalCourseContent } from "../../../components/ModalCourseContent";
import AntDesign from '@expo/vector-icons/AntDesign';
import { CardAssignment } from "../../../components/CardAssignment";
import { Comments } from "../../../components/Comments";
import { TextInputLabel, TextInputLabelGray, TextInputSelectBox } from "../../../components/TextInputField";
import DefaultImg from "../../../../assets/images/DefaultImg.png"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ButtonIconLightGreen } from "../../../components/Button";

export const TeacherLectureDetail = ()=>{
    const [index, setIndex] = useState(1) //1: Content, 2: Exercise, 3: Comment
    const [isOpenMenu, setIsOpentMenu] = useState(false)
    const listSortby2 = [
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
    ]

    return(
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.top}>
                    <Text style={styles.title}>Name Course</Text>
                    <TouchableOpacity onPress={()=>setIsOpentMenu(true)}>
                        <Entypo name="menu" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.main}>
                    <View style={styles.wrapper}>
                        <Text style={styles.title}>Edit lecture</Text>
                    </View>
                    <View style={styles.nav}>
                        <TouchableOpacity onPress={()=>setIndex(1)}>
                            <Text style={index === 1 ? styles.navTextActive : styles.navText}>Information</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setIndex(2)}>
                            <Text style={index === 2 ? styles.navTextActive : styles.navText}>Content</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setIndex(3)}>
                            <Text style={index === 3 ? styles.navTextActive : styles.navText}>Exercise</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setIndex(4)}>
                            <Text style={index === 4 ? styles.navTextActive : styles.navText}>Comment</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Information */}
                    {index === 1 &&
                        <View style={styles.wrapper}>
                            <TextInputSelectBox label={"Add to course"} placeholder={"Choose a course"} listSelect={[]}/>
                            <TextInputSelectBox label={"Add to section"} placeholder={"Choose a section"} listSelect={[]}/>
                            <TextInputLabelGray placeholder={"Lecture name"}  label={"Lecture name"}/>                            
                            <TextInputLabelGray placeholder={"Introduction"}  label={"Introduction"}/> 
                            <View style={styles.wrapBtn}>
                                <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]}>
                                    <Text style={styles.textWhite14}>Save changes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn]}>
                                    <Text style={styles.textGray14}>Delete this lecture</Text>
                                </TouchableOpacity>
                            </View>                           
                        </View>
                    }

                    {/* Content */}
                    {index === 2 &&
                        <View style={styles.wrapper}>
                            <Image source={DefaultImg} style={styles.contentVideo}/>
                            <View style={styles.containerGray}>
                                <Text style={styles.label}>Lecture video</Text>
                                <View style={styles.wrapFlex}>
                                    <View style={[styles.inputLabelGray]}>
                                        <TextInput 
                                            style={styles.inputText}
                                            value={"Video"}
                                            onChangeText={(v)=>{}}
                                            placeholder={"Video"}
                                        />
                                        <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                            <FontAwesome name="file" size={18} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                        <MaterialIcons name="delete" size={24} color={COLORS.red} />
                                    </TouchableOpacity>
                                </View>
                            </View>                         
                            <View style={styles.containerGray}>
                                <Text style={styles.label}>Materials</Text>
                                <View style={styles.wrapFlex}>
                                    <View style={[styles.inputLabelGray]}>
                                        <TextInput 
                                            style={styles.inputText}
                                            value={"Materials"}
                                            onChangeText={(v)=>{}}
                                            placeholder={"Materials"}
                                        />
                                        <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                            <FontAwesome name="file" size={18} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                        <MaterialIcons name="delete" size={24} color={COLORS.red} />
                                    </TouchableOpacity>
                                </View>
                            </View>                         
                            <View style={styles.containerGray}>
                                <Text style={styles.label}>Supporting materials</Text>
                                <View style={styles.wrapFlex}>
                                    <View style={[styles.inputLabelGray]}>
                                        <TextInput 
                                            style={styles.inputText}
                                            value={"Supporting materials"}
                                            onChangeText={(v)=>{}}
                                            placeholder={"Supporting materials"}
                                        />
                                        <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                            <FontAwesome name="file" size={18} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={()=>{}} style={{margin: 4}}>
                                        <MaterialIcons name="delete" size={24} color={COLORS.red} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={()=>{}} style={styles.btnGray}>
                                    <Entypo name="plus" size={24} color="black" />
                                </TouchableOpacity>
                            </View>    
                            <View style={styles.wrapBtn}>
                                <TouchableOpacity style={[styles.btn, {backgroundColor: COLORS.main}]}>
                                    <Text style={styles.textWhite14}>Save changes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btn]}>
                                    <Text style={styles.textGray14}>Discard changes</Text>
                                </TouchableOpacity>
                            </View>                        
                        </View>
                    }

                    {/* Exercise */}
                    {index === 3 &&
                        <View style={styles.wrapper}>
                            <CardAssignment isNoBoder={true}/>
                            <CardAssignment isNoBoder={true}/>
                            <ButtonIconLightGreen title={"Add new exercise"} icon={<Entypo name="plus" size={18} color={COLORS.main}/>}/>
                        </View>
                    }

                    {/* Comment */}
                    {index === 4 &&
                        <View style={[styles.wrapper]}>
                            <Comments/>
                        </View>
                    }
                </View>
            </ScrollView>

            <Modal
                visible={isOpenMenu}
                transparent={true}
                animationType="slide"
                onRequestClose={()=>setIsOpentMenu(true)}
            >
                <View style={styles.modal}>
                    <ScrollView contentContainerStyle={styles.innerModal}>
                        <TouchableOpacity style={{alignSelf: "flex-end"}} onPress={()=>setIsOpentMenu(false)}>
                            <AntDesign name="close" size={30} color={COLORS.secondMain} />
                        </TouchableOpacity>
                        <ModalCourseContent role={1}/>
                    </ScrollView>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FAFAFA",
        minHeight: "100%"
    },
    top:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    main: {
        ...commonStyles.shadow,
        minHeight: 500,
        borderRadius: 8,
        backgroundColor: "white",
        paddingBottom: 16
    },
    contentVideo: {
        width: "100%",
        height: 200,
        backgroundColor: COLORS.lightText,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        // marginTop: 16,
        marginBottom: 8
    },
    textGray12:{
        fontSize: 12,
        color: COLORS.stroke
    },
    wrapper: {
        paddingHorizontal: 16,
        marginVertical: 16,
        gap: 8
    },
    nav:{
        paddingHorizontal: 16,
        borderBottomWidth: 0.7,
        borderColor: COLORS.lightText,
        flexDirection: "row",
        gap: 20
    },
    navText: {
        fontSize: 14,
        color: COLORS.lightText,
        paddingVertical: 8
    },
    navTextActive: {
        fontSize: 14,
        paddingVertical: 8,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderColor: COLORS.main,
    },
    textBlack16: {
        fontSize: 16,
        fontWeight: "bold",
    },
    wrapContent:{
        marginVertical: 8
    },
    modal: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16,
    },
    innerModal: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8
    },

    label: {
        fontSize: 10,
        color: COLORS.stroke
    },
    containerGray: {
        width: "100%",
        columnGap: 8,
    },
    inputLabelGray:{
        fontSize: 16,
        // width: "100%",
        color: "black",
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1
    },
    inputText:{
        // width: "90%"
    },
    textListTag: {
        margin: 4,
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
    },

    textGray14: {
        fontSize: 14,
        color: COLORS.stroke
    },
    btn:{
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 4,
        flex: 1,
        alignItems: "center"
    },
    wrapBtn:{
        flexDirection: "row",
        gap: 8,
        marginVertical: 8
    },
    textWhite14:{
        fontSize: 14,
        color: "white",
    },
    wrapFlex:{
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    btnGray:{
        marginVertical: 4,
        backgroundColor: COLORS.lightGray,
        borderRadius: 4,
        padding: 8,
        alignSelf: "flex-start"
    }
})