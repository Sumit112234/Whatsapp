import React, { useState, useEffect } from "react";
import RoundedBtn from "./common/RoundedBtn";
import Chats from "./common/Chats";
import { MdPeopleAlt } from "react-icons/md";
import { TbCircleDashed } from "react-icons/tb";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import { BiFilter } from "react-icons/bi";
import { pp } from "../assets/whatsapp";
import { useAuth } from "../context/AuthContext";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { getAllUser, logoutUser } from "../utils/userHandler";
import { useNavigate } from "react-router-dom";
import Setting from "./Setting";
import ChangeProfilePage from "./ChangeProfilePage";

const LeftMenu = () => {
  const [filter, setFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [changeProfile, setChangeProfile] = useState(false);
  const navigate = useNavigate();
  const { setUser, user, darkTheme, setDarkTheme } = useAuth();

  const toggleDropdown1 = () => {
    setIsDropdownOpen1(!isDropdownOpen1);
  };
  const toggleDropdown2 = () => {
    //console.log("click");
    setIsDropdownOpen2(!isDropdownOpen2);
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
  // Fetch chats on component mount
  useEffect(() => {
    const setData = async () => {
      if(chats.length == 0)
      {
        //console.log("Fetching chats...");
        try {
          let res = await getAllUser();
          // console.log("response from useEffect " , res);
          setChats(res);
          setFilteredChats(res); // Initialize filteredChats with the fetched data
        } catch (e) {
          console.error("Error in fetching chats:", e);
        }
      }
    };
    setData();
  }, []);

  // Update filteredChats when searchTerm or chats changes
  useEffect(() => {
    if (searchTerm === "") {
      // console.log("all chats : ", chats);
      setFilteredChats(chats); // Show all chats if search term is empty
    } else {
      setFilteredChats(
        chats.filter((chat) =>
          chat.fullName.toLowerCase().startsWith(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, chats]);

  return (
    // LeftMenu container
    <div className="flex border-r border-neutral-700 w-screen sm:w-[30rem]   ">
      {/* Profile nav  for desktop*/}
      <div
        className={`  hidden sm:flex flex-col justify-between items-center p-3 w-screen  sm:h-screen sm:w-16 transition-colors ${
          darkTheme ? "bg-[#202d33] text-white" : "bg-gray-300 text-black"
        }`}
      >
        <div className="flex flex-col justify-around space-y-4 text-white">
          <div className="p-2 rounded-full bg-gray-600  cursor-pointer">
            <span aria-hidden="true" data-icon="chats-filled" className=" ">
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>chats-filled</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.8384 8.45501L5 8.70356V9V17.8333C5 18.7538 5.7462 19.5 6.6667 19.5H20.3333C21.2538 19.5 22 18.7538 22 17.8333V6.66667C22 5.74619 21.2538 5 20.3333 5H2.5927L4.8384 8.45501ZM8 14.5C8 13.6716 8.67157 13 9.5 13H14.5C15.3284 13 16 13.6716 16 14.5C16 15.3284 15.3284 16 14.5 16H9.5C8.67157 16 8 15.3284 8 14.5ZM9.5 8C8.67157 8 8 8.67157 8 9.5C8 10.3284 8.67157 11 9.5 11H16.5C17.3284 11 18 10.3284 18 9.5C18 8.67157 17.3284 8 16.5 8H9.5Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M5 8.70356L5.41919 8.43101L5.5 8.55531V8.70356H5ZM4.8384 8.45501L4.41921 8.72756L4.41917 8.7275L4.8384 8.45501ZM2.5927 5L2.17347 5.27249L1.67137 4.5H2.5927V5ZM4.58081 8.9761L4.41921 8.72756L5.25759 8.18247L5.41919 8.43101L4.58081 8.9761ZM4.5 9V8.70356H5.5V9H4.5ZM4.5 17.8333V9H5.5V17.8333H4.5ZM6.6667 20C5.47006 20 4.5 19.0299 4.5 17.8333H5.5C5.5 18.4777 6.02234 19 6.6667 19V20ZM20.3333 20H6.6667V19H20.3333V20ZM22.5 17.8333C22.5 19.0299 21.53 20 20.3333 20V19C20.9777 19 21.5 18.4777 21.5 17.8333H22.5ZM22.5 6.66667V17.8333H21.5V6.66667H22.5ZM20.3333 4.5C21.53 4.5 22.5 5.47005 22.5 6.66667H21.5C21.5 6.02233 20.9777 5.5 20.3333 5.5V4.5ZM2.5927 4.5H20.3333V5.5H2.5927V4.5ZM4.41917 8.7275L2.17347 5.27249L3.01192 4.72751L5.25762 8.18252L4.41917 8.7275ZM9.5 13.5C8.94772 13.5 8.5 13.9477 8.5 14.5H7.5C7.5 13.3954 8.39543 12.5 9.5 12.5V13.5ZM14.5 13.5H9.5V12.5H14.5V13.5ZM15.5 14.5C15.5 13.9477 15.0523 13.5 14.5 13.5V12.5C15.6046 12.5 16.5 13.3954 16.5 14.5H15.5ZM14.5 15.5C15.0523 15.5 15.5 15.0523 15.5 14.5H16.5C16.5 15.6046 15.6046 16.5 14.5 16.5V15.5ZM9.5 15.5H14.5V16.5H9.5V15.5ZM8.5 14.5C8.5 15.0523 8.94772 15.5 9.5 15.5V16.5C8.39543 16.5 7.5 15.6046 7.5 14.5H8.5ZM7.5 9.5C7.5 8.39543 8.39543 7.5 9.5 7.5V8.5C8.94772 8.5 8.5 8.94772 8.5 9.5H7.5ZM9.5 11.5C8.39543 11.5 7.5 10.6046 7.5 9.5H8.5C8.5 10.0523 8.94772 10.5 9.5 10.5V11.5ZM16.5 11.5H9.5V10.5H16.5V11.5ZM18.5 9.5C18.5 10.6046 17.6046 11.5 16.5 11.5V10.5C17.0523 10.5 17.5 10.0523 17.5 9.5H18.5ZM16.5 7.5C17.6046 7.5 18.5 8.39543 18.5 9.5H17.5C17.5 8.94772 17.0523 8.5 16.5 8.5V7.5ZM9.5 7.5H16.5V8.5H9.5V7.5Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
          <div
            className={`p-2 rounded-full ${
              darkTheme
                ? "hover:bg-gray-600"
                : "hover:bg-black hover:text-white text-gray-700"
            }   cursor-pointer`}
          >
            <span aria-hidden="true" data-icon="status-outline" className="">
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>status-outline</title>
                <path
                  d="M13.5627 3.13663C13.6586 2.59273 14.1793 2.22466 14.7109 2.37438C15.7904 2.67842 16.8134 3.16256 17.7359 3.80858C18.9322 4.64624 19.9304 5.73574 20.6605 7.0005C21.3906 8.26526 21.8348 9.67457 21.9619 11.1294C22.06 12.2513 21.9676 13.3794 21.691 14.4662C21.5548 15.0014 20.9756 15.2682 20.4567 15.0793C19.9377 14.8903 19.6769 14.317 19.7996 13.7785C19.9842 12.9693 20.0421 12.1343 19.9695 11.3035C19.8678 10.1396 19.5124 9.01218 18.9284 8.00038C18.3443 6.98857 17.5457 6.11697 16.5887 5.44684C15.9055 4.96844 15.1535 4.601 14.3605 4.3561C13.8328 4.19314 13.4668 3.68052 13.5627 3.13663Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M18.8943 17.785C19.3174 18.14 19.3758 18.7749 18.9803 19.1604C18.1773 19.9433 17.2465 20.5872 16.2257 21.0631C14.9022 21.6802 13.4595 22 11.9992 21.9999C10.5388 21.9998 9.09621 21.6798 7.77275 21.0625C6.75208 20.5865 5.82137 19.9424 5.01843 19.1595C4.62302 18.7739 4.68155 18.139 5.10467 17.784C5.52779 17.4291 6.15471 17.4898 6.55964 17.8654C7.16816 18.4298 7.86233 18.8974 8.61817 19.25C9.67695 19.7438 10.831 19.9998 11.9993 19.9999C13.1676 20 14.3217 19.7442 15.3806 19.2505C16.1365 18.898 16.8307 18.4304 17.4393 17.8661C17.8443 17.4906 18.4712 17.43 18.8943 17.785Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M3.54265 15.0781C3.02367 15.267 2.44458 15.0001 2.30844 14.4649C2.03202 13.3781 1.93978 12.2502 2.03794 11.1283C2.16521 9.67361 2.60953 8.26444 3.33966 6.99984C4.06979 5.73523 5.06802 4.64587 6.2642 3.80832C7.18668 3.1624 8.20962 2.67833 9.28902 2.37434C9.82063 2.22462 10.3413 2.59271 10.4372 3.1366C10.5331 3.6805 10.1671 4.19311 9.63938 4.35607C8.84645 4.60094 8.09446 4.96831 7.41133 5.44663C6.45439 6.11667 5.65581 6.98816 5.0717 7.99985C4.4876 9.01153 4.13214 10.1389 4.03032 11.3026C3.95764 12.1334 4.01547 12.9683 4.19986 13.7775C4.32257 14.3159 4.06162 14.8892 3.54265 15.0781Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9999 16C14.2091 16 15.9999 14.2092 15.9999 12C15.9999 9.79088 14.2091 8.00002 11.9999 8.00002C9.7908 8.00002 7.99994 9.79088 7.99994 12C7.99994 14.2092 9.7908 16 11.9999 16ZM11.9999 18C15.3136 18 17.9999 15.3137 17.9999 12C17.9999 8.68631 15.3136 6.00002 11.9999 6.00002C8.68623 6.00002 5.99994 8.68631 5.99994 12C5.99994 15.3137 8.68623 18 11.9999 18Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
          <div
            className={`p-2 rounded-full ${
              darkTheme
                ? "hover:bg-gray-600"
                : "hover:bg-black hover:text-white text-gray-700"
            }   cursor-pointer`}
          >
            <span
              aria-hidden="true"
              data-icon="newsletter-outline"
              className=""
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>newsletter-outline</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.8301 8.63404C16.3081 8.35745 16.9198 8.52076 17.1964 8.9988C17.7077 9.88244 18 10.9086 18 12C18 13.0914 17.7077 14.1176 17.1964 15.0012C16.9198 15.4792 16.3081 15.6425 15.8301 15.366C15.352 15.0894 15.1887 14.4776 15.4653 13.9996C15.8052 13.4122 16 12.7304 16 12C16 11.2696 15.8052 10.5878 15.4653 10.0004C15.1887 9.52237 15.352 8.91063 15.8301 8.63404ZM8.16995 8.63404C8.64798 8.91063 8.81129 9.52237 8.5347 10.0004C8.19484 10.5878 8 11.2696 8 12C8 12.7304 8.19484 13.4122 8.5347 13.9996C8.81129 14.4776 8.64798 15.0894 8.16995 15.366C7.69191 15.6425 7.08017 15.4792 6.80358 15.0012C6.29231 14.1176 6 13.0914 6 12C6 10.9086 6.29231 9.88244 6.80358 8.9988C7.08017 8.52076 7.69191 8.35745 8.16995 8.63404Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.33243 16.4826L5.09622 17.2728C4.86428 18.0487 4.62086 18.8707 4.41748 19.5825C5.12931 19.3791 5.95126 19.1357 6.72722 18.9038L7.51743 18.6676L8.24444 19.057C9.36447 19.6571 10.6412 20 12 20C16.4154 20 20 16.4154 20 12C20 7.58457 16.4154 4 12 4C7.58457 4 4 7.58457 4 12C4 13.3588 4.34295 14.6355 4.94296 15.7556L5.33243 16.4826ZM3.18 16.7C2.63 18.54 2 20.69 2 21C2 21.55 2.45 22 3 22C3.31 22 5.46 21.37 7.3 20.82C8.7 21.57 10.3 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 13.7 2.43 15.3 3.18 16.7Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
          <div
            className={`p-2 rounded-full ${
              darkTheme
                ? "hover:bg-gray-600"
                : "hover:bg-black hover:text-white text-gray-700"
            }   cursor-pointer`}
          >
            <span
              aria-hidden="true"
              data-icon="newsletter-outline"
              className=""
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>newsletter-outline</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.8301 8.63404C16.3081 8.35745 16.9198 8.52076 17.1964 8.9988C17.7077 9.88244 18 10.9086 18 12C18 13.0914 17.7077 14.1176 17.1964 15.0012C16.9198 15.4792 16.3081 15.6425 15.8301 15.366C15.352 15.0894 15.1887 14.4776 15.4653 13.9996C15.8052 13.4122 16 12.7304 16 12C16 11.2696 15.8052 10.5878 15.4653 10.0004C15.1887 9.52237 15.352 8.91063 15.8301 8.63404ZM8.16995 8.63404C8.64798 8.91063 8.81129 9.52237 8.5347 10.0004C8.19484 10.5878 8 11.2696 8 12C8 12.7304 8.19484 13.4122 8.5347 13.9996C8.81129 14.4776 8.64798 15.0894 8.16995 15.366C7.69191 15.6425 7.08017 15.4792 6.80358 15.0012C6.29231 14.1176 6 13.0914 6 12C6 10.9086 6.29231 9.88244 6.80358 8.9988C7.08017 8.52076 7.69191 8.35745 8.16995 8.63404Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.33243 16.4826L5.09622 17.2728C4.86428 18.0487 4.62086 18.8707 4.41748 19.5825C5.12931 19.3791 5.95126 19.1357 6.72722 18.9038L7.51743 18.6676L8.24444 19.057C9.36447 19.6571 10.6412 20 12 20C16.4154 20 20 16.4154 20 12C20 7.58457 16.4154 4 12 4C7.58457 4 4 7.58457 4 12C4 13.3588 4.34295 14.6355 4.94296 15.7556L5.33243 16.4826ZM3.18 16.7C2.63 18.54 2 20.69 2 21C2 21.55 2.45 22 3 22C3.31 22 5.46 21.37 7.3 20.82C8.7 21.57 10.3 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 13.7 2.43 15.3 3.18 16.7Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-4 items-center">
          <button
            onClick={toggleDropdown2}
            className={`${
              darkTheme ? "text-white" : "text-gray-700"
            } text-3xl font-bold`}
          >
            <IoSettingsOutline />
          </button>

          <button
            onClick={() => {
              setChangeProfile(true);
            }}
          >
            <img
              src={user.profilePic}
              alt="profile_picture"
              className="w-[40px] rounded-full"
            />
          </button>
        </div>
      </div>

      {/* Profile nav  for mobile*/}
      <div
        className={`sm:hidden absolute bottom-0  p-3 w-full  transition-colors ${
          darkTheme ? "bg-[#202d33] text-white" : "bg-gray-300 text-black"
        }`}
      >
        <div className="flex justify-around items-center  text-white">
          <div className="p-2 rounded-full bg-gray-600  cursor-pointer">
            <span aria-hidden="true" data-icon="chats-filled" className=" ">
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>chats-filled</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.8384 8.45501L5 8.70356V9V17.8333C5 18.7538 5.7462 19.5 6.6667 19.5H20.3333C21.2538 19.5 22 18.7538 22 17.8333V6.66667C22 5.74619 21.2538 5 20.3333 5H2.5927L4.8384 8.45501ZM8 14.5C8 13.6716 8.67157 13 9.5 13H14.5C15.3284 13 16 13.6716 16 14.5C16 15.3284 15.3284 16 14.5 16H9.5C8.67157 16 8 15.3284 8 14.5ZM9.5 8C8.67157 8 8 8.67157 8 9.5C8 10.3284 8.67157 11 9.5 11H16.5C17.3284 11 18 10.3284 18 9.5C18 8.67157 17.3284 8 16.5 8H9.5Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M5 8.70356L5.41919 8.43101L5.5 8.55531V8.70356H5ZM4.8384 8.45501L4.41921 8.72756L4.41917 8.7275L4.8384 8.45501ZM2.5927 5L2.17347 5.27249L1.67137 4.5H2.5927V5ZM4.58081 8.9761L4.41921 8.72756L5.25759 8.18247L5.41919 8.43101L4.58081 8.9761ZM4.5 9V8.70356H5.5V9H4.5ZM4.5 17.8333V9H5.5V17.8333H4.5ZM6.6667 20C5.47006 20 4.5 19.0299 4.5 17.8333H5.5C5.5 18.4777 6.02234 19 6.6667 19V20ZM20.3333 20H6.6667V19H20.3333V20ZM22.5 17.8333C22.5 19.0299 21.53 20 20.3333 20V19C20.9777 19 21.5 18.4777 21.5 17.8333H22.5ZM22.5 6.66667V17.8333H21.5V6.66667H22.5ZM20.3333 4.5C21.53 4.5 22.5 5.47005 22.5 6.66667H21.5C21.5 6.02233 20.9777 5.5 20.3333 5.5V4.5ZM2.5927 4.5H20.3333V5.5H2.5927V4.5ZM4.41917 8.7275L2.17347 5.27249L3.01192 4.72751L5.25762 8.18252L4.41917 8.7275ZM9.5 13.5C8.94772 13.5 8.5 13.9477 8.5 14.5H7.5C7.5 13.3954 8.39543 12.5 9.5 12.5V13.5ZM14.5 13.5H9.5V12.5H14.5V13.5ZM15.5 14.5C15.5 13.9477 15.0523 13.5 14.5 13.5V12.5C15.6046 12.5 16.5 13.3954 16.5 14.5H15.5ZM14.5 15.5C15.0523 15.5 15.5 15.0523 15.5 14.5H16.5C16.5 15.6046 15.6046 16.5 14.5 16.5V15.5ZM9.5 15.5H14.5V16.5H9.5V15.5ZM8.5 14.5C8.5 15.0523 8.94772 15.5 9.5 15.5V16.5C8.39543 16.5 7.5 15.6046 7.5 14.5H8.5ZM7.5 9.5C7.5 8.39543 8.39543 7.5 9.5 7.5V8.5C8.94772 8.5 8.5 8.94772 8.5 9.5H7.5ZM9.5 11.5C8.39543 11.5 7.5 10.6046 7.5 9.5H8.5C8.5 10.0523 8.94772 10.5 9.5 10.5V11.5ZM16.5 11.5H9.5V10.5H16.5V11.5ZM18.5 9.5C18.5 10.6046 17.6046 11.5 16.5 11.5V10.5C17.0523 10.5 17.5 10.0523 17.5 9.5H18.5ZM16.5 7.5C17.6046 7.5 18.5 8.39543 18.5 9.5H17.5C17.5 8.94772 17.0523 8.5 16.5 8.5V7.5ZM9.5 7.5H16.5V8.5H9.5V7.5Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
          <div
            className={`p-2 rounded-full ${
              darkTheme
                ? "hover:bg-gray-600"
                : "hover:bg-black hover:text-white text-gray-700"
            }   cursor-pointer`}
          >
            <span aria-hidden="true" data-icon="status-outline" className="">
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>status-outline</title>
                <path
                  d="M13.5627 3.13663C13.6586 2.59273 14.1793 2.22466 14.7109 2.37438C15.7904 2.67842 16.8134 3.16256 17.7359 3.80858C18.9322 4.64624 19.9304 5.73574 20.6605 7.0005C21.3906 8.26526 21.8348 9.67457 21.9619 11.1294C22.06 12.2513 21.9676 13.3794 21.691 14.4662C21.5548 15.0014 20.9756 15.2682 20.4567 15.0793C19.9377 14.8903 19.6769 14.317 19.7996 13.7785C19.9842 12.9693 20.0421 12.1343 19.9695 11.3035C19.8678 10.1396 19.5124 9.01218 18.9284 8.00038C18.3443 6.98857 17.5457 6.11697 16.5887 5.44684C15.9055 4.96844 15.1535 4.601 14.3605 4.3561C13.8328 4.19314 13.4668 3.68052 13.5627 3.13663Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M18.8943 17.785C19.3174 18.14 19.3758 18.7749 18.9803 19.1604C18.1773 19.9433 17.2465 20.5872 16.2257 21.0631C14.9022 21.6802 13.4595 22 11.9992 21.9999C10.5388 21.9998 9.09621 21.6798 7.77275 21.0625C6.75208 20.5865 5.82137 19.9424 5.01843 19.1595C4.62302 18.7739 4.68155 18.139 5.10467 17.784C5.52779 17.4291 6.15471 17.4898 6.55964 17.8654C7.16816 18.4298 7.86233 18.8974 8.61817 19.25C9.67695 19.7438 10.831 19.9998 11.9993 19.9999C13.1676 20 14.3217 19.7442 15.3806 19.2505C16.1365 18.898 16.8307 18.4304 17.4393 17.8661C17.8443 17.4906 18.4712 17.43 18.8943 17.785Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M3.54265 15.0781C3.02367 15.267 2.44458 15.0001 2.30844 14.4649C2.03202 13.3781 1.93978 12.2502 2.03794 11.1283C2.16521 9.67361 2.60953 8.26444 3.33966 6.99984C4.06979 5.73523 5.06802 4.64587 6.2642 3.80832C7.18668 3.1624 8.20962 2.67833 9.28902 2.37434C9.82063 2.22462 10.3413 2.59271 10.4372 3.1366C10.5331 3.6805 10.1671 4.19311 9.63938 4.35607C8.84645 4.60094 8.09446 4.96831 7.41133 5.44663C6.45439 6.11667 5.65581 6.98816 5.0717 7.99985C4.4876 9.01153 4.13214 10.1389 4.03032 11.3026C3.95764 12.1334 4.01547 12.9683 4.19986 13.7775C4.32257 14.3159 4.06162 14.8892 3.54265 15.0781Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9999 16C14.2091 16 15.9999 14.2092 15.9999 12C15.9999 9.79088 14.2091 8.00002 11.9999 8.00002C9.7908 8.00002 7.99994 9.79088 7.99994 12C7.99994 14.2092 9.7908 16 11.9999 16ZM11.9999 18C15.3136 18 17.9999 15.3137 17.9999 12C17.9999 8.68631 15.3136 6.00002 11.9999 6.00002C8.68623 6.00002 5.99994 8.68631 5.99994 12C5.99994 15.3137 8.68623 18 11.9999 18Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
          <div
            className={`p-2 rounded-full ${
              darkTheme
                ? "hover:bg-gray-600"
                : "hover:bg-black hover:text-white text-gray-700"
            }   cursor-pointer`}
          >
            <span
              aria-hidden="true"
              data-icon="newsletter-outline"
              className=""
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>newsletter-outline</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.8301 8.63404C16.3081 8.35745 16.9198 8.52076 17.1964 8.9988C17.7077 9.88244 18 10.9086 18 12C18 13.0914 17.7077 14.1176 17.1964 15.0012C16.9198 15.4792 16.3081 15.6425 15.8301 15.366C15.352 15.0894 15.1887 14.4776 15.4653 13.9996C15.8052 13.4122 16 12.7304 16 12C16 11.2696 15.8052 10.5878 15.4653 10.0004C15.1887 9.52237 15.352 8.91063 15.8301 8.63404ZM8.16995 8.63404C8.64798 8.91063 8.81129 9.52237 8.5347 10.0004C8.19484 10.5878 8 11.2696 8 12C8 12.7304 8.19484 13.4122 8.5347 13.9996C8.81129 14.4776 8.64798 15.0894 8.16995 15.366C7.69191 15.6425 7.08017 15.4792 6.80358 15.0012C6.29231 14.1176 6 13.0914 6 12C6 10.9086 6.29231 9.88244 6.80358 8.9988C7.08017 8.52076 7.69191 8.35745 8.16995 8.63404Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.33243 16.4826L5.09622 17.2728C4.86428 18.0487 4.62086 18.8707 4.41748 19.5825C5.12931 19.3791 5.95126 19.1357 6.72722 18.9038L7.51743 18.6676L8.24444 19.057C9.36447 19.6571 10.6412 20 12 20C16.4154 20 20 16.4154 20 12C20 7.58457 16.4154 4 12 4C7.58457 4 4 7.58457 4 12C4 13.3588 4.34295 14.6355 4.94296 15.7556L5.33243 16.4826ZM3.18 16.7C2.63 18.54 2 20.69 2 21C2 21.55 2.45 22 3 22C3.31 22 5.46 21.37 7.3 20.82C8.7 21.57 10.3 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 13.7 2.43 15.3 3.18 16.7Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
          <div
            className={`p-2 rounded-full ${
              darkTheme
                ? "hover:bg-gray-600"
                : "hover:bg-black hover:text-white text-gray-700"
            }   cursor-pointer`}
          >
            <span
              aria-hidden="true"
              data-icon="newsletter-outline"
              className=""
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                className=""
                fill="none"
              >
                <title>newsletter-outline</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.8301 8.63404C16.3081 8.35745 16.9198 8.52076 17.1964 8.9988C17.7077 9.88244 18 10.9086 18 12C18 13.0914 17.7077 14.1176 17.1964 15.0012C16.9198 15.4792 16.3081 15.6425 15.8301 15.366C15.352 15.0894 15.1887 14.4776 15.4653 13.9996C15.8052 13.4122 16 12.7304 16 12C16 11.2696 15.8052 10.5878 15.4653 10.0004C15.1887 9.52237 15.352 8.91063 15.8301 8.63404ZM8.16995 8.63404C8.64798 8.91063 8.81129 9.52237 8.5347 10.0004C8.19484 10.5878 8 11.2696 8 12C8 12.7304 8.19484 13.4122 8.5347 13.9996C8.81129 14.4776 8.64798 15.0894 8.16995 15.366C7.69191 15.6425 7.08017 15.4792 6.80358 15.0012C6.29231 14.1176 6 13.0914 6 12C6 10.9086 6.29231 9.88244 6.80358 8.9988C7.08017 8.52076 7.69191 8.35745 8.16995 8.63404Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M13.5 12C13.5 12.8284 12.8284 13.5 12 13.5C11.1716 13.5 10.5 12.8284 10.5 12C10.5 11.1716 11.1716 10.5 12 10.5C12.8284 10.5 13.5 11.1716 13.5 12Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.33243 16.4826L5.09622 17.2728C4.86428 18.0487 4.62086 18.8707 4.41748 19.5825C5.12931 19.3791 5.95126 19.1357 6.72722 18.9038L7.51743 18.6676L8.24444 19.057C9.36447 19.6571 10.6412 20 12 20C16.4154 20 20 16.4154 20 12C20 7.58457 16.4154 4 12 4C7.58457 4 4 7.58457 4 12C4 13.3588 4.34295 14.6355 4.94296 15.7556L5.33243 16.4826ZM3.18 16.7C2.63 18.54 2 20.69 2 21C2 21.55 2.45 22 3 22C3.31 22 5.46 21.37 7.3 20.82C8.7 21.57 10.3 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 13.7 2.43 15.3 3.18 16.7Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div className={`w-full h-screen ${darkTheme ? "dark" : ""}`}>
        {/* Search and filter */}
        <div
          className={`${
            darkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <div className="relative">
            {/* Top bar with buttons */}
            <div className="flex justify-between items-center px-3 py-3">
              <h1 className="font-bold text-2xl">Chats</h1>
              <div className="flex justify-between w-1/3">
                <button
                  onClick={() => setDarkTheme((prev) => !prev)}
                  className={`p-2 rounded-full ${
                    darkTheme
                      ? "bg-muted/40 hover:bg-muted/50"
                      : "bg-muted/20 hover:bg-muted/30"
                  }`}
                >
                  {!darkTheme ? "☀️" : "🌙"}
                </button>
                <button>
                  <span
                    aria-hidden="true"
                    data-icon="new-chat-outline"
                    className="text-6xl"
                  >
                    <svg viewBox="0 0 24 24" height="24" width="24" fill="none">
                      <title>new-chat-outline</title>
                      <path
                        d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z"
                        fill="currentColor"
                      ></path>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                </button>
                <button onClick={toggleDropdown1}>
                  <span aria-hidden="true" data-icon="menu">
                    <svg viewBox="0 0 24 24" height="24" width="24" fill="none">
                      <title>menu</title>
                      <path
                        fill="currentColor"
                        d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {/* Dropdown menu */}
            <div
              id="dropdown"
              className={`z-10 ${isDropdownOpen1 ? "block" : "hidden"} ${
                darkTheme ? "bg-gray-800" : "bg-gray-200"
              } rounded-lg shadow-sm w-44 absolute top-16 right-4`}
            >
              <div className="py-2">
                <button className={`${darkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}  w-full text-start font-semibold text-md cursor-pointer py-2 px-4`}>
                  New Group
                </button>
                <button className={`${darkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}  w-full text-start font-semibold text-md cursor-pointer py-2 px-4`}>
                  Starred Message
                </button>
                <button className={`${darkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}  w-full text-start font-semibold text-md cursor-pointer py-2 px-4`}>
                  Selected Chats
                </button>
                <button
                   onClick={toggleDropdown2}
                 className={`sm:hidden ${darkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}  w-full text-start font-semibold text-md cursor-pointer py-2 px-4`}>
                  Setting
                </button>
                <button
                  onClick={handleLogout}
                  className={`${darkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}  w-full text-start font-semibold text-md cursor-pointer py-2 px-4`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div
            className={`input flex h-fit w-[90%] mx-auto rounded-md px-3 ${
              darkTheme ? "bg-[#202c33]" : "bg-white"
            }`}
          >
            <div
              className={`icon rounded-l-lg w-20 h-9 flex justify-center items-center ${
                darkTheme ? "text-white" : "text-black"
              }`}
            >
              <span aria-hidden="true" data-icon="search">
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
                  <title>search</title>
                  <path
                    fill="currentColor"
                    d="M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z"
                  ></path>
                </svg>
              </span>
            </div>
            <div
              className={`inp w-[full] flex items-center rounded-r-lg h-9 ${
                darkTheme ? "bg-[#202c33]" : "bg-white"
              }`}
            >
              <input
                type="text"
                placeholder="Search"
                className={`w-full focus:outline-none ${
                  darkTheme ? "text-white" : "text-black"
                } ${darkTheme ? "bg-[#202c33]" : "bg-white"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              />
            </div>
          </div>

          <div className={`all flex justify-start space-x-2 py-2 ${darkTheme ? '' : ' bg-white'} px-3`}>
            <button
              className={`text-md font-normal px-3 py-1 rounded-full ${
                darkTheme
                  ? "bg-[#134221] text-[#65c787]"
                  : "bg-[#6ec789] text-[#a7eec0]"
              }`}
            >
              All
            </button>
            <button
              className={`text-md font-normal px-3 py-1 rounded-full ${
                darkTheme
                  ? "bg-[#202c33] hover:bg-[#30424c] text-gray-400"
                  : "bg-[#eaeaea] hover:bg-[#d0d0d0] text-black"
              }`}
            >
              Unread
            </button>
            <button
              className={`text-md font-normal px-3 py-1 rounded-full ${
                darkTheme
                  ? "bg-[#202c33] hover:bg-[#30424c] text-gray-400"
                  : "bg-[#eaeaea] hover:bg-[#d0d0d0] text-black"
              }`}
            >
              Favorites
            </button>
            <button
              className={`text-md font-normal px-3 py-1 rounded-full ${
                darkTheme
                  ? "bg-[#202c33] hover:bg-[#30424c] text-gray-400"
                  : "bg-[#eaeaea] hover:bg-[#d0d0d0] text-black"
              }`}
            >
              Groups
            </button>
          </div>
        </div>

        {isDropdownOpen2 ? (
          <Setting
            changeProfile={changeProfile}
            setChangeProfile={setChangeProfile}
            setIsDropdownOpen2={setIsDropdownOpen2}
          />
        ) : changeProfile ? (
          <ChangeProfilePage
            setIsDropdownOpen2={setIsDropdownOpen2}
            setChangeProfile={setChangeProfile}
          />
        ) : (
          <Chats
            filter={filter}
            filteredChats={filteredChats}
            chats={chats}
            setChats={setChats}
          />
        )}
      </div>
    </div>
  );
};

export default LeftMenu;
