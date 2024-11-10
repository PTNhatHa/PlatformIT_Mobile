import axios from "axios"
import { currentIP } from "../utils/constants"
// const baseUrl = "http://10.10.27.112:5000/api/Tag"
const baseUrl = "http://" + currentIP + ":5000/api/Tag"

export const getAlltag = async ()=>{
    return await axios.get(baseUrl + "/GetAlltag")
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAlltag: ", error);
    })
}