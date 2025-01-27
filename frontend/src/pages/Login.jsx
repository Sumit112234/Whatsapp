import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../utils/userHandler";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const {setUser} = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const { username, password } = formData;

    if (!username.trim()) {
      newErrors.username = "Username, Email, or Mobile is required.";
    } else if (!/^\d{10}$/.test(username) && !/\S+@\S+\.\S+/.test(username) && username.includes(" ")) {
      newErrors.username = "Enter a valid username, email, or mobile number.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try{
        setLoading(true)

        let res = await loginUser(formData);
        //console.log("result from login : ", res);
        setUser(res?.data?.user);
        if(res)
          navigate('/');
      
        setLoading(false);
     
      }
      catch(e)
      {
        //console.log("some error occcured  : ",e)
      }
    }
  };

  return (
    <div className="bg-animate min-h-screen flex items-center justify-center sm:p-4 signup-bg-img">
      <div className="bg-opacity-30 bg-green-900 sm:p-8 rounded-md sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500  w-full  sm:w-2/5">
        <h1 className="texl-xl   sm:text-4xl font-extrabold text-center mb-12 neon-text">
          Login to Continue
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
         
         <div className="relative">
           <input
             type="text"
             name="username"
             placeholder="Username, Email, or Mobile"
             value={formData.username}
             onChange={handleInputChange}
             className=" w-[85%] ml-6 sm:ml-0 sm:w-full bg-gray-800 text-white px-2  sm:px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
           />
           {errors.username && <p className="text-pink-500 text-sm">{errors.username}</p>}
         </div>
         {/* Password Input */}
         <div className="relative">
           <input
             type="password"
             name="password"
             placeholder="Password"
             value={formData.password}
             onChange={handleInputChange}
             className="w-[85%] ml-6 sm:ml-0 sm:w-full bg-gray-800 text-white px-2  sm:px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
           />
           {errors.password && <p className="text-pink-500 text-sm">{errors.password}</p>}
         </div>
         {/* Buttons */}
         <div className="flex flex-col space-y-2">
          { <button
             disabled = {loading}
             type="submit"
             className={` w-[75%] mx-auto sm:w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             {loading ? <div className="inline-block h-6 sm:w-6 animate-spin rounded-full border-b-2 border-gray-900 border-t-2 "></div>: "Login"}
           </button>}
           <div className="text-center text-white">
             Don't have an account?{" "}
             <Link
               to={"/signup"}
               className="text-pink-500 font-bold hover:underline"
             >
               Create it
             </Link>
           </div>
         </div>
       </form>
    
      </div>
    </div>
  );
};

export default Login;
