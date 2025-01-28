import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

let BackendUrl = import.meta.env.VITE_API_URL;

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [unreadCounts, setUnreadCounts] = useState({});
    const { user } = useAuth();
	
	useEffect(() => {

		if (user) {
			console.log('socket url : ', BackendUrl.slice(0,37))
			const socket = io(BackendUrl.slice(0,37), {
				query: {
					userId: user._id,
				},
			});

			setSocket(socket);
			console.log(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
				// ////console.log("All online users : ", users);
			});

			return () => socket?.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [user]);

	const value = {
		socket, 
		onlineUsers,
		messages,
		setMessages,
		unreadCounts, 
		setUnreadCounts
	  };

	return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};