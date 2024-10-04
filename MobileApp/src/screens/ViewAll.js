import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { CardVirticalCenter, CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical"
import { COLORS } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

const initCourse=[
    {
        id: 1,
        img: "",
        title: "Title",
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
        title: "Title",
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
        title: "Title",
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

const initCenter=[
    {
        id: 1,
        img: "",
        title: "Title",
        listTags: [
            { id: 1, value: "Web developer"},
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
    },
    {
        id: 2,
        img: "",
        title: "Title",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
    },
    {
        id: 3,
        img: "",
        title: "Title",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
    },
]

const initTeacher=[
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
const initAssignment = [
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
const ViewAllCourse = ({data = initCourse})=>{
    return(
        <View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item})=>
                    <CardVirticalCourse data={item}/>
                }
            />
        </View>
    )
}
const ViewAllCenter = ({data = initCenter})=>{
    return(
        <View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item})=>
                    <CardVirticalCenter data={item}/>
                }
            />
        </View>
    )
}
const ViewAllTeacher = ({data = initTeacher})=>{
    return(
        <View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item})=>
                    <CardVirticalTeacher data={item}/>
                }
            />
        </View>
    )
}

const renderScene = ({ route, initCourse, initCenter, initTeacher})=>{
    switch(route.key){
        case 'first':
            return <ViewAllCourse data={initCourse}/>
        case 'second':
            return <ViewAllCenter data={initCenter}/>
        case 'third':
            return <ViewAllTeacher data={initTeacher}/>
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
            labelStyle={{ color: COLORS.lightText, fontSize: 16, fontWeight: 'bold' }} // Style cho text của tab
            activeColor={COLORS.main}
            inactiveColor={COLORS.lightText}
        />
    )
}
export const ViewAll = ({ initCourse, initCenter, initTeacher})=>{
    const [search, setSearch] = useState()
    const [index, setIndex] = useState(0);
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
                renderScene={({route})=> renderScene({ route, initCourse, initCenter, initTeacher})}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />
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
})