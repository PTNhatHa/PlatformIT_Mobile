import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDateTime } from "../utils/utils";
import DefaultAva from "../../assets/images/DefaultAva.png"

const initReview={
    "idRating": 0,
    "raterAvatarPath": "",
    "raterName": "Sample",
    "rateContent": "Sample",
    "ratePoint": 4
  }
export const CardReview = ({data = initReview})=>{
    const renderStars = ()=>{
        let star = []
        for(let i=0; i < 5; i++){
            if(i < data.ratePoint)
            {
                star.push(
                    <AntDesign name="star" size={16} color={COLORS.yellow} key={i}/>
                )
            } else {
                star.push(
                    <AntDesign name="staro" size={16} color={COLORS.yellow} key={i}/>
                )
            }
            
        }
        return star
    }
    return(
        <TouchableOpacity style={styles.container} key={data.idRating}>
            <View style={styles.star}>
                {renderStars()}
            </View>
            <Text style={styles.reviewBoby}>{data.rateContent}</Text>
            <View style={styles.wrapReviewer}>
                <Image source={data.raterAvatarPath || DefaultAva} style={styles.avata}/>
                <View>
                    <Text style={styles.name}>{data.raterName}</Text>
                    <Text style={styles.reviewBoby}>6/11/2024</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 8,
        rowGap: 6,
        width: 200,
        marginRight: 10,
        backgroundColor: "white"
    },
    star: {
        flexDirection: "row",
    },
    title:{
        fontSize: 16,
        fontWeight: "bold"
    },
    reviewBoby: {
        fontSize: 10,
        color: COLORS.stroke
    },
    avata: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        width: 24,
        height: 24
    },
    wrapReviewer: {
        flexDirection: "row",
        columnGap: 4,
    },
    name: {
        fontSize: 12,
        fontWeight: "bold",
        color: COLORS.stroke
    }
})