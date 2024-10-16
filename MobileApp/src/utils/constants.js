import { StyleSheet } from "react-native";

export const COLORS = {
    main: '#397979',
    secondMain: '#003B57',
    stroke: "#757575",
    lightText: "#D9D9D9",
    yellow: "#FFCC00",
    green: "#34C759",
    red: "#C00F0C"
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