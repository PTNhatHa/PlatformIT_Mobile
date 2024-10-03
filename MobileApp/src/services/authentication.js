import axios from "axios"
const baseUrl = "http://localhost:5251/api/Authentication"
export const signup = async (name, email, username, password, tin)=>{
    // const url = baseUrl + "/signup"
    // console.log("Url: ", url);
    // return await axios.post(url, {
    //     "fullName": name,
    //     "email": email,
    //     "username": username,
    //     "password": password,
    //     "tin": tin
    // })
    // .then(response => {
    //     console.log("==> ", response);
    // })
    // .catch(error => {
    //     console.log("==> ", error);
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

export const signin = async (username, password)=>{
    // const url = baseUrl + "/SignInByPassword"
    // return await axios.post(url, {
    //     "username": username,
    //     "password": password
    // })
    // .then(response => {
    //     console.log("==> ", response);
    // })
    // .catch(error => {
    //     console.log("==> ", error);
    // })
    switch(username){
        case "Student":
            return {
                data: "Sign in successfully",
                success: 200,
                idRole: 3
            }
        case "Teacher":
            return {
                data: "Sign in successfully",
                success: 200,
                idRole: 4
            }
        default:
            return {
                data: "Username or Password is incorrect.",
                error: 400
            }
    }
}