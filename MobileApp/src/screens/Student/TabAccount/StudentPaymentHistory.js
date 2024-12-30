import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../../../utils/constants"
import DefaultImg from "../../../../assets/images/DefaultImg.png"
import Feather from '@expo/vector-icons/Feather';
import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "../../../utils/utils";
import { FilterPayment } from "../../../components/Filter";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getAllPaymentOfStudent } from "../../../services/payment";
import { useUser } from "../../../contexts/UserContext";

const initData = [
    {
        idPayment: 1,
        idCourse: 1,
        courseName: ".NET",
        courseAvatar: "https://i.pinimg.com/736x/28/d0/cd/28d0cd677f1b384050fa39111809f7e3.jpg",
        paymentDate: new Date(),
        cost: 300000
    },
    {
        idPayment: 2,
        idCourse: 2,
        courseName: "Agile",
        courseAvatar: null,
        paymentDate: new Date(),
        cost: 280000
    },
    {
        idPayment: 3,
        idCourse: 3,
        courseName: "Scrum",
        courseAvatar: null,
        paymentDate: new Date(),
        cost: 20000
    },
    {
        idPayment: 4,
        idCourse: 1,
        courseName: ".NET",
        courseAvatar: "https://i.pinimg.com/736x/28/d0/cd/28d0cd677f1b384050fa39111809f7e3.jpg",
        paymentDate: new Date(),
        cost: 300000
    },
    {
        idPayment: 5,
        idCourse: 2,
        courseName: "Agile",
        courseAvatar: null,
        paymentDate: new Date(),
        cost: 280000
    },
    {
        idPayment: 6,
        idCourse: 3,
        courseName: "Scrum",
        courseAvatar: null,
        paymentDate: new Date(),
        cost: 20000
    },
]
export const StudentPaymentHistory = () =>{
    const {state} = useUser()
    const [search, setSearch] = useState(null)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [data, setData] = useState([...initData]);
    const [currentData, setCurrentData] = useState([...initData]);
    const [dataSort, setDataSort] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const numberItem = 5
    const navigation = useNavigation()

    const fetchData = async()=>{
        try {
            const response = await getAllPaymentOfStudent(state.idUser)
            if(response){
                setData(response)
                setCurrentData(response)
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    );

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
                const aValue = field === "price" ? (a["discountedPrice"] ? a["discountedPrice"] : (a[field] ? a[field] : parseInt(0))) : (a[field])
                const bValue = field === "price" ? (b["discountedPrice"] ? b["discountedPrice"] : (b[field] ? b[field] : parseInt(0))) : (b[field])
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
            return item.courseName?.toLowerCase().includes(search.toLowerCase())                    
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
                <FlatList
                    data={getPageData()}
                    keyExtractor={(item) => item.idPayment}
                    renderItem={({item}) => 
                        <TouchableOpacity 
                            style={styles.wrapCard} 
                            key={item?.idPayment} 
                            onPress={()=> navigation.navigate("My Course", {
                                screen: "My Course",
                                params: {
                                    idCourse: item.idCourse,
                                    role: 2
                                }
                            })}
                        >
                            <Image source={item?.courseAvatar ? {uri: item?.courseAvatar} : DefaultImg} style={styles.img}/>
                            <View style={styles.wrapContent}>
                                <Text style={styles.title} numberOfLines={1}>{item?.courseName}</Text>
                                <Text style={styles.textGray14}>Payment date: {formatDateTime(item?.paymentDate, true, true)}</Text>
                                <View style={styles.wrapCost}>
                                    <Text style={styles.costSale}>
                                        {item.discountedPrice ? item.discountedPrice?.toLocaleString('vi-VN') : item.price?.toLocaleString('vi-VN')}
                                        <Text style={{textDecorationLine: "underline"}}>đ</Text>    
                                    </Text>
                                    {item.discountedPrice && 
                                        <Text style={styles.cost}>
                                            {item.price?.toLocaleString('vi-VN')}
                                            <Text style={{textDecorationLine: "underline"}}>đ</Text>  
                                        </Text>
                                    }
                                </View>
                                {/* <Text style={styles.textCost}> */}
                                    {/* -{item?.cost?.toLocaleString('vi-VN')}
                                    <Text style={styles.textUnderline}>đ</Text> */}
                                {/* </Text> */}
                            </View>
                        </TouchableOpacity>
                    }
                    style={styles.wrapList}
                />
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
    wrapList: {
        marginBottom: 35,
    },
    wrapCost:{
        flexDirection: "row",
        alignItems: "flex-start",
        columnGap: 2,
        justifyContent: "flex-end",
        flex: 1,
    },
    costSale:{
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.secondMain,
        alignSelf: "flex-end"
    },
    cost: {
        fontSize: 10,
        textDecorationLine: 'line-through',
        color: COLORS.stroke,
    },
})