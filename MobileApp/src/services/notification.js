import axios from "axios"
// const baseUrl = "http://10.10.27.112:5000/api/Notification"
const baseUrl = "http://192.168.1.209:5000/api/Notification"


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