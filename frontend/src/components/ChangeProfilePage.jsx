import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { updateUser } from "../utils/userHandler";

const ChangeProfilePage = ({ setChangeProfile, setIsDropdownOpen2 }) => {
  const { user ,darkTheme } = useAuth();
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      //   const formData = new FormData();
      //   formData.append("file", file);
      //   formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset

      try {
        setIsUploading(true);
        ////console.log("working1");

        const formData = new FormData();
        formData.append("profilePic", file); // `profilePic` matches the backend key
        ////console.log("working2");

        let response = await updateUser(formData);

        ////console.log("working3");
        alert("Profile updated successfully!");
        // ////console.log(response.data);

        // Upload to Cloudinary
        // const response = await axios.post(
        //   "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary cloud name
        //   formData
        // );

        // Update the profile picture URL
        setProfilePic(response?.data?.user?.profilePic);

        // Optionally, send the new image URL to your backend
        ////console.log(
        //   "Uploaded to Cloudinary:",
        //   response?.data?.user?.profilePic
        // );
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div
  className={`absolute z-50 py-4 px-2 top-0 w-[25.5rem] h-full flex flex-col  cursor-pointer ${
    darkTheme
      ? "bg-gray-900 text-gray-100"
      : "bg-gray-300 text-gray-300 "
  }`}
>
  <button
    onClick={() => {
      setChangeProfile(false);
      setIsDropdownOpen2(false);
    }}
    className={`goback flex  ${
      darkTheme ? "hover:text-gray-400 space-x-5" : "hover:text-gray-500 rounded-md bg-white p-4 text-gray-700"
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
    <span className="font-md ">Profile</span>
  </button>
  <div className="pro flex justify-center py-3 relative group">
    {/* Profile Picture */}
    <img
      src={profilePic}
      className={`h-64 w-64 rounded-full object-cover border-4 ${
        darkTheme ? "border-gray-300" : "border-gray-600"
      } ${isUploading ? "opacity-50" : ""}`}
      alt="Profile"
    />

    {/* Hover Overlay */}
    <div
      className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
    >
      <label
        htmlFor="profilePicInput"
        className="text-white font-bold text-lg cursor-pointer"
      >
        {isUploading ? "Uploading..." : "Change Profile Pic"}
      </label>
    </div>

    {/* Hidden File Input */}
    <input
      id="profilePicInput"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleProfilePicChange}
      disabled={false}
    />
  </div>

  <div className="details flex flex-col space-y-2">
    <div>
      <div className="flex flex-col space-y-4 space-x-3">
        <span
          className={`font-light text-sm ${
            darkTheme ? "text-green-400" : "text-green-600"
          }`}
        >
          Your Name
        </span>
        <span className={`font-md ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{user?.fullName}</span>
      </div>
      <div className="line w-[95%] mx-auto flex justify-end">
        <div
          className={`h-[1px] w-full ${
            darkTheme ? "bg-gray-700" : "bg-[#3f5762]"
          }`}
        ></div>
      </div>
    </div>
    <div>
      <div className="flex flex-col space-y-4 space-x-3">
        <span
          className={`font-light text-sm ${
            darkTheme ? "text-green-400" : "text-green-600"
          }`}
        >
          Your Username
        </span>
        <span className={`font-md ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{user?.username}</span>
      </div>
      <div className="line w-[95%] mx-auto flex justify-end">
        <div
          className={`h-[1px] w-full ${
            darkTheme ? "bg-gray-700" : "bg-[#3f5762]"
          }`}
        ></div>
      </div>
    </div>
    <div>
      <div className="flex flex-col space-y-4 space-x-3">
        <span
          className={`font-light text-sm ${
            darkTheme ? "text-green-400" : "text-green-600"
          }`}
        >
          Your Mobile
        </span>
        <span className={`font-md ${darkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{user?.mobile}</span>
      </div>
    </div>
  </div>
</div>

  );
};

export default ChangeProfilePage;
