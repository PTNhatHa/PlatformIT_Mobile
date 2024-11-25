import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Assignment"

export const createManualAssignment = async (
    Title, IdCourse, IsTest, IdLecture, StartDate, DueDate, Duration,
    AssignmentType, IsPublish, IsShufflingQuestion, AssignmentItems, CreatedBy
)=>{
    // console.log(Title, IdCourse, IsTest, IdLecture, StartDate, DueDate, Duration,
    //     AssignmentType, IsPublish, IsShufflingQuestion, AssignmentItems, CreatedBy);
    const formData = new FormData()
    formData.append('Title', Title)
    formData.append('IdCourse', IdCourse)
    formData.append('IsTest', IsTest)

    formData.append('IdLecture', IdLecture)
    formData.append('StartDate', StartDate)
    formData.append('DueDate', DueDate)
    formData.append('Duration', Duration)

    formData.append('AssignmentType', AssignmentType)
    formData.append('IsPublish', IsPublish)
    formData.append('IsShufflingQuestion', IsShufflingQuestion)

    AssignmentItems.forEach((question, index)=>{
        formData.append(`AssignmentItems[${index}].question`, question.question)
        formData.append(`AssignmentItems[${index}].mark`, question.mark)
        formData.append(`AssignmentItems[${index}].assignmentItemAnswerType`, question.assignmentItemAnswerType)
        formData.append(`AssignmentItems[${index}].attachedFile`, question.attachedFile)
    })
    formData.append('CreatedBy', CreatedBy)
    return await axios.post(baseUrl + "/CreateManualAssignment", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error CreateManualAssignment: ", error.request);
    })
}

export const getAllAssignmentCardOfTeacher = async (idTeacher)=>{
    return await axios.get(baseUrl + "/GetAllAssignmentCardOfTeacher?idTeacher=" + idTeacher)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllAssignmentCardOfTeacher: ", error);
    })
}

export const deleteAssignment = async (idAssignment, idUpdatedBy)=>{
    return await axios.delete(baseUrl + "/DeleteAssignment?idAssignment=" + idAssignment + "&idUpdatedBy=" + idUpdatedBy)
    .then(response => {
        // console.log(response.data);
        return response.data.message
    })
    .catch(error => {
        console.log("Error deleteAssignment: ", error);
    })
}