import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import { ButtonGreen, ButtonWhite } from "../components/Button";
import { DateTimePickerComponent } from "../components/DateTimePicker";
import { RadioBtn } from "../components/RadioBtn";
import { getAlltag } from "../services/tag";

export const FilterCourse = ({
    dataSort=[], setDataSort=()=>{}, 
    dataFilter=[], setDataFilter=()=>{},
    onPressCancel
})=>{
    // Sort
    const [sortby1, setsortby1] = useState(dataSort.sortby || 0)
    const [sortby2, setsortby2] = useState(dataSort.sortway || 0)
    const listSortby1 = [
        { label: "None", value: 0},
        { label: "Name Course", value: "courseTitle"},
        { label: "Price", value: "price"},
        { label: "Rate", value: "rate"},
    ]
    const listSortby2 = [
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
    ]

    // Filter
    const [allTags, setAllTags] = useState([])
    const [listTags, setListTags] = useState(dataFilter.tags || [])
    const [startRegist, setStartRegist] = useState(dataFilter.startRegist || null)
    const [endRegist, setEndRegist] = useState(dataFilter.endRegist || null)
    const [startDuration, setStartDuration] = useState(dataFilter.startDuration || null)
    const [endDuration, setEndDuration] = useState(dataFilter.endDuration || null)
    const [startCost, setStartCost] = useState(dataFilter.startCost || 0)
    const [endCost, setEndCost] = useState(dataFilter.endCost || 0)
    const [selectType, setSelectType] = useState(dataFilter.courseType || "All")
    const clearAll = ()=>{
        setsortby1(0)
        setsortby2(0)
        setListTags([])
        setStartRegist(null)
        setEndRegist(null)
        setStartDuration(null)
        setEndDuration(null)
        setStartCost(0)
        setEndCost(0)
        setSelectType("All")
        setDataSort({
            sortby: 0,
            sortway: 0
        })
        setDataFilter({
            tags: [],
            courseType: "All",
            startRegist: null,
            endRegist: null,
            startDuration: null,
            endDuration: null,
            startCost: 0,
            endCost: 0
        })
        onPressCancel()

    }
    useEffect(()=>{
        const getAllTag = async ()=>{
            try{
                const response = await getAlltag()
                const data = response.map(item => {
                    return{
                        label: item.tagName, 
                        value: item.idTag
                    }
                })
                setAllTags(data)
            } catch(e){

            }
        }
        getAllTag()
    }, [])
    const handleChooseTag = (v)=>{
        const selectTag = allTags.find(item => item.value === v)
        if(!listTags.some(item => item.value === v) && selectTag){
            setListTags([...listTags, selectTag])
        }
    }
    const handleDeleteTag = (v)=>{
        const newList = listTags.filter(item => item.value !== v)
        setListTags(newList)
    }
    const handleSave =()=>{
        setDataSort({
            sortby: sortby1,
            sortway: sortby2
        })
        setDataFilter({
            tags: listTags,
            courseType: selectType,
            startRegist: startRegist,
            endRegist: endRegist,
            startDuration: startDuration,
            endDuration: endDuration,
            startCost: startCost,
            endCost: endCost
        })
        onPressCancel()
    }
    const handleClose =()=>{
        onPressCancel()
    }
    return(
        <View style={stylesFilter.wrapFilter}>
            <View style={stylesFilter.innerFilter}>
                {/* Sort */}
                <TouchableOpacity style={stylesFilter.btnClose} onPress={handleClose}>
                    <AntDesign name="close" size={24} color={COLORS.secondMain} />
                </TouchableOpacity>
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Sort</Text>
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Sort by</Text>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby1}
                                onValueChange={(v)=> setsortby1(v)}
                                value={sortby1}
                            />
                        </View>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby2}
                                onValueChange={(v)=> setsortby2(v)}
                                value={sortby2}
                            />
                        </View>
                    </View>                                                      
                </View>

                {/* Filter */}
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Filter</Text>
                    {/* Tags */}
                    <View style={{ rowGap: 2}}>
                        <View style={stylesFilter.field}>
                            <Text style={stylesFilter.smallTitle}>Tags</Text>
                            <View style={[stylesFilter.comboBox, { width: "85%"}]}>
                                <RNPickerSelect
                                    items={allTags}
                                    onValueChange={(v)=> handleChooseTag(v)}
                                />
                            </View>
                        </View>  
                        <View style={stylesFilter.tags}>
                            {listTags?.map(item => 
                                <View style={stylesFilter.wrapTag} key={item.value}>
                                    <Text style={stylesFilter.textTag}>{item.label}</Text>
                                    <TouchableOpacity style={stylesFilter.close} onPress={()=>handleDeleteTag(item.value)}>
                                        <AntDesign name="close" size={18} color={COLORS.main} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Price */}
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Price</Text>
                        <View style={stylesFilter.field}>
                            <View style={[stylesFilter.wrapPrice, { marginRight: 16}]}>
                                <TextInput  
                                    keyboardType="numeric" 
                                    placeholder="0"
                                    value={startCost}
                                    onChangeText={(v)=>setStartCost(v)}
                                />
                                <Feather name="dollar-sign" size={20} color="black" />
                            </View>
                            <AntDesign name="arrowright" size={16} color="black" />
                            <View style={[stylesFilter.wrapPrice, { marginLeft: 16}]}>
                                <TextInput 
                                    keyboardType="numeric" 
                                    placeholder="0"
                                    value={endCost}
                                    onChangeText={(v)=>setEndCost(v)}
                                />
                                <Feather name="dollar-sign" size={20} color="black" />
                            </View>
                            
                        </View>
                    </View>

                    {/* Course type */}
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Course type</Text>
                        <RadioBtn label="All" selected={selectType === "All"} onPress={()=>setSelectType("All")}/>
                        <RadioBtn label="Limit" selected={selectType === "Limit"} onPress={()=>setSelectType("Limit")}/>
                        <RadioBtn label="Unlimit" selected={selectType === "Unlimit"} onPress={()=>setSelectType("Unlimit")}/>
                    </View>

                    { selectType === "Limit" &&
                        <>
                            {/* Registration date */}
                            <View style={stylesFilter.field2}>
                                <Text style={stylesFilter.smallTitle}>Registration date</Text>
                                <View style={stylesFilter.field}>
                                    <DateTimePickerComponent width="300" value={startRegist} setValue={setStartRegist}/>
                                    <AntDesign name="arrowright" size={16} color="black" />
                                    <DateTimePickerComponent width="300" value={endRegist} setValue={setEndRegist}/>
                                </View>
                            </View>

                            {/* Course duration */}
                            <View style={stylesFilter.field2}>
                                <Text style={stylesFilter.smallTitle}>Course duration</Text>
                                <View style={stylesFilter.field}>
                                    <DateTimePickerComponent width="200" value={startDuration} setValue={setStartDuration}/>
                                    <AntDesign name="arrowright" size={16} color="black" />
                                    <DateTimePickerComponent width="200" value={endDuration} setValue={setEndDuration}/>
                                </View>
                            </View>
                        </>
                    }

                    <View style={stylesFilter.bottom}>
                        <ButtonWhite title={"Clear"} action={clearAll}/>
                        <ButtonGreen title={"Save"} action={handleSave}/>
                    </View>                                                         
                </View>

            </View>
        </View>
    )
}

