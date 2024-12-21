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
        formData.append(`AssignmentItems[${index}].pathFile`, "")
        formData.append(`AssignmentItems[${index}].fileName`, "")
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
        formData.append(`AssignmentItems[${index}].pathFile`, "")
        formData.append(`AssignmentItems[${index}].fileName`, "")
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
        // console.log(response.data);
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

export const getAssignmentInfo = async (idAssignment)=>{
    return await axios.get(baseUrl + "/GetAssignmentInfo?idAssignment=" + idAssignment)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAssignmentInfo: ", error);
    })
}

export const publishAssignment = async (idAssignment, idUpdatedBy)=>{
    return await axios.post(baseUrl + "/PublishAssignment?idAssignment=" + idAssignment + "&idUpdatedBy=" + idUpdatedBy)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error PublishAssignment: ", error);
    })
}

export const updateAssignment = async (updatedBy, updateData)=>{
    // console.log("updateData: ", updateData.assignmentItems);
    const formData = new FormData()
    formData.append('IdAssignment', updateData.idAssignment)
    formData.append('Title', updateData.title || "")
    formData.append('StartDate', updateData.startDate || "")
    formData.append('DueDate', updateData.dueDate || "")
    formData.append('Duration', updateData.duration || "")
    formData.append('IsPublish', updateData.isPublish)
    formData.append('IsShufflingQuestion', updateData.isShufflingQuestion)
    formData.append('IsShufflingAnswer', updateData.isShufflingAnswer)
    formData.append('ShowAnswer', updateData.showAnswer)
    formData.append('AssignmentStatus', updateData.assignmentStatus)

    updateData.assignmentItems.forEach((question, index)=>{
        formData.append(`AssignmentItems[${index}].idAssignmentItem`, question.idAssignmentItem);
        formData.append(`AssignmentItems[${index}].question`, question.question);
        formData.append(`AssignmentItems[${index}].mark`, question.mark);
        formData.append(`AssignmentItems[${index}].explanation`, question.explanation || "");
        formData.append(`AssignmentItems[${index}].isMultipleAnswer`, question.isMultipleAnswer || 0);
        if(question.attachedFile) {
            formData.append(`AssignmentItems[${index}].attachedFile`, question.attachedFile);
        }
        formData.append(`AssignmentItems[${index}].isDeletedFile`, question.isDeletedFile || 0);
        formData.append(`AssignmentItems[${index}].assignmentItemAnswerType`, question.assignmentItemAnswerType || "");
        formData.append(`AssignmentItems[${index}].assignmentItemStatus`, question.assignmentItemStatus);
    
        question.items?.forEach((item, indexItem)=>{
            formData.append(`AssignmentItems[${index}].items[${indexItem}].idMultipleAssignmentItem`, item.idMultipleAssignmentItem || 0);
            formData.append(`AssignmentItems[${index}].items[${indexItem}].content`, item.content);
            formData.append(`AssignmentItems[${index}].items[${indexItem}].isCorrect`, item.isCorrect);
            formData.append(`AssignmentItems[${index}].items[${indexItem}].multipleAssignmentItemStatus`, item.multipleAssignmentItemStatus);
        })
    })

    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value, "\n");
    // }

    return await axios.post(baseUrl + "/UpdateAssignment?updatedBy=" + updatedBy, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }}
    )
    .then(response => {
        return response.data
    })
    .catch(error => {
        console.log("Error UpdateAssignment: ", error.request);
        if (error.response) {
            console.log("Server response: ", error.response.data);
        }
    })
}

export const getAllTestCardOfStudent = async (idStudent)=>{
    return await axios.get(baseUrl + "/GetAllTestCardOfStudent?idStudent=" + idStudent)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllTestCardOfStudent: ", error);
    })
}

export const getDetailAssignmentForStudent = async (idAssignment, idStudent)=>{
    return await axios.get(baseUrl + "/GetDetailAssignmentForStudent?idAssignment=" + idAssignment + "&idStudent=" + idStudent)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetDetailAssignmentForStudent: ", error);
    })
}

export const getDetailAssignmentItemForStudent = async (idAssignment)=>{
    return await axios.get(baseUrl + "/GetDetailAssignmentItemForStudent?idAssignment=" + idAssignment)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getDetailAssignmentItemForStudent: ", error);
    })
}

export const GetExerciseOfLecture = async (idLecture, idStudent)=>{
    const urlStudent = idStudent ? "&idStudent=" + idStudent : ""
    return await axios.get(baseUrl + "/GetExerciseOfLecture?idLecture=" + idLecture + urlStudent)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetExerciseOfLecture: ", error);
    })
}

export const submitQuizAssignment = async (answer)=>{
    return await axios.post(baseUrl + "/SubmitQuizAssignment", answer)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error SubmitQuizAssignment: ", error);
    })
}

export const getAssignmentAnswer = async (idAssignment, idStudent)=>{
    return await axios.get(baseUrl + "/GetAssignmentAnswer?idAssignment=" + idAssignment + "&idStudent=" + idStudent)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAssignmentAnswer: ", error);
    })
}

export const submitManualAssignment = async (result)=>{
    const formData = new FormData()
    formData.append('IdAssignment', result.idAssignment)
    formData.append('IdStudent', result.idStudent)
    formData.append('Duration', result.duration)
    formData.append('AssignmentResultStatus', result.assignmentResultStatus)
    formData.append('SubmittedDate', result.submittedDate)

    result.answers.forEach((answer, index)=>{
        formData.append(`Answers[${index}].idAssignmentItem`, answer.idAssignmentItem)
        if(answer.answer){
            formData.append(`Answers[${index}].answer`, answer.answer)
        }
        if(answer.attachedFile){
            formData.append(`Answers[${index}].attachedFile`, answer.attachedFile)
        }
    })
    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value, "\n");
    // }
    return await axios.post(baseUrl + "/SubmitManualAssignment", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("submitManualAssignment: ", error.request);
    })
}

export const getOverviewAssignment = async (idAssignment, idCourse)=>{
    return await axios.get(baseUrl + "/GetOverviewAssignment?idAssignment=" + idAssignment + "&idCourse=" + idCourse)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetOverviewAssignment: ", error);
    })
}

export const gradingManualAssignment = async (idUpdatedBy, gradingManual)=>{
    return await axios.post(baseUrl + "/GradingManualAssignment?idUpdatedBy=" + idUpdatedBy, gradingManual)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GradingManualAssignment: ", error);
    })
}