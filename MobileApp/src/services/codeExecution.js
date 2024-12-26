import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/CodeExecution"

export const getAllActiveLanguage = async ()=>{
    return await axios.get(baseUrl + "/GetAllActiveLanguage")
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllActiveLanguage: ", error);
    })
}

export const runCodeTest = async (codeTest)=>{  
    return await axios.post(baseUrl + "/RunCodeTest", codeTest)
    .then(response => {
        return response.data
    })
    .catch(error => {
        console.log("Error RunCodeTest: ", error);
    })
}

export const createCodeAssignment = async (data)=>{  
    return await axios.post(baseUrl + "/CreateCodeAssignment", data)
    .then(response => {
        // console.log(response);
        return response
    })
    .catch(error => {
        console.log("Error CreateCodeAssignment: ", error.response);
    })
}

export const viewCodeAssignment = async (idAssignment, isTeacherView)=>{ 
    return await axios.get(baseUrl + "/ViewCodeAssignment?idAssignment=" + idAssignment + "&isTeacherView=" + isTeacherView)
    .then(response => {
        // console.log(response);
        return response.data
    })
    .catch(error => {
        console.log("Error ViewCodeAssignment: ", error.response);
    })
}

export const submitCode = async (result)=>{ 
    return await axios.post(baseUrl + "/SubmitCode", result)
    .then(response => {
        return response
    })
    .catch(error => {
        console.log("Error SubmitCode: ", error.response);
    })
}

export const getCodeAssignmentResult = async (idAssignment, idStudent)=>{ 
    return await axios.get(baseUrl + "/GetCodeAssignmentResult?idAssignment=" + idAssignment + "&idStudent=" + idStudent)
    .then(response => {
        return response.data
    })
    .catch(error => {
        console.log("Error GetCodeAssignmentResult: ", error.response);
    })
}

export const updateCodeAssignment = async (dataUpdate)=>{ 
    return await axios.post(baseUrl + "/UpdateCodeAssignment", dataUpdate)
    .then(response => {
        return response
    })
    .catch(error => {
        console.log("Error UpdateCodeAssignment: ", error.response);
    })
}

export const studentRunCode = async (code)=>{ 
    return await axios.post(baseUrl + "/StudentRunCode", code)
    .then(response => {
        return response.data
    })
    .catch(error => {
        console.log("Error StudentRunCode: ", error.response);
    })
}