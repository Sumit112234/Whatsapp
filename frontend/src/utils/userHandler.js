import axios from 'axios';
let BackendUrl = import.meta.env.NODE_ENV === "production" ? import.meta.env.VITE_API_URL : '/api'; 

// console.log(BackendUrl)
export async function getUser(){

    
    try {
        let user = await axios.get(`${BackendUrl}/users/getuser`, {
            withCredentials : true,
        });
        return user.data.loggedInUser;
    } catch (e) {
        // console.log(e);
        return null;
    }

}
export async function updateUser(data){

    
    try {
        let user = await axios.post(`${BackendUrl}/users/update-profile`,data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials:true,
          });
        // console.log(user);
        return user;
    } catch (e) {
        console.log(e);
        return null;
    }

}

export async function getAllUser(){

    
    try {
        let users = await axios.get(`${BackendUrl}/users`, {
            withCredentials : true,
        });
        // console.log(users);
        return users.data;
    } catch (e) {
        // console.log(e);
        return null;
    }

}

export async function registerUser(data){

    // console.log(data);
    try {
        let user = await axios.post(`${BackendUrl}/auth/signup`, data, {
            withCredentials: true,
        });
        return user;
    } catch (e) {
        // console.log(e);
        return null;
    }

}

export async function loginUser(data){
    
    // console.log(data);
    try {
        let user = await axios.post(`${BackendUrl}/auth/login`, data,{
            withCredentials : true,
            
        });
        
			localStorage.setItem("chat-user", JSON.stringify(user?.data?.user));
            
			// setAuthUser(data);
        return user;
    } catch (e) {
        // console.log(e?.message);
        return null;
    }

}

export async function logoutUser(){
    
    
    try {
        let user = await axios.get(`${BackendUrl}/auth/logout`, {
            withCredentials : true
        });
        // console.log("logout success", user)
        localStorage.removeItem("chat-user");
        
    } catch (e) {
        // console.log(e?.message);
        return null;
    }

}