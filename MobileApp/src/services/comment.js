import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Comment"

export const addComment = async (newCmt)=>{
    return await axios.post(baseUrl + "/AddComment", newCmt)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error AddComment: ", error);
    })
}

export const getAllCommentOfLecture = async (lectureId)=>{
    return await axios.get(baseUrl + "/GetAllCommentOfLecture?lectureId=" + lectureId)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllCommentOfLecture: ", error);
    })
}

export const deleteComment = async (idComment, idUpdatedBy)=>{
    return await axios.post(baseUrl + "/DeleteComment?idComment=" + idComment + "&idUpdatedBy=" + idUpdatedBy)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error DeleteComment: ", error);
    })
}
