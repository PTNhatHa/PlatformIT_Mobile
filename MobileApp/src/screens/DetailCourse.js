import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import DefaultImg from "../../assets/images/DefaultImg.png"
import { COLORS, commonStyles } from "../utils/constants"
import { Tag } from "../components/Tag"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDateTime } from "../utils/utils";
import { useUser } from "../contexts/UserContext";


const initCourse={
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
    costSale: 100,
    nameCenter: "Center ABC",
    star: 4.5
}

export const DetailCourse = ({data = initCourse})=>{
    const {state, dispatch} = useUser()
    return(
        <ScrollView contentContainerStyle={styles.container}>
            {/* Course info */}
            <View style={styles.wrapper}>
                <Text style={commonStyles.title}>Course Information</Text>
                <Image source={DefaultImg} style={styles.infoImage}/>
                <View style={{ rowGap: 4}}>
                    <Text style={styles.infoTitle}>{data.title}</Text>
                    {data.listTags.length > 0 && 
                        <View style={styles.inforContent}>
                            {data.listTags.map(item => 
                                <Tag label={item.value}/>  
                            )}                    
                        </View>
                    }
                    <View style={styles.inforContent}>
                        <AntDesign name="star" size={16} color={COLORS.yellow} />
                        <Text style={styles.infoText}>{data.star}</Text>
                    </View>
                    <View style={styles.inforContent}>
                        <Feather name="clock" size={16} color={COLORS.stroke} />
                        <Text style={styles.infoText}>{formatDateTime(data.startCourse)} - {formatDateTime(data.endCourse)}</Text>
                    </View>
                    <View style={styles.inforContent}>
                    {data.startRegist &&
                            <FontAwesome6 name="pen-to-square" size={16} color={COLORS.stroke} />
                        }
                        {data.startRegist &&
                            <Text style={styles.infoText}>
                                {data.isRegist ? "Registing" : 
                                    `${formatDateTime(data.startCourse)} - ${formatDateTime(data.endCourse)}`}
                            </Text>
                        }
                    </View>
                    <View style={styles.inforContent}>
                        <Ionicons name="business-outline" size={16} color={COLORS.secondMain} />
                        <Text style={styles.infoText}>{data.nameCenter}</Text>
                    </View>
                    <View style={styles.inforContent}>
                        <Text style={styles.costSale}>${data.costSale}</Text>
                        <Text style={styles.cost}>{data.cost}</Text>
                    </View>
                </View>
                {state.idRole !== 3 &&
                    <TouchableOpacity style={styles.infoBtn}>
                        <Text style={styles.infoBtnText}>Pay for this course</Text>
                    </TouchableOpacity>
                }
            </View>
            {/* Course contents */}

            {/* Course Assignments */}

            {/* Course review */}

            {/* Teacher */}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        padding: 16,
    },
    wrapper: {
        width: "100%",
        paddingVertical: 16,
    },
    infoImage: {
        resizeMode: "contain",
        borderWidth: 1,
        borderColor: COLORS.lightText,
        width: "100%",
        height: 140
    },
    inforContent:{
        flexDirection: "row",
        columnGap: 4,
        alignItems: "center"
    },
    infoTitle:{
        fontSize: 16,
        fontWeight: "bold"
    },
    infoText: {
        fontSize: 14,
        color: COLORS.stroke
    },
    costSale:{
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.secondMain
    },
    cost: {
        fontSize: 10,
        textDecorationLine: 'line-through',
        color: COLORS.stroke
    },
    infoBtn:{
        alignItems: "center",
        backgroundColor: COLORS.main,
        paddingVertical: 4,
        borderRadius: 4 
    },
    infoBtnText: {
        color: "white",
        fontWeight: "bold"
    }
})