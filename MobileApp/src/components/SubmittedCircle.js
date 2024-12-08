import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../utils/constants';

const init = [
    { label: 'On Time', value: 25, color: COLORS.green }, // Xanh lá
    { label: 'Late', value: 0, color: COLORS.yellow }, // Vàng
    { label: 'Not Submitted', value: 30, color: COLORS.lightText }, // Đỏ
  ];

export const SubmittedCircle = ({ data=init }) => {
    const radius = 30; // Bán kính vòng tròn
    const strokeWidth = 15; // Độ dày viền
    const circumference = 2 * Math.PI * radius; // Chu vi vòng tròn
  
    // Tính toán phần trăm của mỗi phần
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = circumference / 4; // Xoay để bắt đầu từ hướng 12h

    return (
        <Svg height="80" width="80" viewBox="0 0 80 80">
            {data.map((item, index) => {
                const percentage = item.value / total;
                const arcLength = percentage * circumference;
                const dashArray = [arcLength, circumference - arcLength];
                const strokeDashoffset = startAngle;

                // Cập nhật góc bắt đầu cho phần tiếp theo
                startAngle -= arcLength;

                return (
                    <Circle
                        key={index}
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke={item.color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={dashArray.join(' ')}
                        strokeDashoffset={strokeDashoffset}
                    />
                );
            })}
        </Svg>
    );
};
