import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Message"

export const sendMessage = async (message)=>{
    console.log(message);
    const url = baseUrl + "/SendMessage"
    return await axios.post(url, message)
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        // console.log("Error sendMessage: ", error.response);
    })
}
