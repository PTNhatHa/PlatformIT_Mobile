import axios from "axios"
// const baseUrl = "http://10.10.27.112:5000/api/Authen"
const baseUrl = "http://192.168.1.209:5000/api/Authen"
export const signupApi = async (name, email, username, password)=>{
    const url = baseUrl + "/signup"
    return await axios.post(url, {
        "fullName": name,
        "email": email,
        "username": username,
        "password": password,
        "centerName": "",
        "description": "",
        "tin": ""
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

export const checkEmail = async (email)=>{
    const url = baseUrl + "/CheckEmail"
    return await axios.post(url, email, {
        headers: { 'Content-Type': 'application/json' }  // Đảm bảo gửi kiểu chuỗi văn bản
    } )
    .then(response => {
        // console.log("==>Response checkEmail:  ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error checkEmail:  ", error);
        return {
            error: 400,
            data: error.response.data
        }
    })
}

export const sendOTP = async (email)=>{
    const url = baseUrl + "/SendOTP"
    return await axios.post(url, email, {
        headers: { 'Content-Type': 'application/json' }  // Đảm bảo gửi kiểu chuỗi văn bản
    } )
    .then(response => {
        // console.log("==>Response:  ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>ErrorsendOTP:  ", error);
        return {
            error: 400,
            data: error.response.data
        }
    })
}

export const verifyOTP = async (email, otp)=>{
    const url = baseUrl + "/VerifyOtp"
    return await axios.post(url, {
        "email": email,
        "otp": otp
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