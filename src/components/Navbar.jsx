import React, { useEffect, useState } from 'react'
import "./navbar.css"
const baseURL = import.meta.env.VITE_API_URL;
const Navbar = () => {
  const [userName, setUserName] = useState("");
  async function clearlocalstorage() {
    // http://localhost:5173/logout
    let data = await fetch(`${baseURL}/logout`, {
      credentials: "include"
    })

    localStorage.removeItem("loginInfo");
    window.location.href = "/";
  }

  useEffect(() => {
    async function sendusername() {
      
      let data = localStorage.getItem("loginInfo");
      if (!data) {
        // http://localhost:5173/getUserName
        let res = await fetch(`${baseURL}/getUserName`,{
          credentials:"include"
        })
        let data2 = await res.json();
        setUserName(data2);
      } else {
        let user = JSON.parse(data);
        setUserName(user.data.name);
      }
    }

    sendusername();
  }, [])

  return (
    <div className="nav flex w-full  justify-between px-40 min-h-16 text-center items-center  bg-purple-500">
      <p className=' text-white font-bold text-2xl cursor-pointer ' >{userName}</p>
      <ul className='flex justify-center items-center gap-6'>
        <li className='font-bold text-[1rem] cursor-pointer  bg-amber-100 hover:scale-105 hover:bg-amber-300  text-black rounded-2xl p-2 ' ><a href="/profile">Profile</a></li>
        <li onClick={clearlocalstorage} className=' bg-amber-400  hover:scale-105 hover:bg-amber-100  rounded-2xl p-2  font-bold text-[1rem] cursor-pointer text-red-500' >logout</li>
      </ul>
    </div>
  )
}

export default Navbar