import { useEffect, useRef, useState } from "react";
import { ViewAllFromDetail } from "../../ViewAllFromDetail";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAllCourseCardsByIdTeacher } from "../../../services/course";
import { useUser } from "../../../contexts/UserContext";
import { COLORS, commonStyles } from "../../../utils/constants";
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "@react-navigation/native";
import { getAllAssignmentCardOfTeacher } from "../../../services/assignment";
import { CardAssignment } from "../../../components/CardAssignment";
import { formatDateTime } from "../../../utils/utils";

const ViewAllRender = ({data = [], isPastDue})=>{
    const [indexPage, setIndexPage] = useState(1)
    const [inputIndex, setInputIndex] = useState(1)
    const numberItem = 10
    const [currentData, setCurrentData] = useState(data.slice((indexPage-1)*numberItem, indexPage*numberItem) || [])
    const inputRef = useRef(null)
    let createDate = null
    
    useEffect(() => {
        const newData = data.slice((indexPage - 1) * numberItem, indexPage * numberItem) || [];
        setCurrentData(newData);
    }, [data, indexPage]);

    const handleChangeIndex = (isNext)=>{
        let index = 0
        if(isNext){
            index = indexPage + 1
        } else {
            index = indexPage - 1
        }
        setIndexPage(index)
        setInputIndex(index)
        setCurrentData(data.slice((index-1)*numberItem, index*numberItem))
    }
    const handleOnChangeText = (v)=>{
        if(v){
            const newIndex = parseInt(v, 10)
            setInputIndex(newIndex)
        }
        else setInputIndex("")
    }
    const handleOnSubmit = ()=>{
        if(!isNaN(inputIndex) && inputIndex > 0 && inputIndex <= Math.ceil(data.length / numberItem)){
            setIndexPage(inputIndex)
            setCurrentData(data.slice((inputIndex-1)*numberItem, inputIndex*numberItem))
        } else{
            setInputIndex(indexPage)
            Alert.alert("Error Input", "Please enter from 1 to " + Math.ceil(data.length / numberItem))
        }
    }

    return(
        <View style={{ flex: 1}}>
            <View style={styles.wrapList}>
                <ScrollView contentContainerStyle={styles.wrapList}>
                    {currentData.map(item => {
                        if(formatDateTime(item.createdDate) !== createDate){
                            createDate = formatDateTime(item.createdDate)
                            return(
                                <>
                                    <Text style={[commonStyles.title, {marginTop: 12}]}>Create on {createDate}</Text>
                                    {isPastDue ?
                                        <CardAssignment data={item} role={1} key={item.idAssignment} isPastDue={true}/>
                                        :
                                        <CardAssignment data={item} role={1}  key={item.idAssignment}/>
                                    }
                                </>
                            )
                        }
                        return(
                            isPastDue ?
                                <CardAssignment data={item} role={1} key={item.idAssignment} isPastDue={true}/>
                                :
                                <CardAssignment data={item} role={1}  key={item.idAssignment}/>
                        )
                    })}
                </ScrollView>
            </View>
            <View style={styles.bottom}>
                {indexPage > 1 && 
                    <TouchableOpacity style={[styles.pageNumber]} onPress={()=>handleChangeIndex(false)}>
                        <Text style={[styles.pageNumberText, {color: "white"}]}>Previous</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={styles.wrapPageNumber} onPress={()=> inputRef.current.focus()}>
                    <TextInput 
                        ref={inputRef}
                        style={styles.pageNumberText} 
                        value={inputIndex.toString()} 
                        onChangeText={(v)=>handleOnChangeText(v)}
                        onSubmitEditing={handleOnSubmit}
                        keyboardType="numeric"    
                    />
                    <Text style={styles.pageNumberText}>/{Math.ceil(data.length / numberItem)} pages</Text>
                </TouchableOpacity>
                {indexPage < Math.ceil(data.length / numberItem) &&
                    <TouchableOpacity style={[styles.pageNumber]} onPress={()=>handleChangeIndex(true)}>
                        <Text style={[styles.pageNumberText, {color: "white"}]}>Next</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export const TeacherAllAssignment = ()=>{
    const {state} = useUser()
    const navigation = useNavigation()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [selectBtn, setSelectBtn] = useState(0)
    const [search, setSearch] = useState(null)

    const [listPublish, setListPublish] = useState([])
    const [listUnpublish, setListUnpublish] = useState([])
    const [listPastDue, setListPastDue] = useState([])
    const getAllAsgm = async()=>{
        try {
            const response = await getAllAssignmentCardOfTeacher(state.idUser)
            let publish = []
            let unPublish = []
            let pastdue = []
            if(response){
                response.map(item => {
                    if(item.isPublish === 1){
                        publish = [...publish, item]
                    } else{
                        unPublish = [...unPublish, item]
                    }
                    if(item.isPastDue){
                        pastdue = [...pastdue, item]
                    }
                })
            }
            publish.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            unPublish.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            pastdue.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setListPublish(publish)
            setListUnpublish(unPublish)
            setListPastDue(pastdue)
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getAllAsgm()
    }, [])

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
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.wrapperSearch}>
                        <TextInput
                            // value={"search"}
                            style={styles.input}
                            placeholder={"Search"}
                            onChangeText={(value)=>{}}
                        />
                        <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                            <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.btnCirlce} onPress={()=> navigation.navigate("Create Assignment")}>
                        <Entypo name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.board}>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(0)}>
                        <Text style={[styles.normalBtn, selectBtn === 0 && styles.selectBtn]}>Publish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                        <Text style={[styles.normalBtn, selectBtn === 1 && styles.selectBtn]}>Unpublish</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(2)}>
                        <Text style={[styles.normalBtn, selectBtn === 2 && styles.selectBtn]}>Past Due</Text>
                    </TouchableOpacity>
                </View>
                {selectBtn === 0 &&
                    <ViewAllRender data={listPublish}/>                    
                }
                {selectBtn === 1 &&
                    <ViewAllRender data={listUnpublish}/>                    
                }
                {selectBtn === 2 &&
                    <ViewAllRender data={listPastDue} isPastDue={true}/>                   
                }
            </View>
            {loading &&
                <View style={styles.wrapLoading}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }  
        </>
    )
}
const styles = StyleSheet.create({
    container:{
        padding: 16,
        backgroundColor: "#FAFAFA",
        flex: 1,
    },
    wrapperSearch: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
        marginBottom: 10,
        flex: 1,
    },
    input:{
        fontSize: 16,
        flex: 1
    },
    board: {
        flexDirection: "row",
        columnGap: 4,
    },
    boardBtn: {
        justifyContent: "center",
        flex: 1,
    },
    normalBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        fontSize: 18,
        color: COLORS.lightText,
        fontWeight: "bold",
        textAlign: "center",
    },
    selectBtn: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.main,
        color: COLORS.main,
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    },

    header:{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        width: "100%"
    },
    btnCirlce:{
        ...commonStyles.shadow,
        backgroundColor: COLORS.main,
        width: 40,
        height: 40,
        borderRadius: 90,
        padding: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    bottom:{
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 20,
        backgroundColor: "#FAFAFA",
        paddingTop: 10
    },
    wrapPageNumber:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    pageNumber:{
        height: 32,
        width: 100,
        backgroundColor: "white",
        alignSelf: "flex-start",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.main
    },
    pageNumberText: {
        color: COLORS.main,
        fontWeight: "bold",
        fontSize: 16,
    },
    wrapList: {
        marginBottom: 50,
    },
})