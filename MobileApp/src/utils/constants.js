import { StyleSheet } from "react-native";

export const COLORS = {
    main: '#397979',
    secondMain: '#003B57',
    stroke: "#757575",
    lightText: "#D9D9D9"
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