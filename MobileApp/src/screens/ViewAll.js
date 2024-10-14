import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { CardVirticalAssignmentTeacher, CardVirticalCenter, CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useRef } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import { ButtonGreen, ButtonWhite } from "../components/Button";
import { Tag } from "../components/Tag";
import { DateTimePickerComponent } from "../components/DateTimePicker";
import { RadioBtn } from "../components/RadioBtn";
import { FilterCourse } from "../components/Filter";

const renderCourse = ({item})=> <CardVirticalCourse data={item}/>
const renderCenter = ({item})=> <CardVirticalCenter data={item}/>
const renderTeacher = ({item})=> <CardVirticalTeacher data={item}/>
const renderAssignment = ({item})=> <CardVirticalAssignmentTeacher data={item}/>

const ViewAllRender = ({data = [], type})=>{
    // console.log(data);
    const [indexPage, setIndexPage] = useState(1)
    const [inputIndex, setInputIndex] = useState(1)
    const numberItem = 2
    const [currentData, setCurrentData] = useState(data.slice((indexPage-1)*numberItem, indexPage*numberItem))
    const inputRef = useRef(null)
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
        return(
            <FlatList
                data={currentData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
            />
        )
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
const renderSceneStudent = ({ route, initCourse, initCenter, initTeacher})=>{
    switch(route.key){
        case 'first':
            return <ViewAllRender data={initCourse} type={"Course"}/>
        case 'second':
            return <ViewAllRender data={initCenter} type={"Center"}/>
        case 'third':
            return <ViewAllRender data={initTeacher} type={"Teacher"}/>
        default:
            return null;
    }
}
const renderSceneTeacher = ({ route, initCourse, initCenter, initTeacher, initAssignment})=>{
    switch(route.key){
        case 'first':
            return <ViewAllRender data={initCourse} type={"Course"}/>
        case 'second':
            return <ViewAllRender data={initCenter} type={"Center"}/>
        case 'third':
            return <ViewAllRender data={initTeacher} type={"Teacher"}/>
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
            style={{ backgroundColor: 'white'}} // Background cho header
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

const Center=[
    {
        id: 1,
        img: "",
        title: "Center",
        listTags: [
            { id: 1, value: "Web developer"},
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
    },
    {
        id: 2,
        img: "",
        title: "Center",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
    },
    {
        id: 3,
        img: "",
        title: "Center",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
    },
]

const Teacher=[
    {
        id: 1,
        img: "",
        name: "Nhatha",
        description: "Description"
    },
    {
        id: 2,
        img: "",
        name: "Taho",
        description: "Description"
    },
    {
        id: 3,
        img: "",
        name: "Hyy",
        description: "Description"
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

export const StudentViewAll = ({ initCourse = Course, initCenter = Center, initTeacher = Teacher, route})=>{
    const initialTab = route.params?.initTab || 0
    const [search, setSearch] = useState()
    const [index, setIndex] = useState(initialTab);
    const [routes] = useState([
      { key: 'first', title: 'Course' },
      { key: 'second', title: 'Center' },
      { key: 'third', title: 'Teacher' },
    ]);
    return(
        <View style={styles.container}>
            <View style={styles.wrapperSearch}>
                <TextInput
                    value={search}
                    style={styles.input}
                    placeholder={"Search"}
                    onChangeText={(v)=>setSearch(v)}
                />
                <TouchableOpacity>
                    <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                </TouchableOpacity>
            </View>
            <TabView
                navigationState={{index, routes}}
                renderScene={({route})=> renderSceneStudent({ route, initCourse, initCenter, initTeacher})}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />
            <Modal>

            </Modal>
        </View>
    )
}

export const TeacherViewAll = ({ initCourse = Course, initCenter = Center, initTeacher = Teacher, initAssignment = Assignment, route})=>{
    const initialTab = route?.params?.initTab || 0
    const [search, setSearch] = useState()
    const [index, setIndex] = useState(initialTab);
    const [isOpenModal, setIsOpenModal] = useState(true);
    const [dataSort, setDataSort] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [routes] = useState([
      { key: 'first', title: 'Course' },
      { key: 'second', title: 'Center' },
      { key: 'third', title: 'Teacher' },
      { key: 'Fourth', title: 'Assign' },
    ]);
    return(
        <View style={styles.container}>
            <View style={styles.wrapperSearch}>
                <TextInput
                    value={search}
                    style={styles.input}
                    placeholder={"Search"}
                    onChangeText={(v)=>setSearch(v)}
                />
                <TouchableOpacity onPress={()=>setIsOpenModal(true)}>
                    <Feather name="sliders" size={24} color={COLORS.stroke}  style={{ transform: [{ rotate: '-90deg' }] }}/>
                </TouchableOpacity>
            </View>
            <TabView
                navigationState={{index, routes}}
                renderScene={({route})=> renderSceneTeacher({ route, initCourse, initCenter, initTeacher, initAssignment})}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />
            <Modal
                visible={isOpenModal}
                animationType="fade"
            >
                {index === 0 &&
                    <FilterCourse 
                        dataSort={dataSort}
                        setDataSort={setDataSort}
                        dataFilter={dataFilter}
                        setDataFilter={setDataFilter}
                        onPressCancel={()=>setIsOpenModal(!isOpenModal)}
                    />
                }
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 16,
        backgroundColor: "white",
        flex: 1
    },
    wrapperSearch: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center"
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
        alignItems: "center",
        columnGap: 20
    },
    wrapPageNumber:{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    pageNumber:{
        // paddingVertical: 6,
        // paddingHorizontal: 12,
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
})
