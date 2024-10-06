import axios from "axios"
import { useUser } from "../contexts/UserContext"
const baseUrl = "http://192.168.2.3:5251/api/User"
export const getUserInfo = async (idUser)=>{
    const url = baseUrl + "/showPI?id=" + idUser
    return await axios.get(url)
    .then(response => {
        // console.log("==>Response:  ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error:  ", error.response.data);
        return {
            error: 400,
            data: error.response.data
        }
    })
}
export const changePassword = async (currentPW, newPW, idUser)=>{
    const url = baseUrl + "/ChangePassword"
    return await axios.post(url, {
        "currentPW": currentPW,
        "newPW": newPW,
        "idAccountUpdated": idUser,
        "idUserUpdatedBy": idUser
    })
    .then(response => {
        // console.log("==>Response:  ", response.data);
        return {
            success: 200,
            data: "Reset successfully"
        }
    })
    .catch(error => {
        // console.log("==>Error:  ", error.response.data);
        return {
            error: 400,
            data: error.response.data
        }
    })
}