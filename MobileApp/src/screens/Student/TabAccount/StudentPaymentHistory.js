import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../../../utils/constants"
import DefaultImg from "../../../../assets/images/DefaultImg.png"
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/utils";
import { FilterPayment } from "../../../components/Filter";

const initData = [
    {
        idTransaction: 1,
        idCourse: 1,
        nameCourse: ".NET",
        avatarCourse: "https://i.pinimg.com/736x/28/d0/cd/28d0cd677f1b384050fa39111809f7e3.jpg",
        createDate: new Date(),
        cost: 300000
    },
    {
        idTransaction: 2,
        idCourse: 2,
        nameCourse: "Agile",
        avatarCourse: null,
        createDate: new Date(),
        cost: 280000
    },
    {
        idTransaction: 3,
        idCourse: 3,
        nameCourse: "Scrum",
        avatarCourse: null,
        createDate: new Date(),
        cost: 20000
    },
    {
        idTransaction: 4,
        idCourse: 1,
        nameCourse: ".NET",
        avatarCourse: "https://i.pinimg.com/736x/28/d0/cd/28d0cd677f1b384050fa39111809f7e3.jpg",
        createDate: new Date(),
        cost: 300000
    },
    {
        idTransaction: 5,
        idCourse: 2,
        nameCourse: "Agile",
        avatarCourse: null,
        createDate: new Date(),
        cost: 280000
    },
    {
        idTransaction: 6,
        idCourse: 3,
        nameCourse: "Scrum",
        avatarCourse: null,
        createDate: new Date(),
        cost: 20000
    },
]
export const StudentPaymentHistory = () =>{
    const [search, setSearch] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [data, setData] = useState([...initData]);
    const [currentData, setCurrentData] = useState([...initData]);
    const [dataSort, setDataSort] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const numberItem = 5

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

    const handleSort = (initData)=>{
        let newData = [...initData]
        if(dataSort.sortby && dataSort.sortway){
            newData.sort((a,b) => {
                const field = dataSort.sortby
                const aValue = a[field]
                const bValue = b[field]
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return dataSort?.sortway === 1 ? aValue - bValue : bValue - aValue;
                }
                if(dataSort.sortway === 1){
                    //Asc
                    if(aValue === null) return -1
                    if(bValue === null) return 1
                    if(aValue === null && bValue === null) return 0
                    return aValue?.localeCompare(bValue)
                }
                if(dataSort.sortway === 2){
                    //Desc
                    if(aValue === null) return 1
                    if(bValue === null) return -1
                    if(aValue === null && bValue === null) return 0
                    return bValue?.localeCompare(aValue);
                }
                return 0
            })
        }
        return newData || []
    }

    const handleSearch = (dataSearch)=>{
        let result = [...dataSearch]
        result = dataSearch.filter(item => {
            return item.nameCourse?.toLowerCase().includes(search.toLowerCase())                    
        })   
        return result || []
    }
    useEffect(()=>{
        let result = [...data]
        if(search){
            result = handleSearch(result)
        }
        if(dataSort){
            result = handleSort(result)
        }
        setCurrentData(result)
    }, [search, dataSort])

    return(
        <View style={styles.container}>
            <View style={styles.wrapperSearch}>
                <TextInput
                    value={search}
                    style={styles.input}
                    placeholder={"Search"}
                    onChangeText={(value)=>setSearch(value)}
                />
                <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                    <Feather name="sliders" size={24} color={COLORS.stroke} style={{ transform: [{ rotate: '-90deg' }] }}/>
                </TouchableOpacity>
            </View>
            {getPageData().length > 0 &&
                getPageData().map(trans => 
                    <View style={styles.wrapCard} key={trans.idTransaction}>
                        <Image source={trans.avatarCourse ? {uri: trans.avatarCourse} : DefaultImg} style={styles.img}/>
                        <View style={styles.wrapContent}>
                            <Text style={styles.title} numberOfLines={1}>{trans.nameCourse}</Text>
                            <Text style={styles.textGray14}>Pay on {formatDateTime(trans.createDate, true)}</Text>
                            <Text style={styles.textCost}>
                                -{trans.cost.toLocaleString('vi-VN')}
                                <Text style={styles.textUnderline}>đ</Text>
                            </Text>
                        </View>
                    </View>
                )
            }
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
            <Modal
                visible={isOpenModal}
                animationType="fade"
            >
                <FilterPayment 
                    onPressCancel={()=>setIsOpenModal(false)} 
                    dataSort={dataSort} 
                    setDataSort={setDataSort}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        backgroundColor: "#FAFAFA"
    },
    wrapCard: {
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        flexDirection: "row",
        columnGap: 10,
        backgroundColor: "white",
        marginBottom: 4
    },
    img: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 4,
        backgroundColor: COLORS.lightText,
        resizeMode: "cover",
    },
    title:{
        fontSize: 16,
        fontWeight: "bold",
    },
    textGray14:{
        fontSize: 14,
        color: COLORS.stroke,
        flex: 1
    },
    textCost:{
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.red,
        textAlign: "right",
        flex: 1
    },
    wrapContent:{
        flex: 1
    },
    textUnderline:{
        textDecorationLine: "underline"
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
        bottom: 10,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        columnGap: 20,
        backgroundColor: "#FAFAFA",
        left: 16
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
})