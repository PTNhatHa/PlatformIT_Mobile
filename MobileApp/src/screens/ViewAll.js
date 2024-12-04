import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { CardVirticalAssignmentTeacher, CardVirticalCenter, CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useRef } from "react";
import { TabBar, TabView } from "react-native-tab-view";
import { FilterCenter, FilterCourse, FilterTeacher } from "../components/Filter";
import { getAllCenterCards } from "../services/center";
import { getAllTeacherCards } from "../services/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllCourseCards } from "../services/course";
import { formatDateTime } from "../utils/utils";
import { CardAssignment } from "../components/CardAssignment";
import { useUser } from "../contexts/UserContext";

const ViewAllRender = ({data = [], type})=>{
    const [indexPage, setIndexPage] = useState(1)
    const [inputIndex, setInputIndex] = useState(1)
    const numberItem = 10
    const [currentData, setCurrentData] = useState(data.slice((indexPage-1)*numberItem, indexPage*numberItem) || [])
    const inputRef = useRef(null)
    
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
            {
                type === "Course" ? 
                    <FlatList
                        data={currentData}
                        keyExtractor={(item) => item.idCourse}
                        renderItem={({item}) => <CardVirticalCourse data={item}/>}
                        style={styles.wrapList}
                        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                    />
                : 
                type === "Center" ? 
                    <FlatList
                        data={currentData}
                        keyExtractor={(item) => item.idCenter}
                        renderItem={({item}) => <CardVirticalCenter data={item}/>}
                        style={styles.wrapList}
                        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                    />
                : 
                type === "Teacher" ? 
                    <FlatList
                        data={currentData}
                        keyExtractor={(item) => item.idUser}
                        renderItem={({item}) => <CardVirticalTeacher data={item}/>}
                        style={styles.wrapList}
                        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                    />
                : ""
            }
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

export const ScreenViewAll = ({route})=>{
    const {state} = useUser()
    const initialTab = route.params?.initTab || 0

    const [loading, setLoading] = useState(true);
    const [selectBtn, setSelectBtn] = useState(initialTab)

    const [search, setSearch] = useState(null)
    const [index, setIndex] = useState(initialTab);
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [dataSortCourse, setDataSortCourse] = useState([]);
    const [dataFilterCourse, setDataFilterCourse] = useState([]);
    const [dataSortCenter, setDataSortCenter] = useState([]);
    const [dataFilterCenter, setDataFilterCenter] = useState([]);
    const [dataSortTeacher, setDataSortTeacher] = useState([]);
    
    const [initCourse, setInitCourse] = useState([])
    const [initCenter, setInitCenter] = useState([])
    const [initTeacher, setInitTeacher] = useState([])
    
    const [dataCourse, setDataCourse] = useState([])
    const [dataCenter, setDataCenter] = useState([])
    const [dataTeacher, setDataTeacher] = useState([])

    useEffect(()=>{
        AsyncStorage.setItem('searchCourse', "")
        AsyncStorage.setItem('searchCenter', "")
        AsyncStorage.setItem('searchTeacher', "")
    }, [])

    useEffect(()=>{
        const changeIndex = async()=>{
            let txt = ""
            if(index === 0){
                txt = await AsyncStorage.getItem('searchCourse')
            }
            if(index === 1){
                txt = await AsyncStorage.getItem('searchCenter')
            }
            if(index === 2){
                txt = await AsyncStorage.getItem('searchTeacher')
            }
            setSearch(txt)
        }
        changeIndex()
    }, [index])

    // Filter
    const handleFilterCourse = (data)=>{
        let filterData = [...data]
        // tags
        if(dataFilterCourse.tags){
            dataFilterCourse.tags.forEach(item => {
                let filterTag = filterData.filter(init => {
                    return init.tags && init.tags.some(current => current === item.label)
                })
                filterData = [...filterTag]
            })            
        }

        // courseType
        if(dataFilterCourse.courseType === "Limit"){
            filterData = filterData.filter(item =>{
                if(item.courseStartDate){
                    // startRegist - endRegist
                    // Ngày bắt đầu khóa học phải nằm sau hặc bằng startRegist
                    // Ngày kết thúc khóa học phải trước hoặc bằng endRegist
                    if(dataFilterCourse.startRegist && new Date(item.registStartDate) >= new Date(dataFilterCourse.startRegist) ||
                        dataFilterCourse.endRegist && new Date(item.registEndDate) <= new Date(dataFilterCourse.endRegist)){
                        return true
                    }
                    // startDuration - endDuration
                    if(dataFilterCourse.startDuration && new Date(item.courseStartDate) >= new Date(dataFilterCourse.startDuration) ||
                        dataFilterCourse.endDuration && new Date(item.courseEndDate) <= new Date(dataFilterCourse.endDuration)){
                        return true
                    }
                }
                return false
            })
        } else if(dataFilterCourse.courseType === "Unlimit"){
            filterData = filterData.filter(item => !item.courseStartDate)
        }

        // startCost - endCost
        if(dataFilterCourse.startCost){
            filterData = filterData.filter(item => item.price >= dataFilterCourse.startCost)
        }
        if(dataFilterCourse.endCost){
            filterData = filterData.filter(item => item.price <= dataFilterCourse.endCost)
        }

        return filterData
    }

    const handleFilterCenter = (data)=>{
        let filterData = [...data]
        // tags
        if(dataFilterCenter.tags){
            dataFilterCenter.tags.forEach(item => {
                let filterTag = filterData.filter(init => {
                    return init.listTagCourses && init.listTagCourses?.some(current => current.tagName === item.label)
                })
                filterData = [...filterTag]
            })            
        }
        return filterData
    }

    // Sort
    const handleSort = (initData, sortData)=>{
        let newData = [...initData]
        if(sortData.sortby && sortData.sortway){
            newData.sort((a,b) => {
                const field = sortData.sortby
                const aValue = a[field]
                const bValue = b[field]
                if(sortData.sortway === 1){
                    //Asc
                    if(aValue === null) return -1
                    if(bValue === null) return 1
                    if(aValue === null && bValue === null) return 0
                    return aValue.localeCompare(bValue)
                }
                if(sortData.sortway === 2){
                    //Desc
                    if(aValue === null) return 1
                    if(bValue === null) return -1
                    if(aValue === null && bValue === null) return 0
                    return bValue.localeCompare(aValue);
                }
                return 0
            })
        }
        return newData || []
    }

    // Search
    const handleOnChangeSearch = async (value)=>{
        setSearch(value)
        if(index === 0) await AsyncStorage.setItem('searchCourse', value)
        if(index === 1) await AsyncStorage.setItem('searchCenter', value)
        if(index === 2) await AsyncStorage.setItem('searchTeacher', value)
    }
    const handleSearch = (dataSearch)=>{
        let result = [...dataSearch]
        // Course
        if(index === 0){
            result = dataSearch.filter(data => {
                return data.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
                        data.centerName?.toLowerCase().includes(search.toLowerCase()) ||
                        data.price?.toString().includes(search)
            })            
        }
        // Center
        if(index === 1){
            result = dataSearch.filter(data => {
                return data.centerName?.toLowerCase().includes(search.toLowerCase()) ||
                        data.description?.toLowerCase().includes(search.toLowerCase())
            })            
        }
        // Teacher
        if(index === 2){
            result = dataSearch.filter(data => {
                return data.name?.toLowerCase().includes(search.toLowerCase()) ||
                        data.teachingMajor?.toLowerCase().includes(search.toLowerCase()) ||
                        data.coursesCount?.toString().toLowerCase().includes(search.toLowerCase())                        
            })            
        }
        return result || []
    }
    
    // Search - Sort - Filter
    useEffect(()=>{
        if(index === 0){
            let result = [...initCourse]
            if(search){
                result = handleSearch(result)
            }
            result = handleSort(result, dataSortCourse)
            result = handleFilterCourse(result) || []
            setDataCourse(result)
        }
    }, [search, dataSortCourse, dataFilterCourse])

    useEffect(()=>{
        if(index === 1){
            let result = [...initCenter]
            if(search){
                result = handleSearch(result)
            }
            result = handleSort(result, dataSortCenter)
            result = handleFilterCenter(result)
            setDataCenter(result)
        }
    }, [search, dataSortCenter, dataFilterCenter])

    useEffect(()=>{
        if(index === 2){
            let result = [...initTeacher]
            if(search){
                result = handleSearch(result)
            }
            result = handleSort(result, dataSortTeacher)
            setDataTeacher(result)
        }
    }, [search, dataSortTeacher])

    const getAllCard = async ()=>{
        try {
            const responseCourse = await getAllCourseCards(state.idRole === 3 ? state.idUser : null)
            const responseCenter = await getAllCenterCards()
            const responseTeacher = await getAllTeacherCards()
            setInitCourse(responseCourse)
            setInitCenter(responseCenter)
            setInitTeacher(responseTeacher)

            setDataCourse(responseCourse)
            setDataCenter(responseCenter)
            setDataTeacher(responseTeacher)
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        getAllCard()
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
        <View style={styles.container}>
            <View style={styles.wrapperSearch}>
                <TextInput
                    value={search}
                    style={styles.input}
                    placeholder={"Search"}
                    onChangeText={(value)=>handleOnChangeSearch(value)}
                />
                <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                    <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                </TouchableOpacity>
            </View>
            <View style={styles.board}>
                <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(0)}>
                    <Text style={[styles.normalBtn, selectBtn === 0 && styles.selectBtn]}>Course</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(1)}>
                    <Text style={[styles.normalBtn, selectBtn === 1 && styles.selectBtn]}>Center</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boardBtn} onPress={()=>setSelectBtn(2)}>
                    <Text style={[styles.normalBtn, selectBtn === 2 && styles.selectBtn]}>Teacher</Text>
                </TouchableOpacity>
            </View>
            {selectBtn === 0 &&
                <ViewAllRender data={dataCourse} type={"Course"}/>
            }
            {selectBtn === 1 &&
                <ViewAllRender data={dataCenter} type={"Center"}/>
            }
            {selectBtn === 2 &&
                <ViewAllRender data={dataTeacher} type={"Teacher"}/>
            }
            <Modal
                visible={isOpenModal}
                animationType="fade"
            >
                {index === 0 ?
                    <FilterCourse 
                        dataSort={dataSortCourse}
                        setDataSort={setDataSortCourse}
                        dataFilter={dataFilterCourse}
                        setDataFilter={setDataFilterCourse}
                        onPressCancel={()=>setIsOpenModal(!isOpenModal)}
                    /> :
                    index === 1 ?
                    <FilterCenter
                        dataSort={dataSortCenter}
                        setDataSort={setDataSortCenter}
                        dataFilter={dataFilterCenter}
                        setDataFilter={setDataFilterCenter}
                        onPressCancel={()=>setIsOpenModal(!isOpenModal)}
                    /> :
                    index === 2 ?
                    <FilterTeacher
                        dataSort={dataSortTeacher}
                        setDataSort={setDataSortTeacher}
                        onPressCancel={()=>setIsOpenModal(!isOpenModal)}
                    /> : ""
                }
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 16,
        backgroundColor: "#FAFAFA",
        flex: 1
    },
    wrapperSearch: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
        marginBottom: 10
    },
    input:{
        fontSize: 16,
        width: "90%"
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
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
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
})
