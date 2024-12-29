import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useRef } from "react";
import { FilterCenter, FilterCourse, FilterTeacher } from "../components/Filter";
import { formatDateTime } from "../utils/utils";
import { CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical";

export const ViewAllFromDetail = ({route, myCourse = [], role = 0})=>{
    const initData = route?.params?.initData || myCourse || []
    const index = route?.params?.index || 1
    const namePage = route?.params?.namePage || ""
    const [data, setData] = useState(initData)
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false);

    const [dataSort, setDataSort] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);

    const [currentPage, setCurrentPage] = useState(1)
    const numberItem = 10
    const [currentData, setCurrentData] = useState(data?.slice((currentPage-1)*numberItem, currentPage*numberItem) || [])
    
    const getPageData = () => {
        return currentData.slice((currentPage-1) * numberItem, currentPage * numberItem);
    };

    const getPagination = () => {
        const totalPages = Math.ceil(currentData.length / numberItem);
        if (totalPages <= 5) {
        // Show all pages if there are 5 or fewer
        return Array.from({ length: totalPages }, (_, index) => index + 1);
        } else {
        // Logic for more than 5 pages
        if (currentPage <= 3) {
            // Show first few pages if current page is near the start
            return [1, 2, 3, 4, "...", totalPages];
        } else if (currentPage >= totalPages - 2) {
            // Show last few pages if current page is near the end
            return [
                1,
                "...",
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        } else {
            // Show current page in the middle with surrounding pages
            return [
                1,
                "...",
                currentPage - 1,
                currentPage,
                currentPage + 1,
                "...",
                totalPages,
            ];
        }
        }
    }

    useEffect(() => {
        const newData = data.slice((currentPage - 1) * numberItem, currentPage * numberItem) || [];
        setCurrentData(newData);
    }, [data, currentPage]);
    
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
                        if(dataFilter.startRegist && new Date(item.registStartDate) < new Date(dataFilterCourse.startRegist)){
                            return false
                        }
                        if(dataFilter.endRegist && new Date(item.registEndDate) > new Date(dataFilterCourse.endRegist)){
                            return false
                        }
                        // startDuration - endDuration
                        if(dataFilter.startDuration && new Date(item.courseStartDate) < new Date(dataFilterCourse.startDuration)){
                            return false
                        }
                        if(dataFilter.endDuration && new Date(item.courseEndDate) > new Date(dataFilterCourse.endDuration)){
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
                const aValue = field === "price" ? (a["discountedPrice"] ? a["discountedPrice"] : (a[field] ? a[field] : parseInt(0))) : (a[field] || a["fullName"])
                const bValue = field === "price" ? (b["discountedPrice"] ? b["discountedPrice"] : (b[field] ? b[field] : parseInt(0))) : (b[field] || b["fullName"])
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortData?.sortway === 1 ? aValue - bValue : bValue - aValue;
                }
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
                        data.price?.toString().includes(search) ||
                        data.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            })            
        } else{
            result = dataSearch.filter(data => {
                return data.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                        data.teachingMajor?.toLowerCase().includes(search.toLowerCase()) ||
                        data.courseCount?.toString().toLowerCase().includes(search.toLowerCase())                        
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
        if(dataSort){
            result = handleSort(result, dataSort)
        }
        if(dataFilter){
            result = handleFilter(result) || []
        }
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
            {myCourse.length === 0 &&
                <Text style={[commonStyles.title, {textAlign: "center"}]}>{namePage}</Text>
            }
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
                    data={getPageData()}
                    keyExtractor={(item) => item.idCourse}
                    renderItem={({item}) => <CardVirticalCourse data={item} role={role} isUnPin={true}/>}
                    style={styles.wrapList}
                    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
            : 
                <FlatList
                    data={getPageData()}
                    keyExtractor={(item) => item.idUser}
                    renderItem={({item}) => <CardVirticalTeacher data={item}/>}
                    style={styles.wrapList}
                    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
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
                        isStudent={role === 2}
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
                {getPagination().map(page => 
                    page !== "..." ? 
                    <TouchableOpacity 
                        style={[styles.wrapNumber, page === currentPage && {backgroundColor: COLORS.main}]} 
                        onPress={()=>setCurrentPage(page)}
                        key={page}
                    >
                        <Text style={[styles.bottomNumber, page === currentPage && {color: "white"}]}>{page}</Text>
                    </TouchableOpacity>
                    :
                    <View style={styles.wrapNumber} key={page}>
                        <Text style={styles.bottomNumber}>{page}</Text>
                    </View>
                )}
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
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 4,
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
        marginLeft: 16
    },
    bottomNumber:{
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },
    wrapNumber:{
        width: 32,
        height: 32,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
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
