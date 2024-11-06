import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useRef } from "react";
import { FilterCenter, FilterCourse, FilterTeacher } from "../components/Filter";
import { formatDateTime } from "../utils/utils";
import { CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical";

export const ViewAllFromDetail = ({route})=>{
    const initData = route.params?.initData || []
    const index = route.params?.index || false
    const namePage = route.params?.namePage || ""
    const [data, setData] = useState(initData)
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [dataSort, setDataSort] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);

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
    
    // Filter
    const handleFilter = (data)=>{
        let filterData = [...data]
        if(index === 1){
            // tags
            if(dataFilter.tags){
                dataFilter.tags.forEach(item => {
                    let filterTag = filterData.filter(init => {
                        return init.tags && init.tags.some(current => current === item.label)
                    })
                    filterData = [...filterTag]
                })            
            }
    
            // courseType
            if(dataFilter.courseType === "Limit"){
                filterData = filterData.filter(item =>{
                    if(item.courseStartDate){
                        // startRegist - endRegist
                        // Ngày bắt đầu khóa học phải nằm sau hặc bằng startRegist
                        // Ngày kết thúc khóa học phải trước sau hặc bằng startRegist
                        if(dataFilterCourse.startRegist && new Date(item.registStartDate) < new Date(dataFilterCourse.startRegist)){
                            return false
                        }
                        if(dataFilterCourse.endRegist && new Date(item.registEndDate) > new Date(dataFilterCourse.endRegist)){
                            return false
                        }
                        // startDuration - endDuration
                        if(dataFilterCourse.startDuration && new Date(item.courseStartDate) < new Date(dataFilterCourse.startDuration)){
                            return false
                        }
                        if(dataFilterCourse.endDuration && new Date(item.courseEndDate) > new Date(dataFilterCourse.endDuration)){
                            return false
                        }
                        return true
                    }
                    return false
                })
            } else if(dataFilter.courseType === "Unlimit"){
                filterData = filterData.filter(item => !item.courseStartDate)
            }
    
            // startCost - endCost
            if(dataFilter.startCost){
                filterData = filterData.filter(item => item.price >= dataFilterCourse.startCost)
            }
            if(dataFilter.endCost){
                filterData = filterData.filter(item => item.price <= dataFilterCourse.endCost)
            }
        } 
        if(index === 2){
            // tags
            if(dataFilter.tags){
                dataFilter.tags.forEach(item => {
                    let filterTag = filterData.filter(init => {
                        return init.listTagCourses && init.listTagCourses?.some(current => current.tagName === item.label)
                    })
                    filterData = [...filterTag]
                })            
            }
        }
        return filterData
    }

    // Sort
    const handleSort = (initData, sortData)=>{
        let newData = [...initData]
        if(sortData.sortby && sortData.sortway){
            newData.sort((a,b) => {
                const field = sortData.sortby
                const aValue = a[field] || a["fullName"]
                const bValue = b[field] || b["fullName"]
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
    }
    const handleSearch = (dataSearch)=>{
        let result = [...dataSearch]
        // Course
        if(index === 1){
            result = dataSearch.filter(data => {
                return data.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
                        formatDateTime(data.courseStartDate).includes(search) || 
                        formatDateTime(data.courseEndDate).includes(search) || 
                        formatDateTime(data.registStartDate).includes(search) || 
                        formatDateTime(data.registEndDate).includes(search) || 
                        formatDateTime(data.createdDate).includes(search) || 
                        data.price.toString().includes(search) ||
                        data.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            })            
        }
        // Center
        if(index === 2){
            result = dataSearch.filter(data => {
                return data.centerName?.toLowerCase().includes(search.toLowerCase()) ||
                        data.description?.toLowerCase().includes(search.toLowerCase()) ||
                        data.tags?.some(tag => tag.tagName.toLowerCase().includes(search.toLowerCase()))
            })            
        }
        // Teacher
        if(index === 3){
            result = dataSearch.filter(data => {
                return data.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                        data.teachingMajor?.toLowerCase().includes(search.toLowerCase()) ||
                        data.courseCount.toString().toLowerCase().includes(search.toLowerCase())                        
            })            
        }
        return result || []
    }
    
    // Search - Sort - Filter
    useEffect(()=>{
        let result = [...initData]
        if(search){
            result = handleSearch(result)
        }
        result = handleSort(result, dataSort)
        result = handleFilter(result) || []
        setData(result)
    }, [search, dataSort, dataFilter])
        
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
            <Text style={[commonStyles.title, {textAlign: "center"}]}>{namePage}</Text>
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
            {index === 1 ?
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item.idCourse}
                    renderItem={({item}) => <CardVirticalCourse data={item}/>}
                    style={styles.wrapList}
                    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
            : index === 3 ?
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item.idUser}
                    renderItem={({item}) => <CardVirticalTeacher data={item}/>}
                    style={styles.wrapList}
                    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
            : ""
            }
            <Modal
                visible={isOpenModal}
                animationType="fade"
            >
                {index === 1 ?
                    <FilterCourse 
                        dataSort={dataSort}
                        setDataSort={setDataSort}
                        dataFilter={dataFilter}
                        setDataFilter={setDataFilter}
                        onPressCancel={()=>setIsOpenModal(!isOpenModal)}
                    /> :
                    index === 2 ?
                    <FilterCenter
                        dataSort={dataSort}
                        setDataSort={setDataSort}
                        dataFilter={dataFilter}
                        setDataFilter={setDataFilter}
                        onPressCancel={()=>setIsOpenModal(!isOpenModal)}
                    /> :
                    <FilterTeacher
                        dataSort={dataSort}
                        setDataSort={setDataSort}
                        onPressCancel={()=>setIsOpenModal(!isOpenModal)}
                    /> 
                }
            </Modal>
            <View style={styles.bottom}>
                {indexPage>1 && 
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


const styles = StyleSheet.create({
    container:{
        padding: 16,
        backgroundColor: "#FAFAFA",
        flex: 1
    },
    wrapperSearch: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        borderRadius: 90,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
        marginVertical: 10
    },
    input:{
        fontSize: 16,
        width: "90%"
    },
    bottom:{
        position: "absolute",
        bottom: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 20,
        backgroundColor: "#FAFAFA",
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
        marginBottom: 40,
    },
    wrapLoading:{
        position: "absolute", 
        width: "100%",
        height: "100%",
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
    }
})
