import axios from "axios"
const baseUrl = "http://192.168.2.3:8081/api/Authentication"
export const signupApi = async (name, email, username, password, tin)=>{
    // const url = baseUrl + "/signup"
    // console.log("Url: ", url);
    // return await axios.post(url, {
    //     "fullName": name,
    //     "email": "string",
    //     "username": username,
    //     "password": password,
    //     "tin": tin
    // })
    // .then(response => {
    //     console.log("==>Response:  ", response.data);
    // })
    // .catch(error => {
    //     console.log("==>Error:  ", error);
    // })
    switch(username){
        case "Email":
            return {
                data: "This email already exists",
                error: 400
            }
        case "Username":
            return {
                data: "This username already exists",
                error: 400
            }
        default:
            return {
                data: "Sign up successfully",
                success: 200
            }
    }
}

export const signinApi = async (username, password)=>{
    // const url = baseUrl + "/SignInByPassword"
    // return await axios.post(url, {
    //     "username": username,
    //     "password": password
    // })
    switch(username){
        case "Student":
            return {
                data: "Sign in successfully",
                success: 200,
                idRole: 3,
                idUser: '001'
            }
        case "Teacher":
            return {
                data: "Sign in successfully",
                success: 200,
                idRole: 4,
                idUser: '002'
            }
        default:
            return {
                data: "Username or Password is incorrect.",
                error: 400
            }
    }
}