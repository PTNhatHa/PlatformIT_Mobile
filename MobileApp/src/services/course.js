import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Course"

export const getAllCourseCards = async ()=>{
    return await axios.get(baseUrl + "/GetAllCourseCards")
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllCourseCards: ", error);
    })
}

export const getCourseDetail = async (idCourse)=>{
    return await axios.get(baseUrl + "/GetCourseDetail?idCourse=" + idCourse)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getCourseDetail: ", error);
    })
}

export const addSection = async (sectionName, idCourse, idCreatedBy)=>{
    return await axios.post(baseUrl + "/AddSection?sectionName=" + sectionName + "&idCourse=" + idCourse + "&idCreatedBy=" + idCreatedBy)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error addSection: ", error);
    })
}