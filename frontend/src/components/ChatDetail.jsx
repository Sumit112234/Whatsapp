import React, { useState, useEffect } from "react";
import RoundedBtn from "./common/RoundedBtn";
import { MdSearch } from "react-icons/md";
import { HiDotsVertical, HiOutlinePaperClip } from "react-icons/hi";
import { BiHappy } from "react-icons/bi";
import { cs1 } from "../assets/whatsapp";
import { BsFillMicFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../utils/userHandler";
import { useNavigate } from "react-router-dom";
import { getMessage, sendMessage } from "../utils/messageHandler";
import moment from "moment";
import { useSocketContext } from "../context/socketContext";
import useListenMessages from "../utils/useListenMessage";

const ChatDetail = () => {
  const [userInput, setUserInput] = useState("");
  const [element, setElement] = useState(""); // b0 b1 g0 g1
  const { selectedUser, setSelectedUser,user, setUser, darkTheme, setMobileSelectedUser } = useAuth();
  const { socket, messages, setMessages } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();
  useListenMessages();
  

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    let AllMessages = [...messages];
    let updatedMessages = [
      ...AllMessages,
      {
        message: userInput,
        time: moment().format("hh:mm A"),
        status: "sending",
        isUser: true,
      },
    ];
    setMessages(updatedMessages);
    setUserInput("");
    //console.log(selectedUser.fullName, "<-", user.fullName);
    await sendMessage(userInput, user._id, selectedUser._id);
    updatedMessages = [
      ...AllMessages,
      {
        message: userInput,
        time: moment().format("hh:mm A"),
        status: "delivered",
        isUser: true,
      },
    ];
    setMessages(updatedMessages);
  };

  const handleInp = (e) => {
    handleTyping();
    setUserInput(e.target.value);
  };
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (e) {
      //console.log("error in log out", e);
    }
  };

  const getOldMessagesData = async () => {
    let fetchedMessages = await getMessage(user._id, selectedUser._id);

    //console.log("fetched messages from chatDetails ", fetchedMessages);
    const formattedMessages = fetchedMessages.map((msg, index, array) => {
      const isUser = msg.senderId === user._id;

      const isFirstMsg =
        index === 0 || array[index - 1].senderId !== msg.senderId;

      return {
        message: msg.message,
        time: moment(msg.createdAt).format("hh:mm A"),
        status: msg.read ? "seen" : "delivered",
        isUser,
        isFirstMsg,
      };
    });

  
    // if(user._id === selectedUser._id)
    setMessages(formattedMessages);
  };

  useEffect(() => {
    // //console.log("current user -> ",user.fullName, user.username);
    // //console.log("Opponent user -> ",selectedUser?.fullName, selectedUser?.username);
    setMessages([]);

    if (selectedUser) 
        getOldMessagesData();
  }, [selectedUser]);

  useEffect(() => {
    //console.log("socket from chatDetails  : ", socket);

    if (socket) {
      socket.on("typing", (senderId) => {
        if (senderId === selectedUser._id) {
          setIsTyping(true);

          // Update the messages array
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];

            if (
              lastMessage &&
              lastMessage.type === "typing" &&
              lastMessage.sender === senderId
            ) {
              // If the "typing" message already exists at the last index, extend its timeout
              clearTimeout(lastMessage.timeoutId); // Clear previous timeout
              const timeoutId = setTimeout(() => {
                setIsTyping(false);
                setMessages((msgs) =>
                  msgs.filter(
                    (msg) => !(msg.type === "typing" && msg.sender === senderId)
                  )
                );
              }, 3000); // Extend timeout to 9 seconds

              return [
                ...prevMessages.slice(0, -1), // Exclude the last message
                {
                  ...lastMessage,
                  time: moment().format("hh:mm A"),
                  timeoutId,
                },
              ];
            } else {
              // Add a new "typing" message if it doesn't exist
              const timeoutId = setTimeout(() => {
                setIsTyping(false);
                setMessages((msgs) =>
                  msgs.filter(
                    (msg) => !(msg.type === "typing" && msg.sender === senderId)
                  )
                );
              }, 8000); // Typing disappears after 8 seconds

              return [
                ...prevMessages,
                {
                  type: "typing",
                  sender: senderId,
                  isUser: true,
                  time: moment().format("hh:mm A"),
                  timeoutId,
                },
              ];
            }
          });
        }
      });

      socket.on("onlineUsers", (users) => {
        //console.log("users from socket : ", users);
      });
    }

    return () => {
      if (socket) socket.off("typing");
      if (socket) socket.off("onlineUsers");
    };
  }, [socket, selectedUser]);

  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", {
        senderId: user._id,
        receiverId: selectedUser._id,
      });
    }
  };

  return (
    <>
      {selectedUser ? (
        <div
          className={`flex flex-col h-screen ${
            darkTheme ? "bg-gray-900" : "bg-white"
          }`}
        >
          {/* Header Section */}
          <div
            className={`flex justify-between p-3 h-[60px] ${
              darkTheme ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <div className="flex items-center">
                    <button
                    onClick={()=>{setMobileSelectedUser(null);setSelectedUser(null)}}
          
            className={`goback flex sm:hidden ${
              darkTheme ? "hover:text-gray-400 mr-2 space-x-5 text-gray-300" : "hover:text-gray-500 mr-2 rounded-md bg-white p-4 text-gray-700"
            }`}
          >
            <span aria-hidden="true" data-icon="back" className="">
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                version="1.1"
                x="0px"
                y="0px"
                enableBackground="new 0 0 24 24"
              >
                <title>back</title>
                <path
                  fill="currentColor"
                  d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"
                ></path>
              </svg>
            </span>
            
                     </button>              
              <img
                src={selectedUser.profilePic}
                alt="chat-heading-picture"
                className="w-12 h-12 rounded-full mr-5"
              />
              <div className="flex flex-col mt-3">
                <p
                  className={`${
                    darkTheme ? "text-white" : "text-gray-800"
                  } font-medium mb-0`}
                >
                  {selectedUser.fullName}
                </p>
                <p
                  className={`${
                    darkTheme ? "text-gray-400" : "text-gray-600"
                  } text-xs`}
                >
                  {isTyping ? (
                    <div className="text-green-400">Typing...</div>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center w-[85px]">
              <RoundedBtn icon={<MdSearch />} />
              <button>
                <RoundedBtn icon={<HiDotsVertical />} />
              </button>
            </div>
          </div>

          {/* Message Section */}

          <div
            className={`h-full space-y-[2px] ${
              darkTheme
                ? "bg-gray-900 bg-[url('../assets/whatsapp_wallpaper_1.png')]"
                : "bg-gray-100 bg-[url('../assets/whatsapp_wallpaper_2.jpg')]"
            }  bg-contain overflow-y-scroll scroll-smooth scrollbar-thin ${
              darkTheme
                ? "scrollbar-thumb-gray-600 scrollbar-track-gray-800"
                : "scrollbar-thumb-gray-400 scrollbar-track-gray-200"
            } scrollbar-thumb-rounded py-3`}
          >
            {messages.length > 0 ? (
              messages.map((ele, index) =>
                ele.isUser ? (
                  ele.type === "typing" ? (
                    <div className="p-2 text-start rounded-full text-green-400 animate-bounce shadow-lg overflow-hidden relative">
                      <span className="inline-block animate-typing">
                        ...Typing
                      </span>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="chat text-end px-4 flex justify-end"
                    >
                      <div
                        className={`chatbox relative w-fit pl-2 pt-2 ${
                          ele.isFirstMsg
                            ? "rounded-b-xl rounded-tl-xl"
                            : "rounded-xl"
                        } ${darkTheme ? "bg-[#005c4b]" : "bg-[#d9fdd3]"} flex`}
                      >
                        {ele.isFirstMsg && (
                          <div
                            className={`absolute ${
                              darkTheme ? "text-[#005c4b]" : "text-[#d9fdd3]"
                            } -top-[0.025rem] -right-1.5`}
                          >
                            <span
                              aria-hidden="true"
                              data-icon="tail-out"
                              className="_amk7"
                            >
                              <svg
                                viewBox="0 0 8 13"
                                height="13"
                                width="8"
                                preserveAspectRatio="xMidYMid meet"
                                version="1.1"
                                x="0px"
                                y="0px"
                                enableBackground="new 0 0 8 13"
                              >
                                <title>tail-out</title>
                                <path
                                  opacity="0.13"
                                  d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
                                ></path>
                                <path
                                  fill="currentColor"
                                  d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
                                ></path>
                              </svg>
                            </span>
                          </div>
                        )}
                        <span
                          className={`${
                            darkTheme ? "text-white" : "text-black"
                          } text-sm`}
                        >
                          {ele.message}
                        </span>
                        <div className="time flex flex-col  ">
                          <span
                            className={`text-xs ${
                              darkTheme ? "text-[#005c4b]" : "text-[#d9fdd3]"
                            }`}
                          >
                            hello
                          </span>
                          <span
                            className={`text-xs font-light flex mx-2 space-x-1 ${
                              darkTheme ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {ele.time}
                            {/*                           
                            className={`${
                              ele.status === "seen"
                                ? "text-blue-400"
                                : "text-black"
                            }`} */}

                            {ele.status === "seen" ? (
                              <span
                                className={`${
                                  darkTheme ? "text-blue-400" : "text-blue-600"
                                } ml-1`}
                                aria-hidden="false"
                                aria-label=" Read "
                                data-icon="msg-dblcheck"
                              >
                                <svg
                                  viewBox="0 0 16 11"
                                  height="11"
                                  width="16"
                                  preserveAspectRatio="xMidYMid meet"
                                  className=""
                                  fill="none"
                                >
                                  <title>msg-dblcheck</title>
                                  <path
                                    d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </span>
                            ) : ele.status === "delivered" ? (
                              <span
                                className={`${
                                  darkTheme ? "text-gray-300" : "text-gray-500"
                                } ml-1`}
                                aria-hidden="false"
                                aria-label=" Read "
                                data-icon="msg-dblcheck"
                              >
                                <svg
                                  viewBox="0 0 16 11"
                                  height="11"
                                  width="16"
                                  preserveAspectRatio="xMidYMid meet"
                                  className=""
                                  fill="none"
                                >
                                  <title>msg-dblcheck</title>
                                  <path
                                    d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z"
                                    fill="currentColor"
                                  ></path>
                                </svg>
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div
                    key={index}
                    className="chat text-start px-4 flex justify-start"
                  >
                    <div
                      className={`chatbox relative w-fit p-2 ${
                        ele.isFirstMsg
                          ? "rounded-b-lg rounded-tr-md"
                          : "rounded-lg"
                      } ${darkTheme ? "bg-[#202c33]" : "bg-gray-200"}   flex`}
                    >
                      {ele.isFirstMsg && (
                        <div
                          className={`absolute ${
                            darkTheme ? "text-[#202c33]" : "text-gray-200"
                          } -top-[0.025rem] -left-1.5`}
                        >
                          <span
                            aria-hidden="true"
                            data-icon="tail-in"
                            className="_amk7"
                          >
                            <svg
                              viewBox="0 0 8 13"
                              height="13"
                              width="8"
                              preserveAspectRatio="xMidYMid meet"
                              className=""
                              version="1.1"
                              x="0px"
                              y="0px"
                              enableBackground="new 0 0 8 13"
                            >
                              <title>tail-in</title>
                              <path
                                opacity="0.13"
                                fill="#0000000"
                                d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"
                              ></path>
                              <path
                                fill="currentColor"
                                d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      )}
                      <span
                        className={`${
                          darkTheme ? "text-white" : "text-black"
                        } text-sm`}
                      >
                        {ele.message}
                      </span>
                      <div className="time flex flex-col ">
                        <span
                          className={`text-xs ${
                            darkTheme ? "text-[#202c33]" : "text-gray-200"
                          }  `}
                        >
                          hello
                        </span>
                        <span
                          className={`text-xs font-light flex mx-2 space-x-1 ${
                            darkTheme ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {ele.time}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )
            ) : (
              <div
                className={`text-center ${
                  darkTheme ? "text-white" : "text-gray-600"
                }`}
              >
                No messages yet
              </div>
            )}
          </div>

          <form
            onSubmit={handelSubmit}
            className={`flex items-center ${
              darkTheme ? "bg-[#202d33]" : "bg-white"
            } w-full h-[70px] p-2`}
          >
            <RoundedBtn icon={<BiHappy />} />
            <RoundedBtn icon={<HiOutlinePaperClip />} />
            <input
              type="text"
              value={userInput}
              onChange={handleInp}
              placeholder="Type a message"
              className={`${
                darkTheme
                  ? "bg-[#2c3943] text-neutral-200 placeholder:text-[#8796a1]"
                  : "bg-gray-200 text-gray-800 placeholder:text-gray-500"
              } rounded-lg outline-none text-sm w-full h-full px-3 placeholder:text-sm`}
            />
            <button type="submit">
              <RoundedBtn icon={<IoSendSharp />} />
            </button>
            <RoundedBtn icon={<BsFillMicFill />} />
          </form>
        </div>
      ) : (
        <div
          className={`h-screen flex justify-center items-center ${
            darkTheme ? "bg-[#222E35] text-white" : "bg-gray-200 text-black"
          }`}
        >
          <div className="main flex flex-col text-center space-y-7">
            <div className="mx-auto">
              <img
                className="h-50 w-50 mx-auto"
                src="whatappCloneTemp/frontend/src/assets/laptop_img.png"
                alt="Laptop"
              />
            </div>
            <span
              className={`text-3xl ${
                darkTheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Download Whatsapp for Windows
            </span>
            <div className="w-3/4 mx-auto text-center">
              <span
                className={`text-sm ${
                  darkTheme ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Make calls, share your screen and get a faster experience when
                you download the windows app
              </span>
            </div>
            <div className="text-center">
              <button
                className={`py-2 px-3 text-sm w-fit font-bold ${
                  darkTheme
                    ? "bg-[#00A884] hover:bg-[#123b32] text-gray-900"
                    : "bg-[#34D399] hover:bg-[#065F46] text-white"
                } rounded-full`}
              >
                Get from Microsoft Store
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatDetail;
