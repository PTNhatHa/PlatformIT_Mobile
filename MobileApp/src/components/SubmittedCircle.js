import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export const SubmittedCircle = ({ data }) => {
    const radius = 30; // Bán kính vòng tròn
    const strokeWidth = 15; // Độ dày viền
    const circumference = 2 * Math.PI * radius; // Chu vi vòng tròn
  
    // Tính toán phần trăm của mỗi phần
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = circumference / 4; // Xoay để bắt đầu từ hướng 12h

    return (
        <Svg height="120" width="120" viewBox="0 0 120 120">
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
                        cx="60"
                        cy="60"
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
