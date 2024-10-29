import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { COLORS, commonStyles } from "../utils/constants"
import { useEffect, useState} from "react"
import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';
import { ButtonGreen, ButtonIconLightGreen, ButtonWhite } from "./Button";
import { useUser } from "../contexts/UserContext";
import { addProfileLink, deleteProfileLink } from "../services/user";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const iniSocial = [
    { idProfileLink: 1, name: "Github", url: "aaaaaaa"},
    { idProfileLink: 2, name: "Facebook", url: "bbbbbb"},
]
export const SocialLink = ({
    value = iniSocial,
    fetchData = ()=>{}
}) => {

    const {state, dispatch} = useUser()
    const [list, setList] = useState(value)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setList(value)
        setLoading(false)
    }, [value])
    
    const handleOnchangeText = (idProfileLink, value, name)=>{
        const newList = list.map((item)=>{
            if(item.idProfileLink === idProfileLink && name === "name"){
                return{
                    ...item,
                    name: value,
                }
            }
            if(item.idProfileLink === idProfileLink && name === "url"){
                return{
                    ...item,
                    url: value,
                }
            }
            return item
        })
        setList(newList)
    }

    const confirmDelete = (item)=>{
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this link?",
            [
                {
                    text: "Yes",
                    onPress: ()=> handleDelete(item),
                    style: "destructive"
                },
                {
                    text: "No",
                    style: "cancel"
                },
            ],
            { cancelable: true }
        )
    }
    const handleDelete = async(item)=>{
        setError("")
        if(!item.isNew){
            try{
                const response = await deleteProfileLink(item.idProfileLink)
                if(response.error){
                    Alert.alert("Warning", response.data)
                }else{
                    Alert.alert("Noti", "Delete social link done^o^")
                    fetchData()
                }
            } catch(e){
                console.log("Error add Social links: ", e);
            }
        }
        const newList = list.filter((current)=> current.idProfileLink !== item.idProfileLink)
        setList(newList)
    }
    const handleAddNew = ()=>{
        setError("")
        const maxId = Math.max(...list.map(item => item.idProfileLink), 0)
        const newList = [...list, { idProfileLink: maxId + 1, name: "", url: "", isNew: true}]
        setList(newList)
    }
    const listTitle = [
        { label: "Github", value: "Github"},
        { label: "LinkedIn", value: "LinkedIn"},
        { label: "Youtube", value: "Youtube"},
        { label: "Facebook", value: "Facebook"},
        { label: "Portfolio", value: "Portfolio"},
    ]
    const checkIsNull = (item)=>{
        if(item.name === "" || item.url === ""){
            setError("Please fill all.")
            return true
        }
        setError("")
        return false
    }
    const handleSave = async(item)=>{
        if(checkIsNull(item)) return
        setLoading(true)
        try {
            // Add
            const response = await addProfileLink(state.idUser, item.name, item.url)
            if(response.error){
                Alert.alert("Warning", response.data)
            }else{
                Alert.alert("Noti", "Add social link done^v^")
                fetchData()
            }
        } catch (error) {
            
        } finally{
            setLoading(false)
        }
    }
    return(
        <>
            <View style={styles.wrap}>
                <Text style={commonStyles.title}>Social/Professional Profile Links</Text>
                {list.map((item)=>
                    <View style={styles.container} key={item.idProfileLink}>
                        <View style={styles.title}>
                            <RNPickerSelect
                                items={listTitle}
                                onValueChange={(v)=>handleOnchangeText(item.idProfileLink, v, "name")}
                                style={{
                                    inputAndroid: {
                                        color: "black",
                                    }
                                }}
                                value={item.name}
                                useNativeAndroidPickerStyle={false}
                                disabled={item.isNew !== true}
                            />
                        </View>
                        <TextInput 
                            style={[styles.link, item.isNew && {width: "48%"}]}
                            value={item.url}
                            placeholder={"*Url"}
                            placeholderTextColor={COLORS.red}
                            onChangeText={(v)=>handleOnchangeText(item.idProfileLink, v, "url")}
                            editable={item.isNew === true}
                        />
                        <TouchableOpacity onPress={()=>confirmDelete(item)}>
                            <AntDesign name="delete" size={20} color={COLORS.stroke} />
                        </TouchableOpacity>
                        {item.isNew &&
                            <TouchableOpacity onPress={()=>handleSave(item)}>
                                <FontAwesome name="check" size={20} color={COLORS.stroke} />
                            </TouchableOpacity>
                        }
                    </View>
                        
                )}
                {error && <Text style={{ color: COLORS.red }}>{error}</Text>}
                <ButtonIconLightGreen title={"Add"} icon={<AntDesign name="plus" size={14} color={COLORS.main} />} action={()=>handleAddNew()}/>
            </View>
            {loading &&
                <Modal
                    visible={loading}
                    transparent={true}
                    animationType="fade"
                >
                    <View style={styles.wrapLoading}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                </Modal>
            }  
        </>
    )
}

const styles = StyleSheet.create({
    wrap: {
        ...commonStyles.shadow,
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8
    },
    container: {
        borderBottomWidth: 1,
        borderColor: COLORS.lightText,
        paddingVertical: 8,
        flexDirection: "row",
        columnGap: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    link:{
        fontSize: 16,
        width: "55%",
        paddingHorizontal: 10,
        color: "black"
    },
    title: {
        fontSize: 16,
        width: "30%",
        borderRightWidth: 1,
        borderColor: COLORS.lightText,
    },
    btn:{
        padding: 12,
        borderRadius: 90,
        borderWidth: 1,
        alignSelf: "flex-start",
        borderColor: COLORS.lightText,
    },
    bottom: {
        flexDirection: "row",
        justifyContent: "space-between"
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