export const FilterCenter = ({
    dataSort=[], setDataSort=()=>{}, 
    dataFilter=[], setDataFilter=()=>{},
    onPressCancel
})=>{
    // Sort
    const [sortby1, setsortby1] = useState(dataSort.sortby || 0)
    const [sortby2, setsortby2] = useState(dataSort.sortway || 0)
    const listSortby1 = [
        { label: "None", value: 0},
        { label: "Name Center", value: "centerName"},
        { label: "Number of Course", value: "coursesCount"},
    ]
    const listSortby2 = [
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
    ]

    // Filter
    const [allTags, setAllTags] = useState([])
    const [listTags, setListTags] = useState(dataFilter.tags || [])

    const clearAll = ()=>{
        setsortby1(0)
        setsortby2(0)
        setListTags([])
        setDataSort({
            sortby: 0,
            sortway: 0
        })
        setDataFilter({
            tags: [],
        })
        onPressCancel()
    }
    useEffect(()=>{
        const getAllTag = async ()=>{
            try{
                const response = await getAlltag()
                const data = response.map(item => {
                    return{
                        label: item.tagName, 
                        value: item.idTag
                    }
                })
                setAllTags(data)
            } catch(e){

            }
        }
        getAllTag()
    }, [])
    const handleChooseTag = (v)=>{
        const selectTag = allTags.find(item => item.value === v)
        if(!listTags.some(item => item.value === v) && selectTag){
            setListTags([...listTags, selectTag])
        }
    }
    const handleDeleteTag = (v)=>{
        const newList = listTags.filter(item => item.value !== v)
        setListTags(newList)
    }
    const handleSave =()=>{
        setDataSort({
            sortby: sortby1,
            sortway: sortby2
        })
        setDataFilter({
            tags: listTags,
        })
        onPressCancel()
    }
    return(
        <View style={stylesFilter.wrapFilter}>
            <View style={stylesFilter.innerFilter}>
                {/* Sort */}
                <TouchableOpacity style={stylesFilter.btnClose} onPress={onPressCancel}>
                    <AntDesign name="close" size={24} color={COLORS.secondMain} />
                </TouchableOpacity>
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Sort</Text>
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Sort by</Text>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby1}
                                onValueChange={(v)=> setsortby1(v)}
                                value={sortby1}
                            />
                        </View>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby2}
                                onValueChange={(v)=> setsortby2(v)}
                                value={sortby2}
                            />
                        </View>
                    </View>                                                         
                </View>

                {/* Filter */}
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Filter</Text>
                    {/* Tags */}
                    <View style={{ rowGap: 2}}>
                        <View style={stylesFilter.field}>
                            <Text style={stylesFilter.smallTitle}>Tags</Text>
                            <View style={[stylesFilter.comboBox, { width: "80%"}]}>
                                <RNPickerSelect
                                    items={allTags}
                                    onValueChange={(v)=> handleChooseTag(v)}
                                />
                            </View>
                        </View>  
                        <View style={stylesFilter.tags}>
                            {listTags.map(item => 
                                <View style={stylesFilter.wrapTag} key={item.value}>
                                    <Text style={stylesFilter.textTag}>{item.label}</Text>
                                    <TouchableOpacity style={stylesFilter.close} onPress={()=>handleDeleteTag(item.value)}>
                                        <AntDesign name="close" size={18} color={COLORS.main} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={stylesFilter.bottom}>
                        <ButtonWhite title={"Clear"} action={clearAll}/>
                        <ButtonGreen title={"Save"} action={handleSave}/>
                    </View>                                                         
                </View>

            </View>
        </View>
    )
}

