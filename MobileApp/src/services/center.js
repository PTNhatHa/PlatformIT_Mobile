import axios from "axios"
const baseUrl = "http://192.168.2.3:5000/api/Center"
// const baseUrl = "http://192.168.1.209:5000/api/Center"


export const getAllCenterCards = async ()=>{
    return await axios.get(baseUrl + "/GetAllCenterCards")
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllCenterCards: ", error);
    })
}

export const getAllTeacherByIdCenter = async (idCenter)=>{
    return await axios.get(baseUrl + "/GetAllTeacherByIdCenter?idCenter=" + idCenter)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllCenterCards: ", error);
    })
}

export const getCenterDetail = async (idCenter)=>{
    return await axios.get(baseUrl + "/GetCenterDetail?idCenter=" + idCenter)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getCenterDetail: ", error);
    })
}