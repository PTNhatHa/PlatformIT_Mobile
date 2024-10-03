import axios from "axios"
const baseUrl = "http://127.0.0.1:5251/api/Authentication"
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
                error: "Email"
            }
        case "Username":
            return {
                data: "This username already exists",
                error: "Username"
            }
        default:
            return {
                data: "Sign up successfully",
                success: "Username"
            }
    }
}