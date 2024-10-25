import axios from "axios"
const baseUrl = "http://192.168.2.3:5000/api/Center"

export const getAllCenterCards = async ()=>{
    return await axios.get(baseUrl + "/GetAllCenterCards")
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error getAllCenterCards: ", error);
    })
}