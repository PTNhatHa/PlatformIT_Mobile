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


export const createQuizAssignment = async (
    Title, IdCourse, IsTest, IdLecture, StartDate, DueDate, Duration,
    AssignmentType, IsPublish, IsShufflingQuestion, IsShufflingAnswer, ShowAnswer, 
    AssignmentItems, CreatedBy
)=>{
    // console.log(Title, IdCourse, IsTest, IdLecture, StartDate, DueDate, Duration,
    //     AssignmentType, IsPublish, IsShufflingQuestion, IsShufflingAnswer, ShowAnswer, 
    //     AssignmentItems, CreatedBy);
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
    formData.append('IsShufflingAnswer', IsShufflingAnswer)
    formData.append('ShowAnswer', ShowAnswer)

    AssignmentItems.forEach((question, index)=>{
        formData.append(`AssignmentItems[${index}].question`, question.question)
        formData.append(`AssignmentItems[${index}].mark`, question.mark)
        formData.append(`AssignmentItems[${index}].explanation`, question.explanation || "")
        formData.append(`AssignmentItems[${index}].isMultipleAnswer`, question.isMultipleAnswer === false ? 0 : 1)
        if(question.attachedFile){
            formData.append(`AssignmentItems[${index}].attachedFile`, question.attachedFile)
        }
        question.items.forEach((item, indexItem) => {
            formData.append(`AssignmentItems[${index}].items[${indexItem}].content`, item.content)
            formData.append(`AssignmentItems[${index}].items[${indexItem}].isCorrect`, item.isCorrect === false ? 0 : 1)
            formData.append(`AssignmentItems[${index}].items[${indexItem}].multipleAssignmentItemStatus`, 1)
        })
    })
    formData.append('CreatedBy', CreatedBy)

    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value);
    // }

    return await axios.post(baseUrl + "/CreateQuizAssignment", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error CreateQuizAssignment: ", error.request);
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