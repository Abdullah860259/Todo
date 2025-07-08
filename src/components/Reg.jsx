import React, { useEffect, useRef, useState } from 'react'
import "../register.css"
import Error from './Error'
import { UNSAFE_withHydrateFallbackProps } from 'react-router-dom';
const baseURL = import.meta.env.VITE_API_URL;

const Reg = () => {
    const inputs = useRef([]);
    const [showerror, setShowerror] = useState(false);
    const [errTitle, seterrTitle] = useState("");
    const [form, setform] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        dob: "",
    })

    const keyhandler = (key,index)=>{
        if (key.key === "Enter") {
            key.preventDefault();
            if (inputs.current[index+1]) {
                inputs.current[index+1].focus();
            }
            if (index === 5) {
                sendreq();
            }
        }
    }
    function checkvalidation() {
        const isempty = Object.values(form).some(val => val === "");
        if (isempty) {
            let title = "";
            let emptyfields = Object.entries(form).filter(([key, value]) => value === "").map(([key]) => key);
            for (const e of emptyfields) {
                let word = e.toUpperCase() + "  " ;
                title = title + word;
            }
            seterrTitle(title + "Must not be Empty.");
            setShowerror(true);
            return false;
        }
        return true;
    }

    function handler(e) {
        setform({ ...form, [e.target.name]: e.target.value });
    }

    const sendreq = async () => {
        let validation = checkvalidation();
        if (validation) {
            try {
                // http://localhost:5173/register"
                let res = await fetch(`${baseURL}/register`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: form.name,
                        username: form.username,
                        email: form.email,
                        password: form.password,
                        dob: form.dob
                    })
                })
                let data = await res.json();
                 if (res.status == 401) {
                    seterrTitle(data.message);
                    setShowerror(true);
                 }
                if (res.status == 201) {
                    window.location.href = "/";
                } else {
                    console.log(res.status)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <>
            <div className="login h-[100vh] border w-[100vw] flex justify-center items-center ">
                <div className='forms flex  justify-center items-center flex-col p-10 gap-3 '>
                    <h1 className=' text-3xl font-bold mb-2 ' >Register</h1>
                    <input
                    ref={(el)=>(inputs.current[0] = el)}
                    onKeyDown={(e)=>keyhandler(e,0)}
                    onChange={handler}
                    type="text"
                    className='  outline-none border-none w-full rounded-2xl py-2.5  px-3'
                    placeholder='Name'
                    name='name'
                    />
                    <input
                    ref={(el)=>(inputs.current[1] = el)}
                    onKeyDown={(e)=>keyhandler(e,1)}
                    onChange={handler}
                    type="text"
                    name='username'
                    className=' outline-none border-none w-full rounded-2xl py-2.5 px-3 ' placeholder='Username'
                    />
                    <input
                    ref={(el)=>(inputs.current[2] = el)}
                    onKeyDown={(e)=>keyhandler(e,2)}
                    onChange={handler}
                    type="text"
                    className='  outline-none border-none w-full rounded-2xl py-2.5  px-3'
                    placeholder='Email'
                    name='email'
                    />
                    <input
                    ref={(el)=>(inputs.current[3] = el)}
                    onKeyDown={(e)=>keyhandler(e,3)}
                    onChange={handler}
                    type="password"
                    className='  outline-none border-none w-full rounded-2xl py-2.5  px-3' placeholder='Password'
                    name='password'
                    />
                    <input
                    ref={(el)=>(inputs.current[4] = el)}
                    onKeyDown={(e)=>keyhandler(e,4)}
                    onChange={handler}
                    type="Date"
                    className='  outline-none border-none w-full rounded-2xl py-2.5  px-3'
                    placeholder='Date of Birth'
                    name='dob'
                    />
                    <button
                    ref={(el)=>(inputs.current[5] = el)}
                    onKeyDown={(e)=>keyhandler(e,5)}
                    onClick={sendreq}
                    className="loginbtn mt-6 font-bold cursor-pointer bg-white text-black rounded-3xl w-full p-3 transition-all duration-100 ease-in-out 
                    hover:scale-105" >Register</button>
                    <p>Have an account? <a href="/" className='font-bold inline-block transition-transform duration-100  hover:scale-105 '>login</a></p>
                </div>
                {showerror && (<Error decs={errTitle} onClose={() => { setShowerror(false) }} />)}
            </div>
        </>
    )
}

export default Reg