import { StyleSheet } from "react-native";

export const COLORS = {
    main: '#397979',
    main30: "#C0D3D3",
    secondMain: '#003B57',
    stroke: "#757575",
    lightText: "#D9D9D9",
    yellow: "#FFCC00",
    green: "#34C759",
    red: "#C00F0C",
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
        shadowOffset: { width: 10, height: 10 }, // Độ lệch của bóng đổ
        shadowOpacity: 0.25, // Độ mờ của bóng đổ
        shadowRadius: 10, // Bán kính của bóng đổ
        elevation: 10, // Độ cao của bóng đổ (chỉ dành cho Android)
    }
})

export const Status = {
    active: 1,
    inactive: 2
}

export const Genser = {
    male: 0,
    female: 1,
    other: 2
}


export const initialCourse=[
    {
        id: 1,
        img: "",
        title: "Title1",
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
    },
    {
        id: 2,
        img: "",
        title: "Title2",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        startRegist: new Date(),
        endRegist: new Date(),
        isRegist: false,
        cost: 120,
        costSale: 100,
        nameCenter: "Center ABC",
    },
    {
        id: 3,
        img: "",
        title: "Title3",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        isRegist: true,
        cost: 120,
        costSale: 100,
        nameCenter: "Center HAHYWU",
    },
    {
        id: 4,
        img: "",
        title: "Title4",
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
        nameCenter: "Center Plait",
    },
    {
        id: 5,
        img: "",
        title: "Title5",
        listTags: [
            { id: 2, value: "Backend"},
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        startRegist: new Date(),
        endRegist: new Date(),
        isRegist: false,
        cost: 120,
        costSale: 100,
        nameCenter: "Center HAHYWU",
    },
    {
        id: 6,
        img: "",
        title: "Title6",
        listTags: [
            { id: 3, value: "Frontend"},
        ],
        startCourse: new Date(),
        endCourse: new Date(),
        isRegist: true,
        cost: 120,
        costSale: 100,
        nameCenter: "Center HAHYWU",
    },
]
