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
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error RunCodeTest: ", error);
    })
}