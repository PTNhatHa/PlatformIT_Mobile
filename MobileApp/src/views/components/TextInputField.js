import { Image, StyleSheet, Text, TextInput, View } from "react-native"
import { COLORS } from "../constants"

export const TextInputIcon = ({
    value, icon, placeholder, onchangeText, error
}) => {
    return(
        <View>
            <View style={styles.container}>
                <Image source={icon}/>
                <TextInput 
                    style={styles.input}
                    value={value}
                    placeholder={placeholder}
                    onchangeText={onchangeText}
                />
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
        
    )
}

export const TextInputLabel = ({
    label, value, placeholder, onchangeText
}) => {
    return(
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                value={value}
                placeholder={placeholder}
                onchangeText={onchangeText}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: COLORS.lightText,
        borderRadius: 90,
        paddingHorizontal: 16,
        paddingVertical: 12,
        width: "100%",
        flexDirection: "row",
        columnGap: 8,
    },
    input:{
        fontSize: 16,
        width: "85%"
    },
    error:{
        color: "#C00F0C"
    }
})