import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import { ButtonGreen, ButtonWhite } from "../components/Button";
import { DateTimePickerComponent } from "../components/DateTimePicker";
import { RadioBtn } from "../components/RadioBtn";

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
        { label: "Name", value: 1},
        { label: "Cost", value: 2},
    ]
    const listSortby2 = [
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
    ]
    const [textColor, setTextColor] = useState(COLORS.lightText)

    // Filter
    const [listTags, setListTags] = useState(dataFilter.tags || [])
    const [startRegist, setStartRegist] = useState(dataFilter.startRegist || new Date())
    const [endRegist, setEndRegist] = useState(dataFilter.endRegist || new Date())
    const [startDuration, setStartDuration] = useState(dataFilter.startDuration || new Date())
    const [endDuration, setEndDuration] = useState(dataFilter.endDuration || new Date())
    const [startCost, setStartCost] = useState(dataFilter.startCost || 0)
    const [endCost, setEndCost] = useState(dataFilter.endCost || 0)
    const [selectType, setSelectType] = useState(dataFilter.courseType || "All")
    const allTags = [
        { label: "Tag1", value: 1},
        { label: "Tag2", value: 2},
    ]
    const handleChooseTag = (v)=>{
        if(!listTags.includes(v) && v !== null){
            setListTags([...listTags, v])
        }
    }
    const handleDeleteTag = (v)=>{
        const newList = listTags.filter(item => item !== v)
        setListTags(newList)
    }
    const handleSort =()=>{
        setDataSort({
            sortby: sortby1,
            sortway: sortby2
        })
        onPressCancel()
    }
    const handleFilter =()=>{
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
    return(
        <View style={stylesFilter.wrapFilter}>
            <View style={stylesFilter.innerFilter}>
                {/* Sort */}
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Sort</Text>
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Sort by</Text>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby1}
                                onValueChange={(v)=> setsortby1(v)}
                                style={{
                                    inputAndroid: {
                                        color: textColor
                                    }
                                }}
                                value={sortby1}
                            />
                        </View>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby2}
                                onValueChange={(v)=> setsortby2(v)}
                                style={{
                                    inputAndroid: {
                                        color: textColor
                                    }
                                }}
                                value={sortby2}
                            />
                        </View>
                    </View>  
                    <View style={stylesFilter.bottom}>
                        <ButtonGreen title={"Sort"} action={handleSort}/>
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
                                    style={{
                                        inputAndroid: {
                                            color: textColor
                                        }
                                    }}
                                />
                            </View>
                        </View>  
                        <View style={stylesFilter.tags}>
                            {listTags.map(item => 
                                <View style={stylesFilter.wrapTag} key={item}>
                                    <Text style={stylesFilter.textTag}>{item}</Text>
                                    <TouchableOpacity style={stylesFilter.close} onPress={()=>handleDeleteTag(item)}>
                                        <AntDesign name="close" size={18} color={COLORS.main} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Course type */}
                    <View style={stylesFilter.field2}>
                        <Text style={stylesFilter.smallTitle}>Course type</Text>
                        <View style={stylesFilter.field}>
                            <RadioBtn label="All" selected={selectType === "All"} onPress={()=>setSelectType("All")}/>
                            <RadioBtn label="Limit" selected={selectType === "Limit"} onPress={()=>setSelectType("Limit")}/>
                            <RadioBtn label="Unlimit" selected={selectType === "Unlimit"} onPress={()=>setSelectType("Unlimit")}/>
                        </View>
                    </View>

                    { selectType === "Limit" &&
                        <>
                            {/* Registration date */}
                            <View style={stylesFilter.field2}>
                                <Text style={stylesFilter.smallTitle}>Registration date</Text>
                                <View style={stylesFilter.field}>
                                    <DateTimePickerComponent width="200" value={startRegist} setValue={setStartRegist}/>
                                    <AntDesign name="arrowright" size={24} color="black" />
                                    <DateTimePickerComponent width="200" value={endRegist} setValue={setEndRegist}/>
                                </View>
                            </View>

                            {/* Course duration */}
                            <View style={stylesFilter.field2}>
                                <Text style={stylesFilter.smallTitle}>Course duration</Text>
                                <View style={stylesFilter.field}>
                                    <DateTimePickerComponent width="200" value={startDuration} setValue={setStartDuration}/>
                                    <AntDesign name="arrowright" size={24} color="black" />
                                    <DateTimePickerComponent width="200" value={endDuration} setValue={setEndDuration}/>
                                </View>
                            </View>
                        </>
                    }

                    {/* Price */}
                    <View style={stylesFilter.field2}>
                        <Text style={stylesFilter.smallTitle}>Price</Text>
                        <View style={stylesFilter.field}>
                            <View style={stylesFilter.wrapPrice}>
                                <TextInput 
                                    style={stylesFilter.textInput} 
                                    keyboardType="numeric" 
                                    placeholder="0"
                                    value={startCost}
                                    onChangeText={(v)=>setStartCost(v)}
                                />
                                <Feather name="dollar-sign" size={20} color={COLORS.lightText} />
                            </View>
                            <AntDesign name="arrowright" size={24} color="black" />
                            <View style={stylesFilter.wrapPrice}>
                                <TextInput 
                                    style={stylesFilter.textInput} 
                                    keyboardType="numeric" 
                                    placeholder="0"
                                    value={endCost}
                                    onChangeText={(v)=>setEndCost(v)}
                                />
                                <Feather name="dollar-sign" size={20} color={COLORS.lightText} />
                            </View>
                            
                        </View>
                    </View>

                    <View style={stylesFilter.bottom}>
                        <ButtonWhite title={"Cancel"} action={onPressCancel}/>
                        <ButtonGreen title={"Filter"} action={handleFilter}/>
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
        { label: "Name", value: 1},
    ]
    const listSortby2 = [
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
    ]
    const [textColor, setTextColor] = useState(COLORS.lightText)

    // Filter
    const [listTags, setListTags] = useState(dataFilter.tags || [])
    const allTags = [
        { label: "Tag1", value: 1},
        { label: "Tag2", value: 2},
    ]
    const handleChooseTag = (v)=>{
        if(!listTags.includes(v) && v !== null){
            setListTags([...listTags, v])
        }
    }
    const handleDeleteTag = (v)=>{
        const newList = listTags.filter(item => item !== v)
        setListTags(newList)
    }
    const handleSort =()=>{
        setDataSort({
            sortby: sortby1,
            sortway: sortby2
        })
        onPressCancel()
    }
    const handleFilter =()=>{
        setDataFilter({
            tags: listTags,
        })
        onPressCancel()
    }
    return(
        <View style={stylesFilter.wrapFilter}>
            <View style={stylesFilter.innerFilter}>
                {/* Sort */}
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Sort</Text>
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Sort by</Text>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby1}
                                onValueChange={(v)=> setsortby1(v)}
                                style={{
                                    inputAndroid: {
                                        color: textColor
                                    }
                                }}
                                value={sortby1}
                            />
                        </View>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby2}
                                onValueChange={(v)=> setsortby2(v)}
                                style={{
                                    inputAndroid: {
                                        color: textColor
                                    }
                                }}
                                value={sortby2}
                            />
                        </View>
                    </View>  
                    <View style={stylesFilter.bottom}>
                        <ButtonGreen title={"Sort"} action={handleSort}/>
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
                                    style={{
                                        inputAndroid: {
                                            color: textColor
                                        }
                                    }}
                                />
                            </View>
                        </View>  
                        <View style={stylesFilter.tags}>
                            {listTags.map(item => 
                                <View style={stylesFilter.wrapTag} key={item}>
                                    <Text style={stylesFilter.textTag}>{item}</Text>
                                    <TouchableOpacity style={stylesFilter.close} onPress={()=>handleDeleteTag(item)}>
                                        <AntDesign name="close" size={18} color={COLORS.main} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={stylesFilter.bottom}>
                        <ButtonWhite title={"Cancel"} action={onPressCancel}/>
                        <ButtonGreen title={"Filter"} action={handleFilter}/>
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
        { label: "Name", value: 1},
    ]
    const listSortby2 = [
        { label: "None", value: 0},
        { label: "Asc", value: 1},
        { label: "Des", value: 2},
    ]
    const [textColor, setTextColor] = useState(COLORS.lightText)
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
                <View style={stylesFilter.container}>
                    <Text style={[commonStyles.title, { fontSize: 24}]}>Sort</Text>
                    <View style={stylesFilter.field}>
                        <Text style={stylesFilter.smallTitle}>Sort by</Text>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby1}
                                onValueChange={(v)=> setsortby1(v)}
                                style={{
                                    inputAndroid: {
                                        color: textColor
                                    }
                                }}
                                value={sortby1}
                            />
                        </View>
                        <View style={stylesFilter.comboBox}>
                            <RNPickerSelect
                                items={listSortby2}
                                onValueChange={(v)=> setsortby2(v)}
                                style={{
                                    inputAndroid: {
                                        color: textColor
                                    }
                                }}
                                value={sortby2}
                            />
                        </View>
                    </View>  
                    <View style={stylesFilter.bottom}>
                        <ButtonWhite title={"Cancel"} action={onPressCancel}/>
                        <ButtonGreen title={"Sort"} action={handleSort}/>
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
        borderWidth: 1,
        borderColor: COLORS.lightText,
        padding: 16
    },
    comboBox: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
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
        columnGap: 4
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
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 148,
        height: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16
    },
    textInput:{
        // marginHorizontal: 16
    }
})