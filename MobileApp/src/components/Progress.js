import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../utils/constants';

export const ProgressCircle = ({done = 0, all = 0})=>{
    const radius = 70; // Bán kính
    const strokeWidth = 18; // Độ dày của viền
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (done/(all === 0 ? 1 : all) * circumference);

    return (
        <View style={styles.container}>
            <Svg height="160" width="160">
                <Circle
                    stroke="#e6e6e6" // Màu viền nền
                    fill="none"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <Circle
                    stroke={COLORS.main} // Màu viền progress
                    fill="none"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    rotation="-90"
                    origin="80, 80"
                    strokeLinecap="round"
                />
            </Svg>
            <Text style={styles.textValue}>{done}/{all}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{ 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    textValue:{
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.main,
        position: "absolute",

    }
})