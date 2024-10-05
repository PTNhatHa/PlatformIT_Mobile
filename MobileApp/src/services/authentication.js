import axios from "axios"
const baseUrl = "http://192.168.2.3:5251/api/Authentication"
export const signupApi = async (name, email, username, password, tin)=>{
    const url = baseUrl + "/signup"
    return await axios.post(url, {
        "fullName": name,
        "email": email,
        "username": username,
        "password": password,
        "tin": tin
    })
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

export const signinApi = async (username, password)=>{
    const url = baseUrl + "/SignInByPassword"
    return await axios.post(url, {
        "username": username,
        "password": password,
    })
    .then(response => {
        // console.log("==>Response:  ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error:  ", error);
        return {
            error: 400,
            data: error.response.data
        }
    })
}