import { useEffect, useRef, useState } from "react";
import { ViewAllFromDetail } from "../../ViewAllFromDetail";
import { ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAllCourseCardsByIdTeacher } from "../../../services/course";
import { useUser } from "../../../contexts/UserContext";
import { COLORS, commonStyles } from "../../../utils/constants";
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from "@react-navigation/native";
import { getAllAssignmentCardOfTeacher } from "../../../services/assignment";
import { CardAssignment } from "../../../components/CardAssignment";
import { formatDateTime } from "../../../utils/utils";
import { FilterAsgm } from "../../../components/Filter";

const ViewAllRender = ({data = [], status})=>{
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
                                <View key={`${createDate}-${item.idAssignment}`}>
                                    <Text style={[commonStyles.title, {marginTop: 12}]} key={createDate + status}>Create on {createDate}</Text>
                                    {status === 2 ?
                                        <CardAssignment data={item} role={1} key={item.idAssignment + status} isPastDue={true}/>
                                        :
                                        <CardAssignment data={item} role={1}  key={item.idAssignment + status}/>
                                    }
                                </View>
                            )
                        } else  {
                            return(
                                status === 2 ?
                                    <CardAssignment data={item} role={1} key={item.idAssignment + status} status={true}/>
                                    :
                                    <CardAssignment data={item} role={1}  key={item.idAssignment + status}/>
                            )
                        }
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
    const [loading, setLoading] = useState(true);
    const [selectBtn, setSelectBtn] = useState(0)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [search, setSearch] = useState({
        publish: "",
        unPublish: "",
        pastDue: "",
    })

    const [listPublish, setListPublish] = useState(null)
    const [listUnpublish, setListUnpublish] = useState(null)
    const [listPastDue, setListPastDue] = useState(null)

    const [currentPublish, setCurrentPublish] = useState(null)
    const [currentUnpublish, setCurrentUnpublish] = useState(null)
    const [currentPastDue, setCurrentPastDue] = useState(null)

    const [filterPublish, setFilterPublish] = useState(null)
    const [filterUnpublish, setFilterUnpublish] = useState(null)
    const [filterPastDue, setFilterPastDue] = useState(null)
    
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

            setListPublish(publish || [])
            setListUnpublish(unPublish || [])
            setListPastDue(pastdue || [])

            setCurrentPublish(publish || [])
            setCurrentUnpublish(unPublish || [])
            setCurrentPastDue(pastdue || [])
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getAllAsgm()
    }, [])
    
    const handleFilter = (initData, filterList)=>{
        let newData = [...initData] || []
        if(filterList?.sortby !== null && filterList?.sortway !== null){
            newData = newData?.sort((a,b) => {
                const field = filterList?.sortby
                const aValue = a[field]
                const bValue = b[field]
                if(filterList?.sortway === 1){
                    //Asc
                    if(aValue === null) return -1
                    if(bValue === null) return 1
                    if(aValue === null && bValue === null) return 0
                    return aValue.localeCompare(bValue)
                }
                if(filterList?.sortway === 2){
                    //Desc
                    if(aValue === null) return 1
                    if(bValue === null) return -1
                    if(aValue === null && bValue === null) return 0
                    return bValue.localeCompare(aValue);
                }
                return 0
            })
        }
        // Type
        newData = newData?.filter(item =>{
            if(filterList.type === "Test"){
                return item.isExam === 1
            }
            if(filterList.type === "Exercise"){
                return item.isExam === 0
            }
            return item
        })
        // format
        newData = newData?.filter(item =>{
            if(filterList.format !== "All"){
                return item.assignmentType === filterList.format
            }
            return item
        })
       if(selectBtn === 2){
            // status
            newData = newData?.filter(item =>{
                if(filterList.status === "Publish"){
                    return item.isPublish === 1
                }
                if(filterList.status === "Unpublish"){
                    return item.isPublish === 0
                }
                return item
            })
       }
        return newData || []
    }
    const handleSearch =(initData, searchText)=>{
        let newData = [...initData]
        if(searchText !== null){
            return newData.filter(item => {
                return item.nameLecture?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.nameCourse?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.title?.toLowerCase().includes(searchText.toLowerCase())
            })
        }
        return []
    }

    useEffect(()=>{
        if(selectBtn === 0){
            let result = listPublish ? [...listPublish] : []
            result = handleFilter(result, filterPublish)
            result = handleSearch(result, search.publish)
            setCurrentPublish(result)
        }
        if(selectBtn === 1){
            let result = listUnpublish ? [...listUnpublish] : []
            result = handleFilter(result, filterUnpublish)
            result = handleSearch(result, search.unPublish)
            setCurrentUnpublish(result)
        }
        if(selectBtn === 2){
            let result = listPastDue ? [...listPastDue] : []
            result = handleFilter(result, filterPastDue)
            result = handleSearch(result, search.pastDue)
            setCurrentPastDue(result)
        }
    }, [filterPublish, filterUnpublish, filterPastDue, search])

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
                            value={selectBtn === 0 ? search.publish : selectBtn === 1 ? search.unPublish : search.pastDue}
                            style={styles.input}
                            placeholder={"Search"}
                            onChangeText={(v)=>{
                                selectBtn === 0 ? 
                                    setSearch({
                                        ...search,
                                        publish: v
                                    })
                                : selectBtn === 1 ? 
                                    setSearch({
                                        ...search,
                                        unPublish: v
                                    })
                                : 
                                    setSearch({
                                        ...search,
                                        pastDue: v
                                    })
                            }}
                        />
                        <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                            <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.btnCirlce} onPress={()=> navigation.navigate("Create Assignment", { reload: getAllAsgm})}>
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
                    <ViewAllRender data={currentPublish} status={0} key={0}/>                    
                }
                {selectBtn === 1 &&
                    <ViewAllRender data={currentUnpublish} status={1} key={1}/>                    
                }
                {selectBtn === 2 &&
                    <ViewAllRender data={currentPastDue} status={2} key={2}/>                   
                }
                <Modal
                    visible={isOpenModal}
                    animationType="fade"
                >
                    {selectBtn === 0 ?
                        <FilterAsgm dataFilter={filterPublish} setDataFilter={setFilterPublish} onPressCancel={()=>setIsOpenModal(false)}/>                    
                    : selectBtn === 1 ?
                        <FilterAsgm dataFilter={filterUnpublish} setDataFilter={setFilterUnpublish} onPressCancel={()=>setIsOpenModal(false)}/>                 
                    :
                        <FilterAsgm dataFilter={filterPastDue} setDataFilter={setFilterPastDue} isPastdue={true} onPressCancel={()=>setIsOpenModal(false)}/>                
                    }
                </Modal>
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
        paddingTop: 10,
        alignItems: "center"
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