import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Center"

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