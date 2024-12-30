import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = currentIP + ":5000/api/Payment"

export const getAllPaymentOfStudent = async (idStudent)=>{
    return await axios.get(baseUrl + "/GetAllPaymentOfStudent?idStudent=" + idStudent)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllPaymentOfStudent: ", error);
    })
}