import axios from "axios"
// const baseUrl = "http://10.10.27.112:5000/api/User"
const baseUrl = "http://192.168.1.209:5000/api/User"


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

export const getAvaImg = async (idUser)=>{
    const url = baseUrl + "/GetAvaImg?id=" + idUser
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
    // console.log("==>zooo");
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
    const url = baseUrl + "/AddProfileLink"
    return await axios.post(url, {
        "idUser": idUser,
        "idCenter": null,
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
        // console.log("==>Response: ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error: ", error);
        return {
            error: 400,
            data: error.response.data
        }
    })
}

export const updateTeacherSpecializedPI = async (idUser, teachingMajor, description)=>{
    const url = baseUrl + "/UpdateTeacherSpecializedPI"
    return await axios.post(url, {
        "idUser": idUser,
        "teachingMajor": teachingMajor,
        "description": description,
        "links": [],
        "qualificationModels": []
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

export const changeAvatar = async (idUser, linkAva)=>{
    const url = baseUrl + "/ChangeAvatar"
    const formData = new FormData()
    formData.append('IdUser', idUser)
    formData.append('AvatarFile', linkAva)
    return await axios.post(url, formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log("==>Response: ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error: ", error);
        return {
            error: 400,
            data: error
        }
    })
}

export const removeAvatar = async (idUser)=>{
    const url = baseUrl + "/RemoveAvatar"
    return await axios.post(url, {
        "idUser": idUser,
        "idCenter": null
      })
    .then(response => {
        return true
    })
    .catch(error => {
        console.log("==>Error: ", error.message);
        return {
            error: 400,
            data: error
        }
    })
}

export const addQualification = async (idUser, QualificationName, Description, file)=>{
    const url = baseUrl + "/AddQualification"
    const formData = new FormData()
    formData.append('IdUser', idUser)
    formData.append('IdCenter', "")
    formData.append('QualificationName', QualificationName)
    formData.append('Description', Description)
    formData.append('QualificationFile', file) 
    
    return await axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log("==>Response: ", response);
        return response
    })
    .catch(error => {
        console.log("==>Error: ", error.response?.data || error.message);
        return {
            error: error.response?.status || 400,
            data: error.response?.data || error.message
        }
    })
}

export const deleteQualification = async (id)=>{
    const url = baseUrl + "/DeleteQualification?id=" + id
    return await axios.delete(url)
    .then(response => {
        // console.log("==>Response: ", response.data);
        return response.data
    })
    .catch(error => {
        // console.log("==>Error: ", error);
        return {
            error: 400,
            data: error.response.data
        }
    })
}

export const getAllTeacherCards = async ()=>{
    return await axios.get(baseUrl + "/GetAllTeacherCards")
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllTeacherCards: ", error);
    })
}

export const getDetailTeacher = async (idUser)=>{
    const url = baseUrl + "/GetDetailTeacher?idTeacher=" + idUser
    return await axios.get(url)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getDetailTeacher: ", error);
    })
}
