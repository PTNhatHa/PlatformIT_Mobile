import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Course"

export const getAllCourseCards = async (idStudent)=>{
    let id = ""
    if(idStudent){
        id = "?idStudent=" + idStudent
    }
    return await axios.get(baseUrl + "/GetAllCourseCards" + id)
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

export const getAllCourseCardsByIdTeacher = async (idTeacher)=>{
    return await axios.get(baseUrl + "/GetAllCourseCardsByIdTeacher?idTeacher=" + idTeacher)
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
        return response.data.message
    })
    .catch(error => {
        console.log("Error addSection: ", error);
    })
}

export const getAllActiveCourseOfTeacher = async (idTeacher)=>{
    // console.log(idTeacher);
    return await axios.get(baseUrl + "/GetAllActiveCourseOfTeacher?idTeacher=" + idTeacher)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllActiveCourseOfTeacher: ", error);
    })
}

export const getAllActiveSectionOfCourse = async (idCourse)=>{
    return await axios.get(baseUrl + "/GetAllActiveSectionOfCourse?idCourse=" + idCourse)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllActiveSectionOfCourse: ", error);
    })
}

export const isEnrolledCourse = async (idStudent, idCourse)=>{
    return await axios.get(baseUrl + "/IsEnrolledCourse?idStudent=" + idStudent + "&idCourse=" + idCourse)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error isEnrolledCourse: ", error);
    })
}

export const getAllCourseCardsByIdStudent = async (idStudent)=>{
    return await axios.get(baseUrl + "/GetAllCourseCardsByIdStudent?idStudent=" + idStudent)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllCourseCardsByIdStudent: ", error);
    })
}

export const enrollCourse = async (idStudent, idCourse)=>{
    return await axios.post(baseUrl + "/EnrollCourse?idStudent=" + idStudent + "&idCourse=" + idCourse + "&idCreatedBy=" + idStudent)
    .then(response => {
        return response.data.message
    })
    .catch(error => {
        return{
            code: error.response.status,
            message: error.request._response
        }
    })
}

export const getTestOfCourseStudent = async (idStudent, idCourse)=>{
    // console.log(idStudent, idCourse);
    return await axios.get(baseUrl + "/GetTestOfCourseStudent?idCourse=" + idCourse + "&idStudent=" + idStudent)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetTestOfCourseStudent: ", error);
    })
}

export const getCourseContentStructure = async (idStudent, idCourse)=>{
    // console.log(idStudent, idCourse);
    const student = idStudent ? "&idStudent=" + idStudent : ""
    return await axios.get(baseUrl + "/GetCourseContentStructure?idCourse=" + idCourse + student)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetCourseContentStructure: ", error);
    })
}

export const getCourseProgress = async (idCourse)=>{
    return await axios.get(baseUrl + "/GetCourseProgress?idCourse=" + idCourse)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetCourseProgress: ", error);
    })
}