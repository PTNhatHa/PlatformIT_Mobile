import { createContext, useContext, useEffect, useReducer } from "react"
import defautAva from "../../assets/images/DefaultAva.png"
// Khởi tạo Context
const UserContext = createContext()

// Định nghĩa các action types
export const SET_INFO = 'SET_INFO'

const initialState = {
    idUser: null,
    fullname: "", 
    idAccount: null, 
    idCenter: null, 
    idRole: null, 
    avatar: defautAva,
}

// Định nghĩa Reducer
const userReducer = (state, action) => {
    switch (action.type){
        case SET_INFO:
            return {
                ...state, 
                ...action.payload} // Chỉ cập nhật các trường được truyền vào
        default:
            return state
    }
}

// Tạo Provider
const UserProvider = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, initialState)
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