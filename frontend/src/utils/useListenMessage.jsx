import { useEffect, useState } from "react";
import { useSocketContext } from "../context/socketContext";
import notificationSound from "../assets/new-message-sound.mp3";
import moment from "moment";
import { useAuth } from "../context/AuthContext";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { message, setMessages , unreadCounts, setUnreadCounts } = useSocketContext();
  const { selectedUser, user } = useAuth();

  // State to track unread message counts for each user
 

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      //console.log("Message from unreadcount before update:", unreadCounts);
  
      if (
        (newMessage.senderId === selectedUser?._id && newMessage.receiverId === user?._id) ||
        (newMessage.receiverId === selectedUser?._id && newMessage.senderId === user?._id)
      ) {
        const formattedMessage = {
          message: newMessage.message,
          time: moment(newMessage.createdAt).format("hh:mm A"),
          status: "delivered",
          isUser: newMessage.senderId === user?._id,
        };
  
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
  
        if (newMessage.senderId === selectedUser?._id) {
          const sound = new Audio(notificationSound);
          sound.play();
        }
      } else if (newMessage.receiverId === user?._id) {
        setUnreadCounts((prevCounts) => {
          const updatedCounts = {
            ...prevCounts,
            [newMessage.senderId]: (prevCounts[newMessage.senderId] || 0) + 1,
          };
          //console.log("Updated unread counts:", updatedCounts);
          return updatedCounts;
        });
      }
    });
  
    return () => socket?.off("newMessage");
  }, [socket, selectedUser, user, setMessages, unreadCounts]);
  
  return { unreadCounts };
};

export default useListenMessages;
