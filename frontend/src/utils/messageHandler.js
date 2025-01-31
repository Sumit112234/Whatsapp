import axios from "axios";

let BackendUrl = import.meta.env.NODE_ENV === "production" ? import.meta.env.VITE_API_URL : '/api'; 

export async function sendMessage(message,senderId,recieverId){
    
    
    try {
        let res = await axios.post(`${BackendUrl}/messages/send/${recieverId}`, {senderId,message},{
            withCredentials : true,
        });
        //console.log("response from saveMessages : ", res.data);
        return res;
    } catch (e) {
        //console.log(e?.message);
        return null;
    }

}

export async function getMessage(senderId,receiverId){
    
    
    try {
        let res = await axios.get(`${BackendUrl}/messages/${receiverId}`,{
            withCredentials : true,
        });
        // //console.log(res, res.data);
        return res.data.messages;
    } catch (e) {
        //console.log(e?.message);
        return null;
    }

}
