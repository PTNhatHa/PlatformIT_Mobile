import React from 'react';  
import { View, StyleSheet } from 'react-native';  
import Svg, { Circle } from 'react-native-svg';  
import { COLORS } from '../utils/constants';  

export const AttendanceIndicator = ({ green = 15, yellow = 10, red = 20 }) => {  
    const totalAttendees = red + green + yellow; // Tổng số người tham gia  
    const percentages = [  
        (red / totalAttendees) * 100,  
        (green / totalAttendees) * 100,  
        (yellow / totalAttendees) * 100  
    ];  

    const strokeWidth = 18;  
    const radius = 40; // Bán kính của từng chỉ báo hình tròn  
    const circumference = 2 * Math.PI * radius; // Chu vi hình tròn  

    // Tính toán offset cho từng vòng tròn  
    const offsets = percentages.map((percentage) => circumference - (percentage / 100) * circumference);  

    // Đặt offset cho vòng tròn đầu tiên bắt đầu từ 12 giờ  
    const startOffset = circumference / 4; // Bắt đầu từ vị trí 12 giờ  

    return (  
        <View style={styles.container}>  
            <View style={styles.innerContainer}>  
                <Svg height={120} width={120}>  
                    {/* Vòng tròn nền */}  
                    <Circle  
                        stroke="#F0F0F0"  
                        fill="transparent"  
                        strokeWidth={strokeWidth}  
                        r={radius}  
                        cx="60"  
                        cy="60"  
                    />  
                    {/* Vòng tròn cho người tham gia đầu tiên */}  
                    <Circle  
                        stroke={COLORS.green} // Màu đại diện cho người tham gia đầu tiên  
                        fill="transparent"  
                        strokeWidth={strokeWidth}  
                        r={radius}  
                        cx="60"  
                        cy="60"  
                        strokeDasharray={circumference}  
                        strokeDashoffset={startOffset - offsets[0]} // Offset bắt đầu từ 12 giờ  
                    />  
                    {/* Vòng tròn cho người tham gia thứ hai */}  
                    <Circle  
                        stroke={COLORS.yellow} // Màu đại diện cho người tham gia thứ hai  
                        fill="transparent"  
                        strokeWidth={strokeWidth}  
                        r={radius}  
                        cx="60"  
                        cy="60"  
                        strokeDasharray={circumference}  
                        strokeDashoffset={startOffset - (offsets[0] + offsets[1])} // Đẩy lên vị trí tiếp theo  
                    />  
                    {/* Vòng tròn cho người tham gia thứ ba */}  
                    <Circle  
                        stroke={COLORS.red} // Màu đại diện cho người tham gia thứ ba  
                        fill="transparent"  
                        strokeWidth={strokeWidth}  
                        r={radius}  
                        cx="60"  
                        cy="60"  
                        strokeDasharray={circumference}  
                        strokeDashoffset={startOffset - (offsets[0] + offsets[1] + offsets[2])} // Tiếp tục thêm độ lệch của cả hai  
                    />  
                </Svg>  
            </View>  
        </View>  
    );  
};  

const styles = StyleSheet.create({  
    container: {  
        alignItems: 'center',  
        justifyContent: 'center',  
        height: '100%',  
    },  
    innerContainer: {  
        position: 'relative', // Để các vòng tròn có thể nằm chồng lên nhau  
        height: 120,  
        width: 120,  
    },  
});