export const FilterTeacher = ({
    dataSort=[], setDataSort=()=>{}, 
    onPressCancel
})=>{
    // Sort
    const [sortby1, setsortby1] = useState(dataSort.sortby || 0)
    const [sortby2, setsortby2] = useState(dataSort.sortway || 0)
    const listSortby1 = [
        { label: "None", value: 0},
        { label: "Name", value: "name"},
        { label: "Number of Course", value: "coursesCount"},
    ]
    const listSortby2 = [
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
    ]
    const clearAll = ()=>{
        setsortby1(0)
        setsortby2(0)
        setDataSort({
            sortby: 0,
            sortway: 0
        })
        onPressCancel()
    }

    const handleSort =()=>{
        setDataSort({
            sortby: sortby1,
            sortway: sortby2
        })
        onPressCancel()
    }
    return(
        <View style={stylesFilter.wrapFilter}>
            <View style={stylesFilter.innerFilter}>
                {/* Sort */}
                <TouchableOpacity style={stylesFilter.btnClose} onPress={onPressCancel}>
                    <AntDesign name="close" size={24} color={COLORS.secondMain} />
                </TouchableOpacity>
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Sort</Text>
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Sort by</Text>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby1}
                                onValueChange={(v)=> setsortby1(v)}
                                value={sortby1}
                            />
                        </View>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby2}
                                onValueChange={(v)=> setsortby2(v)}
                                value={sortby2}
                            />
                        </View>
                    </View>  
                    <View style={stylesFilter.bottom}>
                        <ButtonWhite title={"Clear"} action={clearAll}/>
                        <ButtonGreen title={"Save"} action={handleSort}/>
                    </View>                                                       
                </View>
            </View>
        </View>
    )
}


const stylesFilter = StyleSheet.create({
    wrapFilter: {
        position: "absolute",
        backgroundColor: 'rgba(117, 117, 117, 0.9)',
        width: "100%",
        height: "100%",
        padding: 16,
        rowGap: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    innerFilter: {
        backgroundColor: "white",
    },
    container:{
        rowGap: 16,
        padding: 16
    },
    comboBox: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        width: "40%",
        height: 40,
        justifyContent: "center",
    },
    smallTitle:{
        fontSize: 16,
        fontWeight: "bold"
    },
    field: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    bottom: {
        alignSelf: "flex-end",
        flexDirection: "row",
        columnGap: 4
    },
    tags:{
        flexDirection: "row",
        columnGap: 4,
        rowGap: 4,
        flexWrap: "wrap"
    },
    wrapTag:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(20, 174, 92, 0.3)',
        flexDirection: "row",
        columnGap: 8,
    },
    textTag:{
        color: COLORS.main,
        fontSize: 14,
    },
    field2: {
        flexDirection: "column",
        rowGap: 4
    },
    wrapPrice: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        width: 110,
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // paddingHorizontal: 16
    },
    btnClose: {
        position: "absolute",
        right: 16,
        top: 16,
        zIndex: 1
    }
})