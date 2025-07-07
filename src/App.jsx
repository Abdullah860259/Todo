import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Reg from './components/Reg'
import Footer from './components/Footer'
import CreateTask from './components/CreateTask'
import Profile from './components/Profile'
const baseURL = import.meta.env.VITE_API_URL;
const App = () => {
  
  const [loginstatus, setloginstatus] = useState(false);
  function checkgooglelog(){
    let time = new Date().getTime();
    let localdata = JSON.parse(localStorage.getItem("loginInfo"));
    if(!localdata){
      return false;
    }
    if(localdata.expiry > time){
      return true
    }else{
      localStorage.removeItem("loginInfo");
      return false
    }
  }
  
  async function islogged () {
    let googlelog = checkgooglelog();
    if (googlelog === true ){
      setloginstatus(true)
       return;
    }
      const data = await fetch(`${baseURL}/islogged`,{
        credentials:"include",
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          authorization:`Bearer ${localStorage.getItem("loginInfo")}`
        }
      });
    if (data.status === 200) {
      setloginstatus(true)
    }else{
      setloginstatus(false)
    }
  }

  useEffect(() => {
    islogged();
  },[]);
  

  return (
    <>
      <Routes>
        {loginstatus 
        ?(<Route path='/' element={<Home/>}/>)
        :(<Route path='/' element={<Login/>}/>)
      }
      <Route path="reg" element={<Reg/>}/>
      <Route path="createtask" element={<CreateTask/>}/>
      <Route path='profile'element={<Profile/>} ></Route>
      </Routes>    
      <Footer/>
    </>
  )
}

export default App