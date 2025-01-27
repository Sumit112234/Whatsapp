import React, { useEffect } from 'react'
import LeftMenu from '../components/LeftMenu'
import ChatDetail from '../components/ChatDetail'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/userHandler';




const Whatsapp = () => {

  let navigate = useNavigate();
  
  const { user , setUser,mobileSelectedUser} = useAuth();

  const setUserData = async()=>{
    // //console.log("useEffect from whatsapp : " , user);
    if(!user)
    {
      try {
        let res = await getUser();
        // //console.log(res)
        setUser(res);
        navigate('/')
      } catch (e) {
        //console.log("some error occured in api.jsx : ", e)
        navigate('/login');
      }
    }
    else{
      navigate('/')
    }
  }

  useEffect(()=>{
    setUserData();
  },[])
  useEffect(()=>{
    if(!user)
        navigate('/login');
  },[user])
  
  return (
    // main container
    <div className='w-screen h-screen overflow-hidden'>
        {/* components container */}
        <div className='flex sm:hidden justify-start whatsapp-bp:justify-center items-center bg-[#111a21] h-screen'>
            
         {!mobileSelectedUser ? (<div className='bg-[#111a21]  h-screen'>


                <LeftMenu/>
            </div>)
        :
        (    <div className='bg-[#222f3f] w-screen sm:w-full h-screen'>
                <ChatDetail/>
            </div>)}
        </div>
        <div className=' hidden sm:flex justify-start whatsapp-bp:justify-center items-center bg-[#111a21] h-screen'>
            {/* left menu */}
          <div className='bg-[#111a21]  h-screen'>


                <LeftMenu/>
            </div>
            {/* chat details */}
            <div className='bg-[#222f3f] w-screen sm:w-full h-screen'>
                <ChatDetail/>
            </div>
        </div>
    </div>
  )
}

export default Whatsapp;
