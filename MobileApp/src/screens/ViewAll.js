import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { CardVirticalCenter, CardVirticalCourse, CardVirticalTeacher } from "../components/CardVertical"
import { COLORS } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useState, useEffect, useRef } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

const renderCourse = ({item})=> <CardVirticalCourse data={item}/>
const renderCenter = ({item})=> <CardVirticalCenter data={item}/>
const renderTeacher = ({item})=> <CardVirticalTeacher data={item}/>

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
                renderTeacher
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
const renderScene = ({ route, initCourse, initCenter, initTeacher})=>{
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

    }
})