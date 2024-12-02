import { useCallback, useEffect, useRef, useState } from "react";
import { ViewAllFromDetail } from "../../ViewAllFromDetail";
import { ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getAllCourseCardsByIdTeacher } from "../../../services/course";
import { useUser } from "../../../contexts/UserContext";
import { COLORS, commonStyles } from "../../../utils/constants";
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAllAssignmentCardOfTeacher, getAllTestCardOfStudent } from "../../../services/assignment";
import { CardAssignment } from "../../../components/CardAssignment";
import { formatDateTime } from "../../../utils/utils";
import { FilterAsgm } from "../../../components/Filter";

const ViewAllRender = ({data = [], status, getAllAsgm=()=>{}})=>{
    const [indexPage, setIndexPage] = useState(1)
    const [inputIndex, setInputIndex] = useState(1)
    const numberItem = 10
    const [currentData, setCurrentData] = useState(data.slice((indexPage-1)*numberItem, indexPage*numberItem) || [])
    const inputRef = useRef(null)
    let groupDate = null
    
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
                        let statusDate = status === 0 ? item.createdDate : status === 1 ? item.dueDate : item.submitedDate || ""
                        if(formatDateTime(statusDate) !== groupDate){
                            groupDate = formatDateTime(statusDate)
                            return(
                                <View key={`${groupDate}-${item.idAssignment}`}>
                                    <Text style={[commonStyles.title, {marginTop: 12}]} key={groupDate + status}>{groupDate}</Text>
                                    <CardAssignment data={item} role={2}  key={item.idAssignment + status} getAllAsgm={getAllAsgm}/>
                                </View>
                            )
                        } else  {
                            return(
                                <CardAssignment data={item} role={2}  key={item.idAssignment + status} getAllAsgm={getAllAsgm}/>
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

export const StudentAllTest = ()=>{
    const {state} = useUser()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);
    const [selectBtn, setSelectBtn] = useState(0)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [search, setSearch] = useState({
        completed: "",
        upComing: "",
        pastDue: "",
    })

    const [listCompleted, setListCompleted] = useState(null)
    const [listUpComing, setListUpComing] = useState(null)
    const [listPastDue, setListPastDue] = useState(null)

    const [currentCompleted, setCurrentCompleted] = useState(null)
    const [currentUpComing, setCurrentUpComing] = useState(null)
    const [currentPastDue, setCurrentPastDue] = useState(null)

    const [filterCompleted, setFilterCompleted] = useState(null)
    const [filterUpComing, setFilterUpComing] = useState(null)
    const [filterPastDue, setFilterPastDue] = useState(null)
    
    const getAllAsgm = async()=>{
        try {
            const response = await getAllTestCardOfStudent(state.idUser)
            let completed = []
            let upcoming = []
            let pastdue = []
            if(response){
                response.map(item => {
                    if(item.isCompleted === 1){
                        completed = [...completed, item]
                    } else if(item.isPastDue){
                        pastdue = [...pastdue, item]
                    }else{
                        upcoming = [...upcoming, item]
                    }
                })
            }
            completed.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            upcoming.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            pastdue.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

            setListCompleted(completed || [])
            setListUpComing(upcoming || [])
            setListPastDue(pastdue || [])

            setCurrentCompleted(completed || [])
            setCurrentUpComing(upcoming || [])
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
        // format
        newData = newData?.filter(item =>{
            if(filterList?.format !== "All"){
                return item.assignmentType === filterList?.format
            }
            return item
        })
        return newData || []
    }
    const handleSearch =(initData, searchText)=>{
        let newData = [...initData]
        if(searchText !== null){
            return newData.filter(item => {
                return item.nameCourse?.toLowerCase().includes(searchText.toLowerCase()) ||
                        item.title?.toLowerCase().includes(searchText.toLowerCase())
            })
        }
        return []
    }

    useEffect(()=>{
        if(selectBtn === 0){
            let result = listUpComing ? [...listUpComing] : []
            if(filterUpComing !== null){
                result = handleFilter(result, filterUpComing)
            }
            result = handleSearch(result, search.upComing)
            setCurrentUpComing(result)
        }
        if(selectBtn === 1){
            let result = listPastDue ? [...listPastDue] : []
            if(filterPastDue !== null){
                result = handleFilter(result, filterPastDue)
            }
            result = handleSearch(result, search.pastDue)
            setCurrentPastDue(result)
        }
        if(selectBtn === 2){
            let result = listCompleted ? [...listCompleted] : []
            if(filterCompleted !== null){
                result = handleFilter(result, filterCompleted)
            }
            result = handleSearch(result, search.completed)
            setCurrentCompleted(result)
        }
    }, [filterUpComing, filterPastDue, filterCompleted, search])

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
                            value={selectBtn === 0 ? search.upComing : selectBtn === 1 ? search.pastDue : search.completed}
                            style={styles.input}
                            placeholder={"Search"}
                            onChangeText={(v)=>{
                                selectBtn === 0 ? 
                                    setSearch({
                                        ...search,
                                        upComing: v
                                    })
                                : selectBtn === 1 ? 
                                    setSearch({
                                        ...search,
                                        pastDue: v
                                    })
                                : 
                                    setSearch({
                                        ...search,
                                        completed: v
                                    })
                            }}
                        />
                        <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                            <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.board}>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(0)}>
                        <Text style={[styles.normalBtn, selectBtn === 0 && styles.selectBtn]}>Up Coming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                        <Text style={[styles.normalBtn, selectBtn === 1 && styles.selectBtn]}>Past Due</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(2)}>
                        <Text style={[styles.normalBtn, selectBtn === 2 && styles.selectBtn]}>Completed</Text>
                    </TouchableOpacity>
                </View>
                {selectBtn === 0 &&
                    <ViewAllRender data={currentUpComing} status={0} key={0} getAllAsgm={getAllAsgm}/>                    
                }
                {selectBtn === 1 &&
                    <ViewAllRender data={currentPastDue} status={1} key={1} getAllAsgm={getAllAsgm}/>                    
                }
                {selectBtn === 2 &&
                    <ViewAllRender data={currentCompleted} status={2} key={2} getAllAsgm={getAllAsgm}/>                   
                }
                <Modal
                    visible={isOpenModal}
                    animationType="fade"
                >
                    {selectBtn === 0 ?
                        <FilterAsgm dataFilter={filterUpComing} setDataFilter={setFilterUpComing} onPressCancel={()=>setIsOpenModal(false)} isStudent={true}/>                    
                    : selectBtn === 1 ?
                        <FilterAsgm dataFilter={filterPastDue} setDataFilter={setFilterPastDue} onPressCancel={()=>setIsOpenModal(false)} isStudent={true}/>                 
                    :
                        <FilterAsgm dataFilter={filterCompleted} setDataFilter={setFilterCompleted} onPressCancel={()=>setIsOpenModal(false)} isStudent={true}/>                
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