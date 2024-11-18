import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Notification"

export const getAllNotificationOfUser = async (idUser)=>{
    const url = baseUrl + "/GetAllNotificationOfUser?IdUser=" + idUser
    return await axios.get(url)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllNotificationOfUser: ", error);
    })
}

export const changeReadStatus = async (idNoti, idUser)=>{
    const url = baseUrl + "/ChangeReadStatus?idNotification=" + idNoti + "&idUpdatedBy=" + idUser
    // console.log(url);
    return await axios.post(url)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error changeReadStatus: ", error);
    })
}

export const readAllNotification = async (idUser)=>{
    const url = baseUrl + "/ReadAllNotification?idUpdatedBy=" + idUser
    return await axios.post(url)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error readAllNotification: ", error);
    })
}

export const getNotificationBoardOfCourse = async (idCourse)=>{
    const url = baseUrl + "/GetNotificationBoardOfCourse?idCourse=" + idCourse
    return await axios.get(url)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getNotificationBoardOfCourse: ", error);
    })
}

export const addBoardNotificationForCourse = async (idCourse, content, idCreatedBy)=>{
    const url = baseUrl + "/AddBoardNotificationForCourse?idCourse=" + idCourse + "&content=" + content + "&idCreatedBy=" + idCreatedBy
    return await axios.post(url)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error addBoardNotificationForCourse: ", error);
    })
}
