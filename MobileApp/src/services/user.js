import axios from "axios"
import { useUser } from "../contexts/UserContext"
const baseUrl = "http://192.168.2.3:5251/api/User"
// const baseUrl = "http://192.168.1.165:5251/api/User"
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

export const forgotPassword = async (email)=>{
    const url = baseUrl + "/ForgotPassword?email=" + email
    return await axios.post(url)
    .then(response => {
        // console.log("==>Response: ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error: ", error.response.data);
        return {
            error: 400,
            data: "We couldn't find an account with that email address."
        }
    })
}

export const updateUserBasicPI = async (idUser, fullName, phoneNumber, gender, dob, nationality)=>{
    const url = baseUrl + "/UpdateUserBasicPI"
    return await axios.post(url, {
        "idUser": idUser,
        "fullName": fullName,
        "phoneNumber": phoneNumber,
        "gender": gender,
        "dob": dob,
        "nationality": nationality
      })
    .then(response => {
        // console.log("==>Response: ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error: ", error.response.data);
        return {
            error: 400,
            data: error.response.data
        }
    })
}

export const addProfileLink = async (idUser, name, link)=>{
    const url = baseUrl + "/AddProfileLink?IdUser=" + idUser
    return await axios.post(url, {
        "name": name,
        "url": link
      })
    .then(response => {
        // console.log("==>Response: ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error: ", error.response.data);
        return {
            error: 400,
            data: error.response.data
        }
    })
}

export const deleteProfileLink = async (id)=>{
    const url = baseUrl + "/DeleteProfileLink?id=" + id
    return await axios.delete(url)
    .then(response => {
        console.log("==>Response: ", response.data);
        return response.data
    })
    .catch(error => {
        console.log("==>Error: ", error);
        return {
            error: 400,
            data: error.response.data
        }
    })
}