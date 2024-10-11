import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../utils/constants"
import AntDesign from '@expo/vector-icons/AntDesign';
import { formatDateTime } from "../utils/utils";

const initReview={
    star: 4,
    title: "Title",
    reviewBoby: "ReviewBoby",
    Reviewer: {
        img: "",
        name: "Name reviewer"
    },
    date: new Date()
}
export const CardReview = ({data = initReview})=>{
    const renderStars = ()=>{
        let star = []
        for(let i=0; i < data.star; i++){
            star.push(
                <AntDesign name="star" size={16} color={COLORS.yellow} />
            )
        }
        return star
    }
    return(
        <TouchableOpacity style={styles.container}>
            <View style={styles.star}>
                {renderStars()}
            </View>
            <View>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.reviewBoby}>{data.reviewBoby}</Text>
            </View>
            <View style={styles.wrapReviewer}>
                <Image source={data.Reviewer.img} style={styles.avata}/>
                <View>
                    <Text style={styles.name}>{data.Reviewer.name}</Text>
                    <Text style={styles.reviewBoby}>{formatDateTime(data.date)}</Text>
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
        marginRight: 10
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