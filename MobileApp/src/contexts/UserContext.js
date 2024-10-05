import { createContext, useContext, useEffect, useReducer } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';
// Khởi tạo Context
const UserContext = createContext()

// Định nghĩa các action types
export const SET_INFO = 'SET_INFO'

const initialState = {
    idUser: null,
    user: {
        "fullname": "", 
        "idAccount": null, 
        "idCenter": null, 
        "idRole": null, 
        "idUser": null
    }
}

// Định nghĩa Reducer
const userReducer = (state, action) => {
    switch (action.type){
        case SET_INFO:
            return {...state, idUser: action.payload.idUser, user: action.payload.user}
        default:
            return state
    }
}

// Tạo Provider
const UserProvider = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, initialState)
    useEffect(()=>{
        const loadUserData = async()=>{
            const idUser = await AsyncStorage.getItem('idUser')
            if(idUser){
                const user = {fullname: "NhatHa"}
                dispatch({ type: SET_INFO, payload: {idUser, user}})
            }
        }
        loadUserData()
    }, [])
    return(
        <UserContext.Provider value={{ state, dispatch}}>
            {children}
        </UserContext.Provider>
    )
}

// Custom hook để sử dụng Context
const useUser = ()=>{
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

export { UserProvider, useUser}