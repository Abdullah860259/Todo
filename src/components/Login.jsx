import React, { useState } from 'react'
import "../login.css"
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import Error from './Error'
const baseURL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showError, setshowError] = useState(false);
  const [errTitle, seterrTitle] = useState("")
  
  const sendDatatoBackend = async (data,item)=>{ 
    // "http://localhost:5173/googleLogin"
    const sendedData = await fetch(`${baseURL}/googleLogin`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name:data.name,
        email:data.email,
        picture:data.picture
      })
    })
    const res = await sendedData.json();
    if (sendedData.status === 401) {  
      return  seterrTitle(res.message) ,setshowError(true);
    }
      localStorage.setItem("loginInfo", JSON.stringify(item));
      window.location.href = "/";
  }

  const login = useGoogleLogin({
    onSuccess: token => googleLogin(token),
    onError: () => {
      seterrTitle("Google Login Has Failed. Please Try Again");
      setshowError(true)
    },
  });

  async function googleLogin(token) {
    let res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    let data = await res.json();
    const now = new Date();
    const item = {
      data,
      expiry: now.getTime() + 86400000,
    }
    sendDatatoBackend(data,item);
  }

  function emailhandler(e) {
    setemail(e.target.value);
  }


  function passwordhandler(e) {
    setpassword(e.target.value);
  }


  async function sendreq() {
    
    if (password.length !== 0 && email.length !== 0) {
      // http://localhost:5173/login
      let res = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        })
      })
      if (res.status == 200) {
        window.location.reload();
      }else{
        seterrTitle("EMAIL or PASSWORD is INVALID.");
        setshowError(true);
      }
    }else{
      seterrTitle("EMAIL and PASSWORD Must not be Empty.")
      setshowError(true)
    }
  }


  return (
    <>
      <div className="login h-full border w-[100vw] flex justify-center items-center ">
        <div className='forms flex  justify-center items-center flex-col p-10 gap-4 '>
          <h1 className=' text-5xl font-bold mb-8 ' >Login</h1>
          <div className='w-full relative'>
            <input value={email} onChange={emailhandler} type="text" className='  outline-none border-none w-full rounded-2xl py-3  px-3' placeholder='Email' name='email' />
            <div className='svgs'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480q81 0 169-16.5T800-540v400q-60 27-146 43.5T480-80q-88 0-174-16.5T160-140v-400q63 27 151 43.5T480-480Zm240 280v-230q-50 14-115.5 22T480-400q-59 0-124.5-8T240-430v230q50 18 115 29t125 11q60 0 125-11t115-29ZM480-880q66 0 113 47t47 113q0 66-47 113t-113 47q-66 0-113-47t-47-113q0-66 47-113t113-47Zm0 240q33 0 56.5-23.5T560-720q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720q0 33 23.5 56.5T480-640Zm0-80Zm0 425Z" /></svg>
            </div>
          </div>
          <div className='w-full relative'>
            <input value={password} onChange={passwordhandler} type="password" name='password' className=' outline-none border-none w-full rounded-2xl py-3 px-3 ' placeholder='Password' />
            <div className='svgs'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" /></svg>
            </div>
          </div>
          <button onClick={sendreq} className="loginbtn mt-6 font-bold cursor-pointer 
             bg-white text-black rounded-3xl w-full p-3 
             transition-all duration-100 ease-in-out 
           hover:scale-105"
          >Login</button>
          <p>Don't have an account? <a href="/reg" className='font-bold inline-block transition-transform duration-100  hover:scale-105 '>Register</a></p>
          <button className="googlelogin flex p-[3px] rounded-md cursor-pointer justify-between gap-3 items-center 
             bg-blue-500 text-white font-semibold px-2 py-2 
             transition-all duration-150 ease-in-out 
             hover:bg-blue-600 hover:scale-105 hover:shadow-lg" onClick={() => login()}>
            <div className=' bg-white p-1.5 rounded-sm'>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
            </div>
            <p className=' mr-2 '>Sign In with Google</p>
          </button>
        </div>
        {showError && (<Error decs={errTitle} onClose={()=>{setshowError(false)}} />)}
      </div>
    </>
  )
}

export default Login