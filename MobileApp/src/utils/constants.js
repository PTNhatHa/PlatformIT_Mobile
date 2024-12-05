import { StyleSheet } from "react-native";

export const currentIP = "192.168.1.107"

export const COLORS = {
    main: '#397979',
    main30: "#C0D3D3",
    secondMain: '#003B57',
    stroke: "#757575",
    lightText: "#D9D9D9",
    yellow: "#FFCC00",
    green: "#34C759",
    red: "#C00F0C",
    lightGray: "#F5F5F5"
};

export const commonStyles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.main
    },
    viewAll: {
        fontSize: 14,
        fontWeight: "bold",
        color: COLORS.stroke,
    },
    shadow: {
        shadowColor: "#000", // Màu của bóng đổ
        shadowOffset: { width: 5, height: 5 }, // Độ lệch của bóng đổ
        shadowOpacity: 0.25, // Độ mờ của bóng đổ
        shadowRadius: 5, // Bán kính của bóng đổ
        elevation: 5, // Độ cao của bóng đổ (chỉ dành cho Android)
    }
})

export const Status = {
    active: 1,
    inactive: 2
}

export const Gender = {
    QUALIFICATION: 1,
    ASSIGNEDTEACHER : 2,
    BOARD : 3,
}

export const NotificationType = {
    male: 0,
    female: 1,
    other: 2
}

export const initialCourse=[

]

export const typeAssignment = {
    1: "Manual",
    2: "Quiz",
    3: "Code"
}

export const AssignmentItemAnswerType = {
    1: "Text",
    2: "Attach file",
}