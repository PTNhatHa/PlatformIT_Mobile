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

const renderCourse = ({item})=> <CardVirticalCourse data={item}/>
const renderCenter = ({item})=> <CardVirticalCenter data={item}/>
const renderTeacher = ({item})=> <CardVirticalTeacher data={item}/>
const renderAssignment = ({item})=> <CardVirticalAssignmentTeacher data={item}/>

const ViewAllRender = ({data = [], type})=>{
    // console.log(data);
    const [indexPage, setIndexPage] = useState(1)
    const [inputIndex, setInputIndex] = useState(1)
    const numberItem = 10
    const [currentData, setCurrentData] = useState(data.slice((indexPage-1)*numberItem, indexPage*numberItem))
    const inputRef = useRef(null)
    
    useEffect(() => {
        const newData = data.slice((indexPage - 1) * numberItem, indexPage * numberItem);
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
    const renderFlatlist = (renderItem)=>{
        if(type === "Center"){
            return(
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item.idCenter.toString()}
                    renderItem={renderItem}
                    style={styles.wrapList}
                    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
            )
        }if(type === "Teacher"){
            return(
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item.idUser.toString()}
                    renderItem={renderItem}
                    style={styles.wrapList}
                    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
            )
        }else{
            return(
                <FlatList
                    data={currentData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    style={styles.wrapList}
                    ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
                />
            )
        }
    }
    return(
        <View style={{ flex: 1}}>
            {renderFlatlist( 
                type === "Course" ? renderCourse : 
                type === "Center" ? renderCenter : 
                type === "Teacher" ? renderTeacher :
                type === "Assignment" ? renderAssignment : ""
            )}
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
const renderSceneStudent = ({ route, initCourse, dataCenter, dataTeacher})=>{
    switch(route.key){
        case 'first':
            return <ViewAllRender data={initCourse} type={"Course"}/>
        case 'second':
            return <ViewAllRender data={dataCenter} type={"Center"}/>
        case 'third':
            return <ViewAllRender data={dataTeacher} type={"Teacher"}/>
        default:
            return null;
    }
}
const renderSceneTeacher = ({ route, initCourse, dataCenter, dataTeacher, initAssignment})=>{
    switch(route.key){
        case 'first':
            return <ViewAllRender data={initCourse} type={"Course"}/>
        case 'second':
            return <ViewAllRender data={dataCenter} type={"Center"}/>
        case 'third':
            return <ViewAllRender data={dataTeacher} type={"Teacher"}/>
        case 'Fourth':
            return <ViewAllRender data={initAssignment} type={"Assignment"}/>
        default:
            return null;
    }
}
const renderTabBar = (props)=>{
    return(
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: COLORS.main, height: 4 }} // Custom line dưới tab
            style={{ backgroundColor: '#FAFAFA'}} // Background cho header
            labelStyle={{ color: COLORS.lightText, fontSize: 13, fontWeight: 'bold' }} // Style cho text của tab
            activeColor={COLORS.main}
            inactiveColor={COLORS.lightText}
        />
    )
}

const Course=[
    {
        id: 1,
        img: "",
        title: "Title1",
        listTags: [
            { id: 1, value: "Web developer"},
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        startRegist: new Date(),
        endRegist: new Date(),
        isRegist: true,
        cost: 120,
        costSale: 100
    },
    {
        id: 2,
        img: "",
        title: "Title2",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        startRegist: new Date(),
        endRegist: new Date(),
        isRegist: false,
        cost: 120,
        costSale: 100
    },
    {
        id: 3,
        img: "",
        title: "Title3",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        isRegist: true,
        cost: 120,
        costSale: 100
    },
    {
        id: 4,
        img: "",
        title: "Title4",
        listTags: [
            { id: 1, value: "Web developer"},
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        startRegist: new Date(),
        endRegist: new Date(),
        isRegist: true,
        cost: 120,
        costSale: 100
    },
    {
        id: 5,
        img: "",
        title: "Title5",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        startRegist: new Date(),
        endRegist: new Date(),
        isRegist: false,
        cost: 120,
        costSale: 100
    },
    {
        id: 6,
        img: "",
        title: "Title6",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        isRegist: true,
        cost: 120,
        costSale: 100
    },
]

const Assignment = [
    {
        id: 1,
        title: "Title",
        img: "",
        nameCourse: "OOP",
        due: new Date(),
        duration: 45,
        type: "Test",
        isPublish: true,
        submitted: 0.8
    },
    {
        id: 2,
        title: "Title",
        img: "",
        nameCourse: "OOP",
        due: new Date(),
        duration: 45,
        type: "Test",
        isPublish: false,
        submitted: 0
    },
    {
        id: 3,
        title: "Title",
        img: "",
        nameCourse: "OOP",
        due: new Date(),
        duration: null,
        type: "Exercise",
        isPublish: true,
        submitted: 0.9
    },
  ]

export const ScreenViewAll = ({ initAssignment = Assignment, route})=>{
    const initialTab = route.params?.initTab || 0
    const isTeacher = route.params?.isTeacher || false

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState()
    const [index, setIndex] = useState(initialTab);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [routes, setRoutes] = useState([])

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

    const handleSearch = async (txt, index)=>{
        setSearch(txt)
        let newData = []
        if(index === 1){
            newData = initCenter.filter(center => {
                return Object.values(center).some(item =>
                    item && item.toString().toLowerCase().includes(txt.toLowerCase())
                )
            })
            setDataCenter(newData)
            await AsyncStorage.setItem('searchCenter', txt)
        }
        if(index === 2){
            newData = initTeacher.filter(center => {
                return Object.values(center).some(item =>
                    item && item.toString().toLowerCase().includes(txt.toLowerCase())
                )
            })
            setDataTeacher(newData)
            await AsyncStorage.setItem('searchTeacher', txt)
        }
    }
    
    const getAllCard = async ()=>{
        try {
            const responseCenter = await getAllCenterCards()
            const responseTeacher = await getAllTeacherCards()
            setInitCenter(responseCenter)
            setInitTeacher(responseTeacher)
            setDataCenter(responseCenter)
            setDataTeacher(responseTeacher)
        } catch (error) {
            console.log("Error: ", error);
        } finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(!isTeacher){
            setRoutes([
                { key: 'first', title: 'Course' },
                { key: 'second', title: 'Center' },
                { key: 'third', title: 'Teacher' },
              ])
        } else{
            setRoutes([
                { key: 'first', title: 'Course' },
                { key: 'second', title: 'Center' },
                { key: 'third', title: 'Teacher' },
                { key: 'Fourth', title: 'Assign' },
              ])
        }

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
                    onChangeText={(value)=>handleSearch(value, index)}
                />
                <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                    <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                </TouchableOpacity>
            </View>
            {isTeacher === true ?
                <TabView
                    navigationState={{index, routes}}
                    renderScene={({route})=> renderSceneTeacher({ route, initCourse, dataCenter, dataTeacher, initAssignment})}
                    onIndexChange={setIndex}
                    renderTabBar={renderTabBar}
                />
            :
                <TabView
                    navigationState={{index, routes}}
                    renderScene={({route})=> renderSceneStudent({ route, initCourse, dataCenter, dataTeacher})}
                    onIndexChange={setIndex}
                    renderTabBar={renderTabBar}
                />
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
        shadowRadius: 5,

        backgroundColor: "white",
        borderRadius: 90,
        paddingHorizontal: 16,
        paddingVertical: 8,
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
    }
})
