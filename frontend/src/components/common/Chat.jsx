import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocketContext } from "../../context/socketContext";

const Chat = ({ chatDetails, isOnline }) => {
  const {
    selectedUser,
    setSelectedUser,
    setMobileSelectedUser,
    user,
    darkTheme,
  } = useAuth();
  let { profilePic, fullName, createdAt, _id, unreadMessages, lastMessage } =
    chatDetails;

  function formatDate(dateString) {
    const inputDate = new Date(dateString);
    const now = new Date();

    const options = { hour: "numeric", minute: "numeric", hour12: true }; // For time format like 05:00PM
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const isToday = inputDate.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = inputDate.toDateString() === yesterday.toDateString();

    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    if (isToday) {
      return inputDate.toLocaleTimeString("en-US", options);
    } else if (isYesterday) {
      return "Yesterday";
    } else if (inputDate >= oneWeekAgo) {
      return dayNames[inputDate.getDay()];
    } else {
      return inputDate.toLocaleDateString("en-US");
    }
  }

  const { unreadCounts, setUnreadCounts } = useSocketContext();
  const unreadEntry = user.unreadMessages.find(
    (entry) => entry.userId.toString() === _id
  );

  // const [totalMessages, setTotalMessages] = useState(unreadEntry ? unreadEntry.totalMessages : null);
  // const { unreadCounts } = useSocketContext();

  // Find the initial unread entry for the user

  // State for totalMessages
  const [totalMessages, setTotalMessages] = useState(
    unreadEntry ? unreadEntry.totalMessages : null
  );

  // Update totalMessages dynamically when unreadCounts change
  useEffect(() => {
    if (unreadCounts && unreadCounts[_id] !== undefined) {
      setTotalMessages(unreadCounts[_id]); // Update totalMessages based on unreadCounts for the specific user
    }
  }, [unreadCounts, _id]);

  const lastMessageIdx = user.lastMessage.find(
    (entry) => entry.userId.toString() === _id
  );

  const [lmessage, setlMessage] = useState(
    lastMessageIdx ? lastMessageIdx.message : "no"
  );

  useEffect(() => {
    if (selectedUser && selectedUser._id === _id) {
      setTotalMessages(null);
      setUnreadCounts((pre) => {
        delete pre[_id];
        return pre;
      });
    }
  }, [selectedUser]);

  return (
    <div
      onClick={() => {setSelectedUser(chatDetails); setMobileSelectedUser(true)}}
      className={`${
        selectedUser?._id === _id
          ? darkTheme
            ? "bg-[#202d33]"
            : "bg-gray-200"
          : ""
      }`}
    >
      <div className="line w-[95%] mx-auto flex justify-end">
        <div
          className={`h-[1px] w-[85%] ${
            darkTheme ? "bg-[#202d33]" : "bg-gray-300"
          }`}
        ></div>
      </div>
      <div
        className={`main flex justify-between items-center cursor-pointer w-100 h-[85px] px-3 ${
          darkTheme ? "hover:bg-[#202d33]" : "hover:bg-gray-200"
        }`}
      >
        <div className="relative flex items-center">
          {isOnline && (
            <div
              className={`absolute top-0 right-2 w-3 h-3 ${
                darkTheme ? "bg-green-500" : "bg-green-600"
              } rounded-full`}
            ></div>
          )}
          <img
            src={profilePic}
            alt="profile-picture"
            className="w-12 h-12 rounded-full mr-5"
          />
        </div>

        <div className="flex justify-between w-100 h-100 py-3">
          <div
            className={`flex flex-col justify-between gap-1 ${
              darkTheme ? "text-white" : "text-black"
            }`}
          >
            <span className="font-normal">{fullName}</span>
            <span
              className={`text-sm ${
                true
                  ? darkTheme
                    ? "text-neutral-400"
                    : "text-gray-600"
                  : darkTheme
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {lmessage}
            </span>
          </div>
          <div
            className={`flex flex-col justify-between items-end h-100 text-xs ${
              darkTheme ? "text-white" : "text-gray-600"
            }`}
          >
            <span
              className={`min-w-[55px] ${
                darkTheme ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {formatDate(createdAt)}
            </span>
            {totalMessages && (
              <div
                className={`flex justify-center items-center rounded-full w-[20px] h-[20px] ${
                  darkTheme ? "bg-emerald-500" : "bg-emerald-400"
                }`}
              >
                <p
                  className={`fw-bold mb-0 ${
                    darkTheme ? "text-emerald-900" : "text-emerald-800"
                  }`}
                >
                  {totalMessages}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
