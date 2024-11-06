import axios from "axios"
// const baseUrl = "http://192.168.2.3:5000/api/Tag"
const baseUrl = "http://192.168.1.209:5000/api/Tag"

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