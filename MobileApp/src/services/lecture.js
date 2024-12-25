import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Lecture"

export const addLecture = async (idCreatedBy, IdCourse, IdSection, Title, Introduction, LectureVideo, MainMaterials, SupportMaterials)=>{
    const formData = new FormData()
    formData.append('IdCourse', IdCourse)
    formData.append('IdSection', IdSection)
    formData.append('Title', Title)
    formData.append('Introduction', Introduction === null ? "" : Introduction)
    formData.append('LectureVideo', LectureVideo)
    formData.append('MainMaterials', MainMaterials)
    SupportMaterials.forEach((item, index) => {
        formData.append(`SupportMaterials`, item)
    })
    return await axios.post(baseUrl + "/AddLecture?idCreatedBy=" + idCreatedBy, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log("response.data.message: ", response.data.message);
        return response.data.message
    })
    .catch(error => {
        console.log("Error addLecture: ", error.response);
    })
}

export const getAllActiveLecturesOfCourse = async (idCourse)=>{
    return await axios.get(baseUrl + "/GetAllActiveLecturesOfCourse?idCourse=" + idCourse)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllActiveLecturesOfCourse: ", error);
    })
}

export const getLectureDetail = async (idLecture)=>{
    return await axios.get(baseUrl + "/GetLectureDetail?idLecture=" + idLecture)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetLectureDetail: ", error);
    })
}

export const inactiveSection = async (idSection, idCreatedBy)=>{
    return await axios.post(baseUrl + "/InactiveSection?idSection=" + idSection + "&idCreatedBy=" + idCreatedBy)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error InactiveSection: ", error);
    })
}

export const inactiveLecture = async (idLecture, idCreatedBy)=>{
    return await axios.post(baseUrl + "/InactiveLecture?idLecture=" + idLecture + "&idCreatedBy=" + idCreatedBy)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error InactiveLecture: ", error);
    })
}

export const getLectureInfoForCmtNoti = async (idLecture)=>{
    return await axios.get(baseUrl + "/GetLectureInfoForCmtNoti?idLecture=" + idLecture)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetLectureInfoForCmtNoti: ", error);
    })
}

export const updateLecture = async (idCreatedBy, IdLecture, IdCourse, IdSection, LectureStatus, Title, Introduction, LectureVideo, MainMaterials, SupportMaterials)=>{
    const formData = new FormData()
    formData.append('IdLecture', IdLecture)
    formData.append('IdCourse', IdCourse)
    formData.append('IdSection', IdSection)
    if(LectureStatus){
        formData.append('LectureStatus', LectureStatus)
    }
    formData.append('Title', Title)
    formData.append('Introduction', Introduction === null ? "" : Introduction)
    formData.append('LectureVideo', LectureVideo || "")
    formData.append('MainMaterials', MainMaterials || "")
    SupportMaterials.forEach((item, index) => {
        formData.append(`SupportMaterials`, item)
    })

    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }

    return await axios.post(baseUrl + "/UpdateLecture?idCreatedBy=" + idCreatedBy, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log("response.data.message: ", response.data.message);
        return response.data.message
    })
    .catch(error => {
        console.log("Error UpdateLecture: ", error.request);
    })
}