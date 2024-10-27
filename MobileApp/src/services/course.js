import axios from "axios"
const baseUrl = "http://192.168.2.3:5000/api/Course"

export const getAllCourseCards = async ()=>{
    return await axios.get(baseUrl + "/GetAllCourseCards")
    .then(response => {
        // console.log(response.data);
        return response.data
    })
    .catch(error => {
        console.log("Error GetAllCourseCards: ", error);
    })
}