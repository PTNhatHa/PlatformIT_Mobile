import { Text } from "react-native"
import { useUser } from "../contexts/UserContext"

export const Home = ()=>{
    const {state, dispatch} = useUser()
    return(
        <>
            <Text>Hello</Text>
            <Text>{state.idUser}</Text>
        </>
    )
}