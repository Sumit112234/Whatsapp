import React, { useEffect, useState } from 'react'
import { ImFolderDownload } from 'react-icons/im'
import { chatsData } from '../../data/data';
import Chat from './Chat'
import { getAllUser } from '../../utils/userHandler';
import { useSocketContext } from '../../context/socketContext';
import { useAuth } from '../../context/AuthContext';

const Chats = ({filter, chats, setChats,filteredChats}) => {
  
  const { onlineUsers } = useSocketContext();
  const { darkTheme  } = useAuth();


  
  // useEffect(()=>{
  //   let newchats = filter?chats.filter((chat)=> chat.unreadMsgs):chatsData;
  //   setChats(newchats)
  // },[filter])

  return (
    // chats main container
    <div
    className={`  flex flex-col overflow-y-scroll scroll-smooth scrollbar-thin scrollbar-thumb-rounded cursor-pointer h-3/4 ${
      darkTheme
        ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        : "scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-white"
    }`}
  >
    {/* Archived container */}
    <div
      className={`flex justify-between items-center w-100 min-h-[55px] px-3 ${
        darkTheme ? "hover:bg-[#202d33] text-white" : "hover:bg-gray-200 text-black"
      }`}
    >
      {/* Icons and text container */}
      <div className="flex justify-around items-center w-[150px]">
        {/* Icon */}
        <span
          className={`text-lg ${
            darkTheme ? "text-emerald-500" : "text-emerald-700"
          }`}
        >
          <ImFolderDownload />
        </span>
        <h6 className={darkTheme ? "text-white" : "text-black"}>Archived</h6>
      </div>
      {/* Number of archived chats */}
      <p
        className={`text-xs font-light ${
          darkTheme ? "text-emerald-500" : "text-emerald-700"
        }`}
      >
        7
      </p>
    </div>
  
    {/* Chat single */}
    {/* {console.log(filteredChats)} */}
    {filteredChats.length > 0 &&
      filteredChats.map((chatDetails, i) => {
        return (
          <Chat
            key={chatDetails._id}
            chatDetails={chatDetails}
            active={i === 1}
            isOnline={onlineUsers.find((id) => id === chatDetails._id)}
          />
        );
      })}
  </div>
  
  )
}

export default Chats;
