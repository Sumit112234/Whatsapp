import { useEffect, useRef } from "react";
import { useSocketContext } from "../context/socketContext";
import notificationSound from "../../public/new-message-sound.mp3";
import moment from "moment";
import { useAuth } from "../context/AuthContext";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, unreadCounts, setUnreadCounts } = useSocketContext();
  const { selectedUser, user } = useAuth();

  const lastMessageTimeRef = useRef(0); // Store timestamp of the last received message

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const currentTime = Date.now();

      // Prevent rapid consecutive updates (less than 300ms apart)
      if (currentTime - lastMessageTimeRef.current < 300) {
        //console.log("Skipping message due to rapid succession.");
        return;
      }

      lastMessageTimeRef.current = currentTime;

      const formattedMessage = {
        message: newMessage.message,
        time: moment(newMessage.createdAt).format("hh:mm A"),
        status: "delivered",
        isUser: newMessage.senderId === user?._id,
      };

      if (
        (newMessage.senderId === selectedUser?._id && newMessage.receiverId === user?._id) ||
        (newMessage.receiverId === selectedUser?._id && newMessage.senderId === user?._id)
      ) {
        setMessages((prev) => {
          if (prev.length > 0) {
            const lastMessage = prev[prev.length - 1];
            if (
              lastMessage.message === formattedMessage.message &&
              lastMessage.time === formattedMessage.time &&
              lastMessage.isUser === formattedMessage.isUser
            ) {
              //console.log("Skipping duplicate message.");
              return prev;
            }
          }
          return [...prev, formattedMessage];
        });

        if (newMessage.senderId === selectedUser?._id) {
          const sound = new Audio(notificationSound);
          sound.play();
        }
      } else if (newMessage.receiverId === user?._id) {
        setUnreadCounts((prevCounts) => {
          if (!prevCounts[newMessage.senderId]) {
            return { ...prevCounts, [newMessage.senderId]: 1 };
          }
          return { ...prevCounts, [newMessage.senderId]: prevCounts[newMessage.senderId] + 1 };
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, user, setMessages, setUnreadCounts]);

  return { unreadCounts };
};

export default useListenMessages;
