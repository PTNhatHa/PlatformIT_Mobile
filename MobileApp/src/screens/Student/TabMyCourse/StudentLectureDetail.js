import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS, commonStyles } from "../../../utils/constants";
import { useState } from "react";

export const StudentLectureDetail = ()=>{
    const [index, setIndex] = useState(1) //1: Content, 2: Exercise, 3: Comment
    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.top}>
                <Text style={styles.title}>Name Course</Text>
                <TouchableOpacity>
                    <Entypo name="menu" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.main}>
                <View style={styles.wrapper}>
                    {true &&
                        <Image style={styles.contentVideo}/>
                    }
                    <Text style={styles.title}>Title Lecture</Text>
                    <Text style={styles.textGray12}>13 hr.ago</Text>
                </View>
                <View style={styles.nav}>
                    <TouchableOpacity onPress={()=>setIndex(1)}>
                        <Text style={index === 1 ? styles.navTextActive : styles.navText}>Content</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setIndex(2)}>
                        <Text style={index === 2 ? styles.navTextActive : styles.navText}>Exercise</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setIndex(3)}>
                        <Text style={index === 3 ? styles.navTextActive : styles.navText}>Comment</Text>
                    </TouchableOpacity>
                </View>
                {index === 1 &&
                    <View style={styles.wrapper}>
                        <View style={styles.wrapContent}>
                            <Text style={styles.textBlack16}>Introduction</Text>
                            <Text style={styles.textGray12}>
                                Body text for whatever you’d like to say. Add main takeaway points,quotes, anecdotes, or even a very very short story. 
                            </Text>
                        </View>
                        {true &&
                            <View style={styles.wrapContent}>
                                <Text style={styles.textBlack16}>Materials</Text>
                                <Text style={styles.textGray12}>
                                    Body text for whatever you’d like to say. Add main takeaway points,quotes, anecdotes, or even a very very short story. 
                                </Text>
                            </View>
                        }
                        {true &&
                            <View style={styles.wrapContent}>
                                <Text style={styles.textBlack16}>Supporting materials</Text>
                                <Text style={styles.textGray12}>
                                    Body text for whatever you’d like to say. Add main takeaway points,quotes, anecdotes, or even a very very short story. 
                                </Text>
                            </View>
                        }
                        
                    </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FAFAFA",
        minHeight: "100%"
    },
    top:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    main: {
        ...commonStyles.shadow,
        minHeight: 500,
        borderRadius: 8,
        backgroundColor: "white",
        paddingBottom: 16
    },
    contentVideo: {
        width: "100%",
        height: 200,
        backgroundColor: COLORS.lightText,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        marginTop: 16,
        marginBottom: 8
    },
    textGray12:{
        fontSize: 12,
        color: COLORS.stroke
    },
    wrapper: {
        paddingHorizontal: 16
    },
    nav:{
        paddingHorizontal: 16,
        borderBottomWidth: 0.7,
        borderColor: COLORS.lightText,
        flexDirection: "row",
        gap: 20
    },
    navText: {
        fontSize: 14,
        color: COLORS.lightText,
        paddingVertical: 8
    },
    navTextActive: {
        fontSize: 14,
        paddingVertical: 8,
        color: COLORS.main,
        fontWeight: "bold",
        borderBottomWidth: 2,
        borderColor: COLORS.main,
    },
    textBlack16: {
        fontSize: 16,
        fontWeight: "bold",
    },
    wrapContent:{
        marginVertical: 8
    }
})