import axios from "axios"
import { currentIP } from "../utils/constants"
const baseUrl = "http://" + currentIP +":5000/api/Lecture"

export const addLecture = async (idCreatedBy, IdCourse, IdSection, Title, Introduction, LectureVideo, MainMaterials, SupportMaterials)=>{
    console.log(idCreatedBy, IdCourse, IdSection, Title, Introduction, LectureVideo, MainMaterials, SupportMaterials);
    const formData = new FormData()
    formData.append('IdCourse', IdCourse)
    formData.append('IdSection', IdSection)
    formData.append('Title', Title)
    formData.append('Introduction', Introduction)
    formData.append('LectureVideo', LectureVideo)
    formData.append('MainMaterials', MainMaterials)
    formData.append('SupportMaterials', SupportMaterials)
    return await axios.post(baseUrl + "/AddLecture?idCreatedBy=" + idCreatedBy, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        // console.log(response.data);
        return response.data.message
    })
    .catch(error => {
        console.log("Error addLecture: ", error.response);
    })
}
